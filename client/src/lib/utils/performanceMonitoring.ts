// Web Vitals monitoring for Core Web Vitals tracking
interface PerformanceEntryWithTime extends PerformanceEntry {
  renderTime?: number;
  loadTime?: number;
}

export interface WebVitalsMetrics {
  lcp?: number;
  inp?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

const metrics: WebVitalsMetrics = {};

export function trackWebVitals() {
  // Track Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntryWithTime;
        metrics.lcp = (lastEntry.renderTime || lastEntry.loadTime) as number;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer failed:', e);
    }

    // Track Interaction to Next Paint (INP) - replaces FID
    try {
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const maxDuration = Math.max(...entries.map((entry: any) => entry.duration));
        metrics.inp = maxDuration;
      });
      inpObserver.observe({ entryTypes: ['event'] });
    } catch (e) {
      console.warn('INP observer failed:', e);
    }

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            metrics.cls = clsValue;
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer failed:', e);
    }

    // Track First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        metrics.fcp = entries[0].startTime;
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('FCP observer failed:', e);
    }
  }

  // Navigation Timing
  window.addEventListener('load', () => {
    const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navTiming) {
      metrics.ttfb = navTiming.responseStart - navTiming.fetchStart;
    }
    
    // Log metrics when page is fully loaded
    console.log('Core Web Vitals:', {
      lcp: metrics.lcp?.toFixed(2) + 'ms',
      inp: metrics.inp?.toFixed(2) + 'ms',
      cls: metrics.cls?.toFixed(3),
      fcp: metrics.fcp?.toFixed(2) + 'ms',
      ttfb: metrics.ttfb?.toFixed(2) + 'ms'
    });
  });
}

export function getWebVitals(): WebVitalsMetrics {
  return metrics;
}
