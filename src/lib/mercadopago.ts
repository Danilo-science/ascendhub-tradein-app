import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import * as crypto from 'crypto';

// Configuración de MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
    idempotencyKey: 'abc',
  }
});

export interface PaymentItem {
  id: string;
  title: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
}

export interface PaymentPayer {
  name?: string;
  surname?: string;
  email: string;
  phone?: {
    area_code?: string;
    number?: string;
  };
  identification?: {
    type?: string;
    number?: string;
  };
  address?: {
    street_name?: string;
    street_number?: string;
    zip_code?: string;
  };
}

export interface PaymentPreferenceData {
  items: PaymentItem[];
  payer?: PaymentPayer;
  back_urls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
  auto_return?: 'approved' | 'all';
  payment_methods?: {
    excluded_payment_methods?: Array<{ id: string }>;
    excluded_payment_types?: Array<{ id: string }>;
    installments?: number;
  };
  notification_url?: string;
  statement_descriptor?: string;
  external_reference?: string;
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
}

/**
 * Crea una preferencia de pago en MercadoPago
 */
export async function createPaymentPreference(
  preferenceData: PaymentPreferenceData
): Promise<unknown> {
  try {
    const preference = new Preference(client);
    
    const body = {
      items: preferenceData.items,
      payer: preferenceData.payer,
      back_urls: preferenceData.back_urls || {
        success: `${process.env.NEXTAUTH_URL}/payment/success`,
        failure: `${process.env.NEXTAUTH_URL}/payment/failure`,
        pending: `${process.env.NEXTAUTH_URL}/payment/pending`,
      },
      auto_return: preferenceData.auto_return || 'approved',
      payment_methods: preferenceData.payment_methods,
      notification_url: preferenceData.notification_url || `${process.env.NEXTAUTH_URL}/api/webhooks/mercadopago`,
      statement_descriptor: preferenceData.statement_descriptor || 'AscendHub',
      external_reference: preferenceData.external_reference,
      expires: preferenceData.expires,
      expiration_date_from: preferenceData.expiration_date_from,
      expiration_date_to: preferenceData.expiration_date_to,
    };

    const result = await preference.create({ body });
    return result;
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    throw new Error('Failed to create payment preference');
  }
}

/**
 * Obtiene información de un pago
 */
export async function getPaymentInfo(paymentId: string): Promise<unknown> {
  try {
    const payment = new Payment(client);
    const result = await payment.get({ id: paymentId });
    return result;
  } catch (error) {
    console.error('Error getting payment info:', error);
    throw new Error('Failed to get payment information');
  }
}

/**
 * Procesa un webhook de MercadoPago
 */
export async function processWebhook(
  body: unknown,
  headers: Record<string, string>
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    // Verificar la autenticidad del webhook
    const signature = headers['x-signature'];
    const requestId = headers['x-request-id'];
    
    if (!signature || !requestId) {
      return { success: false, error: 'Missing required headers' };
    }

    // Procesar según el tipo de notificación
    const webhookBody = body as { type?: string; data?: { id: string } };
    const { type, data } = webhookBody;
    
    if (!type || !data) {
      return { success: false, error: 'Invalid webhook body structure' };
    }
    
    switch (type) {
      case 'payment': {
        const paymentInfo = await getPaymentInfo(data.id);
        return { success: true, data: paymentInfo };
      }
      case 'plan': {
        // Manejar notificaciones de planes de suscripción
        return { success: true, data: { type: 'plan', id: data.id } };
      }
        
      case 'subscription':
        // Manejar notificaciones de suscripciones
        return { success: true, data: { type: 'subscription', id: data.id } };
        
      case 'invoice':
        // Manejar notificaciones de facturas
        return { success: true, data: { type: 'invoice', id: data.id } };
        
      default:
        return { success: false, error: `Unknown notification type: ${type}` };
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return { success: false, error: 'Failed to process webhook' };
  }
}

/**
 * Verifica la firma del webhook para seguridad
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Implementar verificación de firma según la documentación de MercadoPago
    // Esta es una implementación básica, se debe ajustar según los requerimientos
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    
    return signature === expectedSignature;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Crea un pago para trade-in
 */
export async function createTradeInPayment(
  tradeInValue: number,
  productPrice: number,
  customerInfo: PaymentPayer,
  tradeInId: string
): Promise<unknown> {
  try {
    const finalAmount = productPrice - tradeInValue;
    
    if (finalAmount <= 0) {
      // Si el trade-in cubre el precio completo, no se necesita pago
      return { 
        success: true, 
        message: 'Trade-in covers full product price',
        amount_to_pay: 0 
      };
    }

    const preferenceData: PaymentPreferenceData = {
      items: [
        {
          id: `tradein-${tradeInId}`,
          title: 'Pago con Trade-In - AscendHub',
          description: `Pago final después de descuento por trade-in de $${tradeInValue}`,
          quantity: 1,
          currency_id: 'ARS',
          unit_price: finalAmount,
        }
      ],
      payer: customerInfo,
      external_reference: `tradein-${tradeInId}`,
      statement_descriptor: 'AscendHub Trade-In',
    };

    return await createPaymentPreference(preferenceData);
  } catch (error) {
    console.error('Error creating trade-in payment:', error);
    throw new Error('Failed to create trade-in payment');
  }
}

/**
 * Hook personalizado para manejar pagos (para usar en componentes React)
 */
export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPreference = async (preferenceData: PaymentPreferenceData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createPaymentPreference(preferenceData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear preferencia de pago';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPayment = async (paymentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getPaymentInfo(paymentId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener información del pago';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPreference, getPayment, loading, error };
}

// Importar useState para el hook
import { useState } from 'react';

// Configuración del SDK para el frontend
export const mercadoPagoConfig = {
  publicKey: process.env.MERCADOPAGO_PUBLIC_KEY!,
  locale: 'es-AR',
};

export default client;