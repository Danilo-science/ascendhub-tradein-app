// Google Analytics 4 Configuration and Event Tracking
type GtagCommand = 'config' | 'event' | 'js' | 'set';
type GtagConfigParams = {
  page_title?: string;
  page_location?: string;
  anonymize_ip?: boolean;
  allow_google_signals?: boolean;
  [key: string]: unknown;
};
type GtagEventParams = {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
};

declare global {
  interface Window {
    gtag: (command: GtagCommand, targetId: string | Date, params?: GtagConfigParams | GtagEventParams) => void;
    dataLayer: unknown[];
  }
}

export interface TradeInEvent {
  device_type: string;
  device_brand: string;
  device_model: string;
  condition: string;
  estimated_value: number;
  user_id?: string;
}

export interface AuthEvent {
  method: 'email' | 'google' | 'facebook';
  user_id?: string;
}

export interface PageViewEvent {
  page_title: string;
  page_location: string;
  page_path: string;
}

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
  if (typeof window === 'undefined') return;

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(command: GtagCommand, targetId: string | Date, params?: GtagConfigParams | GtagEventParams) {
    window.dataLayer.push([command, targetId, params]);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
};

// Track page views
export const trackPageView = (event: PageViewEvent) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', process.env.VITE_GA_MEASUREMENT_ID!, {
    page_title: event.page_title,
    page_location: event.page_location,
    page_path: event.page_path,
  });
};

// Track trade-in form submissions
export const trackTradeInSubmission = (event: TradeInEvent) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'trade_in_submission', {
    event_category: 'Trade In',
    event_label: `${event.device_brand} ${event.device_model}`,
    device_type: event.device_type,
    device_brand: event.device_brand,
    device_model: event.device_model,
    condition: event.condition,
    estimated_value: event.estimated_value,
    user_id: event.user_id,
    custom_parameters: {
      device_info: `${event.device_brand} ${event.device_model}`,
      condition_rating: event.condition,
      value_range: getValueRange(event.estimated_value),
    },
  });
};

// Track authentication events
export const trackAuth = (action: 'login' | 'register' | 'logout', event: AuthEvent) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: 'Authentication',
    event_label: event.method,
    method: event.method,
    user_id: event.user_id,
  });
};

// Track form interactions
export const trackFormInteraction = (formName: string, action: 'start' | 'complete' | 'abandon') => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', `form_${action}`, {
    event_category: 'Form Interaction',
    event_label: formName,
    form_name: formName,
    interaction_type: action,
  });
};

// Track device selection
export const trackDeviceSelection = (deviceType: string, brand: string, model: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'device_selection', {
    event_category: 'Device Selection',
    event_label: `${brand} ${model}`,
    device_type: deviceType,
    device_brand: brand,
    device_model: model,
  });
};

// Track condition assessment
export const trackConditionAssessment = (condition: string, deviceInfo: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'condition_assessment', {
    event_category: 'Condition Assessment',
    event_label: condition,
    condition: condition,
    device_info: deviceInfo,
  });
};

// Track value estimation
export const trackValueEstimation = (estimatedValue: number, deviceInfo: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'value_estimation', {
    event_category: 'Value Estimation',
    event_label: getValueRange(estimatedValue),
    estimated_value: estimatedValue,
    device_info: deviceInfo,
    value_range: getValueRange(estimatedValue),
  });
};

// Track user engagement
export const trackEngagement = (action: string, category: string, label?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    engagement_time_msec: Date.now(),
  });
};

// Track errors
export const trackError = (error: string, location: string, userId?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'exception', {
    description: error,
    fatal: false,
    location: location,
    user_id: userId,
  });
};

// Track conversion events
export const trackConversion = (value: number, currency: string = 'USD') => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'conversion', {
    event_category: 'Conversion',
    value: value,
    currency: currency,
  });
};

// Helper function to categorize values
const getValueRange = (value: number): string => {
  if (value < 100) return '0-99';
  if (value < 300) return '100-299';
  if (value < 500) return '300-499';
  if (value < 800) return '500-799';
  if (value < 1200) return '800-1199';
  return '1200+';
};

export interface PurchaseItem {
  item_id: string;
  item_name: string;
  category: string;
  quantity: number;
  price: number;
  value: number;
}

// Enhanced ecommerce tracking for trade-in flow
export const trackPurchaseBegin = (items: PurchaseItem[]) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'begin_checkout', {
    event_category: 'Enhanced Ecommerce',
    currency: 'USD',
    value: items.reduce((total, item) => total + item.value, 0),
    items: items,
  });
};

export const trackPurchaseComplete = (transactionId: string, value: number, items: PurchaseItem[]) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'purchase', {
    event_category: 'Enhanced Ecommerce',
    transaction_id: transactionId,
    currency: 'USD',
    value: value,
    items: items,
  });
};

// Custom dimensions for business metrics
export const setCustomDimensions = (userId?: string, userType?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', process.env.VITE_GA_MEASUREMENT_ID!, {
    user_id: userId,
    custom_map: {
      custom_dimension_1: userType || 'anonymous',
      custom_dimension_2: new Date().toISOString().split('T')[0], // Date
    },
  });
};