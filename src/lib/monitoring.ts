// Sentry Configuration and Error Monitoring
import * as Sentry from '@sentry/react';
import React from 'react';

export interface ErrorContext {
  userId?: string;
  userEmail?: string;
  page?: string;
  action?: string;
  deviceInfo?: string;
  additionalData?: Record<string, any>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count';
  tags?: Record<string, string>;
}

// Initialize Sentry
export const initSentry = () => {
  if (typeof window === 'undefined') return;

  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Release tracking
    release: process.env.VITE_APP_VERSION || '1.0.0',
    // Error filtering
    beforeSend(event) {
      // Filter out non-critical errors
      if (event.exception) {
        const errorMessage = event.exception.values?.[0]?.value || '';
        // Skip network errors that are not actionable
        if (errorMessage.includes('NetworkError') || 
            errorMessage.includes('Failed to fetch') ||
            errorMessage.includes('ResizeObserver')) {
          return null;
        }
      }
      return event;
    },
    // Set initial scope
    beforeSendTransaction(event) {
      return event;
    },
  });
};

// Set user context
export const setUserContext = (userId: string, email?: string, additionalData?: Record<string, any>) => {
  Sentry.setUser({
    id: userId,
    email: email,
    ...additionalData,
  });
};

// Clear user context (on logout)
export const clearUserContext = () => {
  Sentry.setUser(null);
};

// Capture custom error with context
export const captureError = (error: Error, context?: ErrorContext) => {
  Sentry.withScope((scope) => {
    if (context) {
      // Set user context
      if (context.userId || context.userEmail) {
        scope.setUser({
          id: context.userId,
          email: context.userEmail,
        });
      }

      // Set tags
      if (context.page) scope.setTag('page', context.page);
      if (context.action) scope.setTag('action', context.action);
      if (context.deviceInfo) scope.setTag('device', context.deviceInfo);

      // Set additional context
      if (context.additionalData) {
        scope.setContext('additional_data', context.additionalData);
      }
    }

    Sentry.captureException(error);
  });
};

// Capture custom message
export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) => {
  Sentry.withScope((scope) => {
    scope.setLevel(level);
    
    if (context) {
      if (context.userId || context.userEmail) {
        scope.setUser({
          id: context.userId,
          email: context.userEmail,
        });
      }
      
      if (context.page) scope.setTag('page', context.page);
      if (context.action) scope.setTag('action', context.action);
      if (context.additionalData) {
        scope.setContext('additional_data', context.additionalData);
      }
    }

    Sentry.captureMessage(message);
  });
};

// Performance monitoring
export const measurePerformance = (metric: PerformanceMetric) => {
  // Send to Sentry as a custom metric
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `${metric.name}: ${metric.value}${metric.unit}`,
    level: 'info',
    data: {
      metric: metric.name,
      value: metric.value,
      unit: metric.unit,
      ...metric.tags,
    },
  });

  // Also track with browser Performance API if available
  if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
    window.performance.mark(`${metric.name}-${metric.value}`);
  }
};

// Track form errors specifically
export const trackFormError = (formName: string, fieldName: string, errorMessage: string, userId?: string) => {
  captureMessage(`Form Error: ${formName} - ${fieldName}`, 'warning', {
    userId,
    page: formName,
    action: 'form_error',
    additionalData: {
      form_name: formName,
      field_name: fieldName,
      error_message: errorMessage,
    },
  });
};

// Track API errors
export const trackAPIError = (endpoint: string, method: string, statusCode: number, errorMessage: string, userId?: string) => {
  captureMessage(`API Error: ${method} ${endpoint}`, 'error', {
    userId,
    action: 'api_error',
    additionalData: {
      endpoint,
      method,
      status_code: statusCode,
      error_message: errorMessage,
    },
  });
};

// Track business logic errors
export const trackBusinessError = (operation: string, errorType: string, details: Record<string, any>, userId?: string) => {
  captureMessage(`Business Error: ${operation} - ${errorType}`, 'error', {
    userId,
    action: 'business_error',
    additionalData: {
      operation,
      error_type: errorType,
      ...details,
    },
  });
};

// Performance timing helpers
export const startTiming = (name: string) => {
  if (typeof window !== 'undefined' && window.performance) {
    window.performance.mark(`${name}-start`);
  }
};

export const endTiming = (name: string) => {
  if (typeof window !== 'undefined' && window.performance) {
    window.performance.mark(`${name}-end`);
    window.performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = window.performance.getEntriesByName(name)[0];
    if (measure) {
      measurePerformance({
        name,
        value: Math.round(measure.duration),
        unit: 'ms',
      });
    }
  }
};

// React Error Boundary integration
export const ErrorBoundary = Sentry.withErrorBoundary;

// Higher-order component for automatic error tracking
export const withErrorTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return Sentry.withErrorBoundary(Component, {
    fallback: ({ resetError }) => React.createElement('div', {
      className: "error-boundary p-4 border border-red-300 rounded-lg bg-red-50"
    }, [
      React.createElement('h2', {
        key: 'title',
        className: "text-lg font-semibold text-red-800 mb-2"
      }, `Algo salió mal en ${componentName}`),
      React.createElement('p', {
        key: 'message',
        className: "text-red-600 mb-4"
      }, "Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado."),
      React.createElement('button', {
        key: 'button',
        onClick: resetError,
        className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      }, "Intentar de nuevo")
    ]),
    beforeCapture: (scope) => {
      scope.setTag('component', componentName);
    },
  });
};

// Custom hook for error tracking in components
export const useErrorTracking = () => {
  const trackError = (error: Error, context?: Omit<ErrorContext, 'page'>) => {
    captureError(error, {
      ...context,
      page: window.location.pathname,
    });
  };

  const trackMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Omit<ErrorContext, 'page'>) => {
    captureMessage(message, level, {
      ...context,
      page: window.location.pathname,
    });
  };

  return { trackError, trackMessage };
};