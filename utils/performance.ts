/**
 * Multi-Agent Performance Monitoring Utility
 * Tracks performance metrics across the application
 */

interface PerformanceMetrics {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private enabled: boolean = import.meta.env.DEV;

  /**
   * Start tracking a performance metric
   */
  startMetric(name: string): void {
    if (!this.enabled) return;
    
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
    });
  }

  /**
   * End tracking and calculate duration
   */
  endMetric(name: string): number | null {
    if (!this.enabled) return null;
    
    const metric = this.metrics.get(name);
    if (!metric) return null;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    metric.endTime = endTime;
    metric.duration = duration;

    // Log to console in dev mode
    console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
    
    return duration;
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Track Web Vitals for frontend performance
   */
  trackWebVitals(): void {
    if (!this.enabled || typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('📊 LCP:', lastEntry.startTime.toFixed(2), 'ms');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            const fid = (entry as any).processingStart - entry.startTime;
            console.log('📊 FID:', fid.toFixed(2), 'ms');
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Observer not supported
      }
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React Hook for performance tracking
 */
export function usePerformanceTracking(componentName: string) {
  const metricName = `Component: ${componentName}`;
  
  React.useEffect(() => {
    performanceMonitor.startMetric(metricName);
    
    return () => {
      performanceMonitor.endMetric(metricName);
    };
  }, [metricName]);
}

/**
 * HOC for performance tracking
 */
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  const name = componentName || Component.displayName || Component.name || 'Unknown';
  
  return (props: P) => {
    usePerformanceTracking(name);
    return <Component {...props} />;
  };
}

// Import React for hooks
import React from 'react';
