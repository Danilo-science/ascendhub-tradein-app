// Webhook handler compatible con Vite
import { processWebhook, verifyWebhookSignature } from '@/lib/mercadopago';
import { supabase } from '@/integrations/supabase/client';

// Interface for webhook result data
interface WebhookResultData {
  paymentId?: string;
  status?: string;
  type?: string;
  id?: string;
}

// Interface for webhook request
interface WebhookRequest {
  body: string;
  headers: Record<string, string>;
}

// Interface for webhook response
interface WebhookResponse {
  success: boolean;
  status: number;
  data?: any;
  error?: string;
}

/**
 * Procesa webhooks de MercadoPago en el frontend
 * Esta función puede ser llamada desde un endpoint de Supabase Edge Functions
 * o desde un servicio externo que maneje los webhooks
 */
export async function handleMercadoPagoWebhook(request: WebhookRequest): Promise<WebhookResponse> {
  try {
    const { body, headers } = request;
    const signature = headers['x-signature'];
    const requestId = headers['x-request-id'];

    // Verificar la firma del webhook
    if (signature && !verifyWebhookSignature(body, signature, requestId || '')) {
      console.error('Invalid webhook signature');
      return {
        success: false,
        status: 401,
        error: 'Invalid signature'
      };
    }

    const webhookData = JSON.parse(body);
    console.log('MercadoPago webhook received:', webhookData);

    // Procesar el webhook
    const webhookHeaders = {
      'x-signature': signature || '',
      'x-request-id': requestId || '',
    };
    const result = await processWebhook(webhookData, webhookHeaders);

    if (result.success) {
      // Actualizar el estado del pedido en Supabase si es necesario
      const resultData = result.data as WebhookResultData;
      if (resultData?.paymentId && resultData?.status) {
        const { error } = await supabase
          .from('orders')
          .update({ 
            payment_status: resultData.status,
            updated_at: new Date().toISOString()
          })
          .eq('payment_id', resultData.paymentId);

        if (error) {
          console.error('Error updating order status:', error);
        }
      }

      return {
        success: true,
        status: 200,
        data: { success: true }
      };
    } else {
      console.error('Error processing webhook:', result.error);
      return {
        success: false,
        status: 500,
        error: 'Error processing webhook'
      };
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      success: false,
      status: 500,
      error: 'Internal server error'
    };
  }
}

/**
 * Función para verificar el estado del endpoint de webhook
 */
export function getWebhookStatus(): WebhookResponse {
  return {
    success: true,
    status: 200,
    data: { 
      message: 'MercadoPago webhook handler is active',
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Hook para usar el webhook handler en componentes React
 */
export function useWebhookHandler() {
  const processWebhookData = async (webhookData: any, headers: Record<string, string>) => {
    const request: WebhookRequest = {
      body: JSON.stringify(webhookData),
      headers
    };
    
    return await handleMercadoPagoWebhook(request);
  };

  return { processWebhookData, getWebhookStatus };
}

// Exportar tipos para uso en otros archivos
export type { WebhookRequest, WebhookResponse, WebhookResultData };