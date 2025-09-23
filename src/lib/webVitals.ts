// Web Vitals monitoring system compatible with web-vitals v5
import React from 'react';
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';
import type { Metric } from 'web-vitals';

// Global gtag declaration
declare global {
  function gtag(...args: any[]): void;
}

// Types for Web Vitals metrics
export interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  timestamp: number;
}

// Performance thresholds based on Core Web Vitals standards
export const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 }
} as const;

// Convert metric to our internal format
function processMetric(metric: Metric): WebVitalMetric {
  const threshold = THRESHOLDS[metric.name as keyof typeof THRESHOLDS];
  let rating: 'good' | 'needs-improvement' | 'poor' = 'good';
  
  if (threshold) {
    if (metric.value > threshold.poor) {
      rating = 'poor';
    } else if (metric.value > threshold.good) {
      rating = 'needs-improvement';
    }
  }

  return {
    name: metric.name,
    value: metric.value,
    rating,
    delta: metric.delta,
    id: metric.id,
    timestamp: Date.now()
  };
}

// Handle metric reporting
function handleMetric(metric: Metric) {
  const processedMetric = processMetric(metric);
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${processedMetric.name}:`, {
      value: processedMetric.value,
      rating: processedMetric.rating,
      delta: processedMetric.delta
    });
  }

  // Send to analytics (you can customize this)
  sendToAnalytics(processedMetric);
}

// Send metrics to analytics service
function sendToAnalytics(metric: WebVitalMetric) {
  // Send to Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
      custom_map: {
        metric_rating: metric.rating
      }
    });
  }

  // Log to console for development monitoring
  console.log(`[Web Vitals] ${metric.name}:`, {
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id
  });
}

// Initialize Web Vitals monitoring
export function initWebVitals() {
  try {
    // Core Web Vitals
    onCLS(handleMetric);
    onINP(handleMetric); // Replaces FID in v5
    onLCP(handleMetric);
    
    // Additional metrics
    onFCP(handleMetric);
    onTTFB(handleMetric);

    console.log('[Web Vitals] Monitoring initialized');
  } catch (error) {
    console.error('[Web Vitals] Failed to initialize:', error);
  }
}

// React hook for Web Vitals
export function useWebVitals() {
  const [metrics, setMetrics] = React.useState<WebVitalMetric[]>([]);

  React.useEffect(() => {
    const handleMetricUpdate = (metric: Metric) => {
      const processedMetric = processMetric(metric);
      setMetrics(prev => [...prev, processedMetric]);
    };

    onCLS(handleMetricUpdate);
    onINP(handleMetricUpdate);
    onLCP(handleMetricUpdate);
    onFCP(handleMetricUpdate);
    onTTFB(handleMetricUpdate);
  }, []);

  return metrics;
}

// Performance budget checker
export function checkPerformanceBudget(metrics: WebVitalMetric[]) {
  const budget = {
    LCP: 2500,
    INP: 200,
    CLS: 0.1,
    FCP: 1800,
    TTFB: 800
  };

  const violations = metrics.filter(metric => {
    const budgetValue = budget[metric.name as keyof typeof budget];
    return budgetValue && metric.value > budgetValue;
  });

  return {
    passed: violations.length === 0,
    violations,
    score: Math.max(0, 100 - (violations.length * 20))
  };
}

export default { initWebVitals, useWebVitals, checkPerformanceBudget };