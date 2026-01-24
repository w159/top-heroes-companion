/**
 * Application Layer - Purchase Tracking Service
 * Tracks in-game purchases and calculates ROI analytics
 */

import {
  IPurchaseService,
  Purchase,
  SpendAnalytics,
  ROIAnalysis,
  IStorageService,
} from '../domain/interfaces';

const PURCHASES_KEY = 'app_purchases_v2';
const ANALYTICS_CACHE_KEY = 'app_purchase_analytics_cache';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export class PurchaseService implements IPurchaseService {
  constructor(private storage: IStorageService) {}

  async recordPurchase(purchase: Omit<Purchase, 'id' | 'timestamp'>): Promise<void> {
    const purchases = await this.getPurchaseHistory();

    const newPurchase: Purchase = {
      ...purchase,
      id: this.generateId(),
      timestamp: new Date(),
    };

    purchases.push(newPurchase);
    this.storage.set(PURCHASES_KEY, purchases);

    // Invalidate analytics cache
    this.storage.remove(ANALYTICS_CACHE_KEY);
  }

  async getPurchaseHistory(): Promise<Purchase[]> {
    return Promise.resolve(this.storage.get<Purchase[]>(PURCHASES_KEY, []));
  }

  async getAnalytics(): Promise<SpendAnalytics> {
    // Check cache
    const cached = this.storage.get<{ data: SpendAnalytics; timestamp: number }>(
      ANALYTICS_CACHE_KEY,
      null as any
    );

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    // Calculate analytics
    const purchases = await this.getPurchaseHistory();

    if (purchases.length === 0) {
      const emptyAnalytics: SpendAnalytics = {
        totalSpent: 0,
        purchaseCount: 0,
        averagePurchase: 0,
        spendingTrend: [],
        categoryBreakdown: {},
      };
      return emptyAnalytics;
    }

    const totalSpent = purchases.reduce((sum, p) => sum + p.costUSD, 0);
    const purchaseCount = purchases.length;
    const averagePurchase = totalSpent / purchaseCount;

    // Build spending trend (monthly aggregation)
    const trendMap = new Map<string, number>();
    purchases.forEach(p => {
      const monthKey = new Date(p.timestamp).toISOString().slice(0, 7); // YYYY-MM
      trendMap.set(monthKey, (trendMap.get(monthKey) || 0) + p.costUSD);
    });

    const spendingTrend = Array.from(trendMap.entries())
      .map(([month, amount]) => ({
        date: new Date(month + '-01'),
        amount,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    purchases.forEach(p => {
      categoryBreakdown[p.type] = (categoryBreakdown[p.type] || 0) + p.costUSD;
    });

    const analytics: SpendAnalytics = {
      totalSpent,
      purchaseCount,
      averagePurchase,
      spendingTrend,
      categoryBreakdown,
    };

    // Cache the result
    this.storage.set(ANALYTICS_CACHE_KEY, {
      data: analytics,
      timestamp: Date.now(),
    });

    return analytics;
  }

  async calculateROI(targetPower: number): Promise<ROIAnalysis> {
    const purchases = await this.getPurchaseHistory();
    const totalSpent = purchases.reduce((sum, p) => sum + p.costUSD, 0);

    // Determine spend profile
    let spendProfile: 'F2P' | 'LowSpender' | 'Whale';
    if (totalSpent === 0) {
      spendProfile = 'F2P';
    } else if (totalSpent < 100) {
      spendProfile = 'LowSpender';
    } else {
      spendProfile = 'Whale';
    }

    // Calculate current power (would come from user data in real implementation)
    const currentPower = this.estimateCurrentPower(purchases);

    // Project power gain for F2P
    const projectedPowerF2P = this.projectPowerF2P(targetPower);

    // Project power gain with spending
    const projectedPowerWithSpend = this.projectPowerWithSpend(targetPower, totalSpent);

    // Calculate time to goal
    const timeToGoalF2P = this.calculateTimeToGoal(currentPower, targetPower, 'F2P');
    const timeToGoalWithSpend = this.calculateTimeToGoal(
      currentPower,
      targetPower,
      spendProfile
    );

    // Calculate efficiency
    const powerGained = currentPower - projectedPowerF2P;
    const efficiency = totalSpent > 0 ? powerGained / totalSpent : 0;

    // Generate recommendation
    const recommendation = this.generateRecommendation(
      spendProfile,
      efficiency,
      timeToGoalF2P,
      timeToGoalWithSpend
    );

    return {
      spendProfile,
      currentPower,
      projectedPowerF2P,
      projectedPowerWithSpend,
      timeToGoalF2P,
      timeToGoalWithSpend,
      efficiency,
      recommendation,
    };
  }

  async clearHistory(): Promise<void> {
    this.storage.remove(PURCHASES_KEY);
    this.storage.remove(ANALYTICS_CACHE_KEY);
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private generateId(): string {
    return `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private estimateCurrentPower(purchases: Purchase[]): number {
    // Simplified power estimation based on purchases
    let power = 1000000; // Base F2P power

    purchases.forEach(p => {
      if (p.rewards.gems) {
        power += p.rewards.gems * 2; // 1 gem ≈ 2 power
      }
      if (p.rewards.heroes) {
        power += p.rewards.heroes.length * 50000; // Hero ≈ 50k power
      }
    });

    return power;
  }

  private projectPowerF2P(targetPower: number): number {
    // F2P can reach ~80% of whale power with time
    return targetPower * 0.8;
  }

  private projectPowerWithSpend(targetPower: number, totalSpent: number): number {
    // Spending accelerates progress but has diminishing returns
    const spendBonus = Math.log(totalSpent + 1) * 0.15;
    return targetPower * (0.8 + spendBonus);
  }

  private calculateTimeToGoal(
    currentPower: number,
    targetPower: number,
    profile: 'F2P' | 'LowSpender' | 'Whale'
  ): number {
    const powerGap = targetPower - currentPower;
    if (powerGap <= 0) return 0;

    // Daily power gain rates
    const dailyRates = {
      F2P: 5000,
      LowSpender: 8000,
      Whale: 15000,
    };

    const dailyGain = dailyRates[profile];
    return Math.ceil(powerGap / dailyGain);
  }

  private generateRecommendation(
    spendProfile: string,
    efficiency: number,
    timeF2P: number,
    timeSpend: number
  ): string {
    const timeSaved = timeF2P - timeSpend;

    if (spendProfile === 'F2P') {
      return `As F2P, focus on daily quests and events. Estimated ${timeF2P} days to goal. Consider the monthly card ($5) to reduce time by ~30%.`;
    }

    if (efficiency < 100) {
      return `Current efficiency: ${efficiency.toFixed(0)} power per $. Focus on high-value packs (Battle Pass, Monthly Card) to improve ROI. Time saved vs F2P: ${timeSaved} days.`;
    }

    if (efficiency < 500) {
      return `Good spend efficiency! Continue with Battle Pass and limited offers. Avoid daily diamond packs. Time saved: ${timeSaved} days.`;
    }

    return `Excellent ROI! Your spending is efficient. You've saved ${timeSaved} days compared to F2P. Current power-per-dollar: ${efficiency.toFixed(0)}.`;
  }
}
