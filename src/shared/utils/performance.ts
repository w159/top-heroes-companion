import React from 'react';

/**
 * Multi-Agent Performance Monitoring Utility
 * Tracks performance metrics across the application
 */

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

interface PerformanceMetrics {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private enabled: boolean = import.meta.env?.DEV || false;

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
            const fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
            console.log('📊 FID:', fid.toFixed(2), 'ms');
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as LayoutShiftEntry).hadRecentInput) {
              clsValue += (entry as LayoutShiftEntry).value;
            }
          }
          console.log('📊 CLS:', clsValue.toFixed(4));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

      } catch (e) {
        // Observer not supported
      }
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React Hook for tracking component mount duration
 */
export function useMountDuration(componentName: string) {
  const metricName = `Mount: ${componentName}`;

  React.useEffect(() => {
    const start = performance.now();

    return () => {
      const duration = performance.now() - start;
      if (import.meta.env?.DEV) {
        console.log(`⏱️ ${metricName} active for ${duration.toFixed(2)}ms`);
      }
    };
  }, [metricName]);
}

/**
 * React Hook for tracking render duration
 */
export function useRenderTracker(componentName: string) {
  const renderStart = React.useRef(performance.now());

  React.useLayoutEffect(() => {
    const duration = performance.now() - renderStart.current;
    if (import.meta.env?.DEV) {
      console.log(`🎨 Render: ${componentName} took ${duration.toFixed(2)}ms`);
    }
    renderStart.current = performance.now(); // Reset for next render
  });
}

/**
 * Deprecated: Use useMountDuration or useRenderTracker instead
 */
export function usePerformanceTracking(componentName: string) {
  useMountDuration(componentName);
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
    useMountDuration(name);
    return <Component {...props} />;
  };
}
