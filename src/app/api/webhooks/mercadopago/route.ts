import { NextRequest, NextResponse } from 'next/server';
import { processWebhook, verifyWebhookSignature } from '@/lib/mercadopago';
import { supabase } from '@/integrations/supabase/client';

// Interface for webhook result data
interface WebhookResultData {
  paymentId?: string;
  status?: string;
  type?: string;
  id?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature');
    const requestId = request.headers.get('x-request-id');

    // Verificar la firma del webhook
    if (signature && !verifyWebhookSignature(body, signature, requestId || '')) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhookData = JSON.parse(body);
    console.log('MercadoPago webhook received:', webhookData);

    // Procesar el webhook
    const headers = {
      'x-signature': signature || '',
      'x-request-id': requestId || '',
    };
    const result = await processWebhook(webhookData, headers);

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

      return NextResponse.json({ success: true });
    } else {
      console.error('Error processing webhook:', result.error);
      return NextResponse.json(
        { error: 'Error processing webhook' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Método GET para verificación del endpoint
export async function GET() {
  return NextResponse.json({ 
    message: 'MercadoPago webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}