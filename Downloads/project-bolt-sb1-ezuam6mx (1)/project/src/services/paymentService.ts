import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];

export interface PaymentDetails {
  bookingId: number;
  amount: number;
  currency: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    booking_id?: string;
    property_id?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
  redirectUrl?: string;
}

export interface PaymentVerification {
  success: boolean;
  paymentId?: string;
  bookingId?: number;
  error?: string;
}

export class PaymentService {
  // Initialize Razorpay payment
  static async initializeRazorpayPayment(paymentDetails: PaymentDetails): Promise<PaymentResponse> {
    try {
      // In a real implementation, you would make an API call to your backend
      // to create a Razorpay order and get the payment details
      
      const orderData = {
        amount: paymentDetails.amount * 100, // Razorpay expects amount in paise
        currency: paymentDetails.currency,
        receipt: `booking_${paymentDetails.bookingId}`,
        notes: {
          booking_id: paymentDetails.bookingId.toString(),
          ...paymentDetails.notes
        }
      };

      // Simulate API call to backend
      console.log('Creating Razorpay order:', orderData);

      // For now, we'll simulate the response
      const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_key',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Infiniti Casa',
        description: paymentDetails.description,
        order_id: mockOrderId,
        prefill: {
          name: paymentDetails.customerName,
          email: paymentDetails.customerEmail,
          contact: paymentDetails.customerPhone
        },
        notes: orderData.notes,
        theme: {
          color: '#3B82F6'
        },
        handler: (response: any) => {
          console.log('Payment successful:', response);
          // Handle successful payment
          this.verifyPayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
          }
        }
      };

      // Load Razorpay script dynamically
      await this.loadRazorpayScript();

      // @ts-ignore - Razorpay types
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

      return {
        success: true,
        orderId: mockOrderId
      };

    } catch (error) {
      console.error('Error initializing Razorpay payment:', error);
      return {
        success: false,
        error: 'Failed to initialize payment'
      };
    }
  }

  // Initialize PhonePe payment
  static async initializePhonePePayment(paymentDetails: PaymentDetails): Promise<PaymentResponse> {
    try {
      const phonePeData = {
        merchantId: import.meta.env.VITE_PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT',
        merchantTransactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: paymentDetails.amount * 100, // PhonePe expects amount in paise
        redirectUrl: `${window.location.origin}/payment/callback`,
        redirectMode: 'POST',
        callbackUrl: `${window.location.origin}/payment/callback`,
        merchantUserId: `MUID_${Date.now()}`,
        mobileNumber: paymentDetails.customerPhone,
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      console.log('Creating PhonePe payment:', phonePeData);

      // In a real implementation, you would make an API call to PhonePe
      // For now, we'll simulate the response
      const mockPaymentId = `phonepe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        paymentId: mockPaymentId,
        redirectUrl: `https://phonepe.com/pay?txnId=${phonePeData.merchantTransactionId}`
      };

    } catch (error) {
      console.error('Error initializing PhonePe payment:', error);
      return {
        success: false,
        error: 'Failed to initialize PhonePe payment'
      };
    }
  }

  // Verify payment
  static async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<PaymentVerification> {
    try {
      // In a real implementation, you would verify the payment signature
      // and update the booking status in your database
      
      console.log('Verifying payment:', { paymentId, orderId, signature });

      // Simulate payment verification
      const isVerified = true; // In real implementation, verify signature

      if (isVerified) {
        // Update booking with payment details
        const bookingId = this.extractBookingIdFromOrderId(orderId);
        
        if (bookingId) {
          await this.updateBookingPaymentStatus(bookingId, paymentId, 'completed');
        }

        return {
          success: true,
          paymentId,
          bookingId
        };
      } else {
        return {
          success: false,
          error: 'Payment verification failed'
        };
      }

    } catch (error) {
      console.error('Error verifying payment:', error);
      return {
        success: false,
        error: 'Payment verification failed'
      };
    }
  }

  // Update booking payment status
  static async updateBookingPaymentStatus(
    bookingId: number, 
    paymentId: string, 
    status: 'pending' | 'completed' | 'failed'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          payment_id: paymentId,
          payment_status: status,
          status: status === 'completed' ? 'confirmed' : 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking payment status:', error);
        throw error;
      }

      console.log(`Booking ${bookingId} payment status updated to ${status}`);

    } catch (error) {
      console.error('PaymentService.updateBookingPaymentStatus error:', error);
      throw error;
    }
  }

  // Get payment status
  static async getPaymentStatus(paymentId: string): Promise<{
    status: string;
    bookingId?: number;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, payment_status, status')
        .eq('payment_id', paymentId)
        .single();

      if (error) {
        console.error('Error fetching payment status:', error);
        throw error;
      }

      return {
        status: data.payment_status || 'unknown',
        bookingId: data.id
      };

    } catch (error) {
      console.error('PaymentService.getPaymentStatus error:', error);
      return {
        status: 'error',
        error: 'Failed to fetch payment status'
      };
    }
  }

  // Process payment callback
  static async processPaymentCallback(callbackData: any): Promise<PaymentVerification> {
    try {
      console.log('Processing payment callback:', callbackData);

      // Extract payment details from callback
      const { paymentId, orderId, signature, status } = callbackData;

      if (status === 'SUCCESS') {
        return await this.verifyPayment(paymentId, orderId, signature);
      } else {
        return {
          success: false,
          error: `Payment failed: ${status}`
        };
      }

    } catch (error) {
      console.error('Error processing payment callback:', error);
      return {
        success: false,
        error: 'Failed to process payment callback'
      };
    }
  }

  // Refund payment
  static async refundPayment(paymentId: string, amount?: number): Promise<{
    success: boolean;
    refundId?: string;
    error?: string;
  }> {
    try {
      console.log('Processing refund for payment:', paymentId);

      // In a real implementation, you would call the payment gateway's refund API
      const mockRefundId = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Update booking status
      const { data: booking } = await supabase
        .from('bookings')
        .select('id')
        .eq('payment_id', paymentId)
        .single();

      if (booking) {
        await this.updateBookingPaymentStatus(booking.id, paymentId, 'refunded');
      }

      return {
        success: true,
        refundId: mockRefundId
      };

    } catch (error) {
      console.error('Error processing refund:', error);
      return {
        success: false,
        error: 'Failed to process refund'
      };
    }
  }

  // Get payment methods
  static getPaymentMethods(): Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    enabled: boolean;
  }> {
    return [
      {
        id: 'razorpay',
        name: 'Credit/Debit Cards',
        description: 'Pay securely with your card',
        icon: '💳',
        enabled: true
      },
      {
        id: 'phonepe',
        name: 'PhonePe',
        description: 'Pay with PhonePe UPI',
        icon: '📱',
        enabled: true
      },
      {
        id: 'upi',
        name: 'UPI',
        description: 'Pay with any UPI app',
        icon: '🏦',
        enabled: true
      },
      {
        id: 'netbanking',
        name: 'Net Banking',
        description: 'Pay with your bank account',
        icon: '🏛️',
        enabled: false // Disabled for now
      }
    ];
  }

  // Load Razorpay script
  private static async loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.head.appendChild(script);
    });
  }

  // Extract booking ID from order ID
  private static extractBookingIdFromOrderId(orderId: string): number | null {
    const match = orderId.match(/booking_(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  // Calculate payment amount with fees
  static calculatePaymentAmount(baseAmount: number, paymentMethod: string): {
    baseAmount: number;
    fees: number;
    totalAmount: number;
    currency: string;
  } {
    let fees = 0;
    
    switch (paymentMethod) {
      case 'razorpay':
        fees = Math.round(baseAmount * 0.029); // 2.9% + 30 paise
        break;
      case 'phonepe':
        fees = Math.round(baseAmount * 0.025); // 2.5%
        break;
      case 'upi':
        fees = Math.round(baseAmount * 0.01); // 1%
        break;
      default:
        fees = Math.round(baseAmount * 0.02); // 2% default
    }

    return {
      baseAmount,
      fees,
      totalAmount: baseAmount + fees,
      currency: 'INR'
    };
  }

  // Get payment gateway status
  static async getPaymentGatewayStatus(): Promise<{
    razorpay: boolean;
    phonepe: boolean;
  }> {
    // In a real implementation, you would check if the payment gateways are available
    return {
      razorpay: !!import.meta.env.VITE_RAZORPAY_KEY_ID,
      phonepe: !!import.meta.env.VITE_PHONEPE_MERCHANT_ID
    };
  }
} 