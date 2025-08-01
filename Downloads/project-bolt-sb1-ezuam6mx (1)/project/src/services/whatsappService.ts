interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'media' | 'interactive';
  content: string | WhatsAppTemplate | WhatsAppMedia | WhatsAppInteractive;
}

interface WhatsAppTemplate {
  name: string;
  language: string;
  components: WhatsAppComponent[];
}

interface WhatsAppComponent {
  type: 'header' | 'body' | 'button' | 'footer';
  text?: string;
  image?: { link: string };
  buttons?: WhatsAppButton[];
}

interface WhatsAppButton {
  type: 'reply' | 'url' | 'phone_number';
  text: string;
  value?: string;
}

interface WhatsAppMedia {
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  caption?: string;
  filename?: string;
}

interface WhatsAppInteractive {
  type: 'button' | 'list' | 'product' | 'product_list';
  header?: { type: string; text: string };
  body: { text: string };
  footer?: { text: string };
  action: {
    buttons?: WhatsAppButton[];
    sections?: any[];
  };
}

interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
}

interface OTPData {
  phone: string;
  otp: string;
  purpose: 'login' | 'booking' | 'verification';
  expiresAt: Date;
}

import { supabase } from '../lib/supabase';

interface BookingNotificationData {
  bookingId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  totalAmount: number;
  confirmationCode: string;
  phone: string;
}

class WhatsAppService {
  private static instance: WhatsAppService;
  private readonly API_BASE_URL = process.env.REACT_APP_WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
  private readonly PHONE_NUMBER_ID = process.env.REACT_APP_WHATSAPP_PHONE_NUMBER_ID;
  private readonly ACCESS_TOKEN = process.env.REACT_APP_WHATSAPP_ACCESS_TOKEN;
  private readonly VERIFY_TOKEN = process.env.REACT_APP_WHATSAPP_VERIFY_TOKEN;

  private constructor() {}

  static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  // OTP Generation and Delivery
  async sendOTP(phone: string, purpose: OTPData['purpose']): Promise<{ success: boolean; otp?: string; error?: string }> {
    try {
      // Generate OTP
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in database
      await this.storeOTP(phone, otp, purpose, expiresAt);

      // Send OTP via WhatsApp
      const message = this.createOTPMessage(phone, otp, purpose);
      const response = await this.sendMessage(message);

      if (response.success) {
        return { success: true, otp };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, error: 'Failed to send OTP' };
    }
  }

  async verifyOTP(phone: string, otp: string, purpose: OTPData['purpose']): Promise<{ valid: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('phone', phone)
        .eq('otp', otp)
        .eq('purpose', purpose)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        return { valid: false, error: 'Invalid or expired OTP' };
      }

      // Mark OTP as used
      await supabase
        .from('otp_verifications')
        .update({ is_used: true, used_at: new Date().toISOString() })
        .eq('id', data.id);

      return { valid: true };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { valid: false, error: 'Verification failed' };
    }
  }

  // Booking Notifications
  async sendBookingConfirmation(data: BookingNotificationData): Promise<WhatsAppResponse> {
    try {
      const message = this.createBookingConfirmationMessage(data);
      return await this.sendMessage(message);
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      return { success: false, error: 'Failed to send booking confirmation' };
    }
  }

  async sendBookingReminder(bookingId: string, checkInDate: string, guestPhone: string): Promise<WhatsAppResponse> {
    try {
      const message = this.createBookingReminderMessage(guestPhone, checkInDate);
      return await this.sendMessage(message);
    } catch (error) {
      console.error('Error sending booking reminder:', error);
      return { success: false, error: 'Failed to send booking reminder' };
    }
  }

  async sendCheckInInstructions(bookingId: string, propertyAddress: string, guestPhone: string): Promise<WhatsAppResponse> {
    try {
      const message = this.createCheckInInstructionsMessage(guestPhone, propertyAddress);
      return await this.sendMessage(message);
    } catch (error) {
      console.error('Error sending check-in instructions:', error);
      return { success: false, error: 'Failed to send check-in instructions' };
    }
  }

  async sendCheckOutReminder(bookingId: string, checkOutDate: string, guestPhone: string): Promise<WhatsAppResponse> {
    try {
      const message: WhatsAppMessage = {
        to: guestPhone,
        type: 'text',
        content: `🔔 Check-out Reminder\n\nYour stay at Infiniti Casa ends tomorrow (${checkOutDate}).\n\nPlease ensure you check out by 11:00 AM.\n\nWe hope you enjoyed your stay!`
      };
      return await this.sendMessage(message);
    } catch (error) {
      console.error('Error sending check-out reminder:', error);
      return { success: false, error: 'Failed to send check-out reminder' };
    }
  }

  // Customer Service
  async sendWelcomeMessage(phone: string, userName: string): Promise<WhatsAppResponse> {
    try {
      const message = this.createWelcomeMessage(phone, userName);
      return await this.sendMessage(message);
    } catch (error) {
      console.error('Error sending welcome message:', error);
      return { success: false, error: 'Failed to send welcome message' };
    }
  }

  async sendSupportMessage(phone: string, issue: string): Promise<WhatsAppResponse> {
    try {
      const message = this.createSupportMessage(phone, issue);
      return await this.sendMessage(message);
    } catch (error) {
      console.error('Error sending support message:', error);
      return { success: false, error: 'Failed to send support message' };
    }
  }

  async sendFeedbackRequest(bookingId: string, guestPhone: string, propertyName: string): Promise<WhatsAppResponse> {
    try {
      const message = this.createFeedbackRequestMessage(guestPhone, propertyName);
      return await this.sendMessage(message);
    } catch (error) {
      console.error('Error sending feedback request:', error);
      return { success: false, error: 'Failed to send feedback request' };
    }
  }

  // Marketing and Promotions
  async sendPromotionalMessage(phone: string, promotion: any): Promise<WhatsAppResponse> {
    try {
      const message = this.createPromotionalMessage(phone, promotion);
      return await this.sendMessage(message);
    } catch (error) {
      console.error('Error sending promotional message:', error);
      return { success: false, error: 'Failed to send promotional message' };
    }
  }

  async sendPropertyRecommendation(phone: string, properties: any[]): Promise<WhatsAppResponse> {
    try {
      const message = this.createPropertyRecommendationMessage(phone, properties);
      return await this.sendMessage(message);
    } catch (error) {
      console.error('Error sending property recommendation:', error);
      return { success: false, error: 'Failed to send property recommendation' };
    }
  }

  // Message Creation Methods
  private createOTPMessage(phone: string, otp: string, purpose: string): WhatsAppMessage {
    const template: WhatsAppTemplate = {
      name: 'otp_verification',
      language: 'en',
      components: [
        {
          type: 'body',
          text: `Your Infiniti Casa verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this message.`
        }
      ]
    };

    return {
      to: phone,
      type: 'template',
      content: template
    };
  }

  private createBookingConfirmationMessage(data: BookingNotificationData): WhatsAppMessage {
    const template: WhatsAppTemplate = {
      name: 'booking_confirmation',
      language: 'en',
      components: [
        {
          type: 'header',
          text: `Booking Confirmed! 🎉`
        },
        {
          type: 'body',
          text: `Hi ${data.guestName},\n\nYour booking has been confirmed!\n\n🏠 Property: ${data.propertyName}\n📅 Check-in: ${data.checkIn}\n📅 Check-out: ${data.checkOut}\n💰 Total: ₹${data.totalAmount.toLocaleString()}\n🔢 Confirmation Code: ${data.confirmationCode}\n\nWe'll send you check-in instructions 24 hours before your arrival.`
        },
        {
          type: 'button',
          buttons: [
            {
              type: 'url',
              text: 'View Booking Details',
              value: `${window.location.origin}/booking/${data.bookingId}`
            }
          ]
        }
      ]
    };

    return {
      to: data.phone || '',
      type: 'template',
      content: template
    };
  }

  private createBookingReminderMessage(phone: string, checkInDate: string): WhatsAppMessage {
    const message: WhatsAppMessage = {
      to: phone,
      type: 'text',
      content: `🔔 Check-in Reminder\n\nYour stay at Infiniti Casa starts tomorrow (${checkInDate})!\n\nWe'll send you detailed check-in instructions shortly.\n\nIf you have any questions, feel free to reply to this message.`
    };

    return message;
  }

  private createCheckInInstructionsMessage(phone: string, propertyAddress: string): WhatsAppMessage {
    const interactive: WhatsAppInteractive = {
      type: 'button',
      header: {
        type: 'text',
        text: '🏠 Check-in Instructions'
      },
      body: {
        text: `Welcome to Infiniti Casa!\n\n📍 Address: ${propertyAddress}\n\nPlease follow these steps:\n1. Arrive at the property\n2. Use the key code provided\n3. Enjoy your stay!\n\nNeed help? Contact us anytime.`
      },
      footer: {
        text: 'Infiniti Casa - Luxury Boutique Rentals'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            text: 'Need Help',
            value: 'help'
          },
          {
            type: 'reply',
            text: 'All Good',
            value: 'ok'
          }
        ]
      }
    };

    return {
      to: phone,
      type: 'interactive',
      content: interactive
    };
  }

  private createWelcomeMessage(phone: string, userName: string): WhatsAppMessage {
    const message: WhatsAppMessage = {
      to: phone,
      type: 'text',
      content: `🎉 Welcome to Infiniti Casa, ${userName}!\n\nThank you for joining our community of luxury boutique rentals in Mumbai.\n\nWe're here to make your stay extraordinary. Feel free to reach out anytime for assistance.\n\nHappy travels! ✈️`
    };

    return message;
  }

  private createSupportMessage(phone: string, issue: string): WhatsAppMessage {
    const message: WhatsAppMessage = {
      to: phone,
      type: 'text',
      content: `🆘 Support Request Received\n\nWe've received your support request regarding: "${issue}"\n\nOur team will get back to you within 2 hours.\n\nFor urgent matters, please call us at +91-XXXXXXXXXX.\n\nThank you for your patience.`
    };

    return message;
  }

  private createFeedbackRequestMessage(phone: string, propertyName: string): WhatsAppMessage {
    const interactive: WhatsAppInteractive = {
      type: 'button',
      header: {
        type: 'text',
        text: '⭐ Share Your Experience'
      },
      body: {
        text: `Hi! We hope you enjoyed your stay at ${propertyName}.\n\nWe'd love to hear about your experience. Your feedback helps us improve and helps other travelers.\n\nWould you like to share your thoughts?`
      },
      action: {
        buttons: [
          {
            type: 'reply',
            text: 'Leave Review',
            value: 'review'
          },
          {
            type: 'reply',
            text: 'Not Now',
            value: 'later'
          }
        ]
      }
    };

    return {
      to: phone,
      type: 'interactive',
      content: interactive
    };
  }

  private createPromotionalMessage(phone: string, promotion: any): WhatsAppMessage {
    const media: WhatsAppMedia = {
      type: 'image',
      url: promotion.imageUrl,
      caption: `🎉 Special Offer!\n\n${promotion.title}\n\n${promotion.description}\n\n💰 ${promotion.discount}\n⏰ Valid until ${promotion.expiryDate}\n\nBook now to secure this exclusive deal!`
    };

    return {
      to: phone,
      type: 'media',
      content: media
    };
  }

  private createPropertyRecommendationMessage(phone: string, properties: any[]): WhatsAppMessage {
    const propertyList = properties.map(prop => 
      `🏠 ${prop.name}\n📍 ${prop.location}\n💰 ₹${prop.price.toLocaleString()}/night\n⭐ ${prop.rating}`
    ).join('\n\n');

    const message: WhatsAppMessage = {
      to: phone,
      type: 'text',
      content: `🏠 Property Recommendations\n\nBased on your preferences, here are some properties you might love:\n\n${propertyList}\n\nReady to book? Visit our website or reply with the property name!`
    };

    return message;
  }

  // Core WhatsApp API Methods
  private async sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
    try {
      if (!this.PHONE_NUMBER_ID || !this.ACCESS_TOKEN) {
        throw new Error('WhatsApp API credentials not configured');
      }

      const url = `${this.API_BASE_URL}/${this.PHONE_NUMBER_ID}/messages`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: message.to,
          type: message.type,
          [message.type]: message.content
        })
      });

      const data = await response.json();

      if (response.ok && data.messages) {
        return {
          success: true,
          messageId: data.messages[0].id,
          status: 'sent'
        };
      } else {
        return {
          success: false,
          error: data.error?.message || 'Failed to send message'
        };
      }
    } catch (error) {
      console.error('WhatsApp API error:', error);
      return {
        success: false,
        error: 'Network error'
      };
    }
  }

  // Utility Methods
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async storeOTP(phone: string, otp: string, purpose: string, expiresAt: Date): Promise<void> {
    try {
      const { error } = await supabase
        .from('otp_verifications')
        .insert([{
          phone,
          otp,
          purpose,
          expires_at: expiresAt.toISOString(),
          is_used: false
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error storing OTP:', error);
      throw error;
    }
  }

  // Webhook Handling
  async handleWebhook(body: any): Promise<void> {
    try {
      if (body.object === 'whatsapp_business_account') {
        for (const entry of body.entry) {
          for (const change of entry.changes) {
            if (change.value.messages) {
              for (const message of change.value.messages) {
                await this.processIncomingMessage(message);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
    }
  }

  private async processIncomingMessage(message: any): Promise<void> {
    try {
      const { from, text, type } = message;
      
      if (type === 'text') {
        const userMessage = text.body.toLowerCase();
        
        // Handle different types of messages
        if (userMessage.includes('help') || userMessage.includes('support')) {
          await this.sendSupportMessage(from, 'General inquiry');
        } else if (userMessage.includes('booking') || userMessage.includes('reservation')) {
          await this.sendBookingInfo(from);
        } else if (userMessage.includes('property') || userMessage.includes('accommodation')) {
          await this.sendPropertyInfo(from);
        } else {
          await this.sendDefaultResponse(from);
        }
      }
    } catch (error) {
      console.error('Error processing incoming message:', error);
    }
  }

  private async sendBookingInfo(phone: string): Promise<void> {
    const message: WhatsAppMessage = {
      to: phone,
      type: 'text',
      content: `📋 Booking Information\n\nTo make a booking:\n1. Visit our website\n2. Choose your dates and property\n3. Complete the booking process\n4. Receive confirmation via WhatsApp\n\nNeed help? Our team is here to assist!`
    };
    await this.sendMessage(message);
  }

  private async sendPropertyInfo(phone: string): Promise<void> {
    const message: WhatsAppMessage = {
      to: phone,
      type: 'text',
      content: `🏠 Our Properties\n\nWe offer luxury boutique rentals in Mumbai:\n\n• Art & Culture Lofts\n• Heritage Villas\n• Urban Zen Apartments\n• Studio Spaces\n• Penthouses\n\nEach property is carefully curated for an exceptional stay experience.`
    };
    await this.sendMessage(message);
  }

  private async sendDefaultResponse(phone: string): Promise<void> {
    const message: WhatsAppMessage = {
      to: phone,
      type: 'text',
      content: `👋 Thank you for your message!\n\nWe're here to help with:\n• Booking inquiries\n• Property information\n• Support requests\n• General questions\n\nPlease let us know how we can assist you!`
    };
    await this.sendMessage(message);
  }

  // Message Status Tracking
  async getMessageStatus(messageId: string): Promise<WhatsAppResponse> {
    try {
      const url = `${this.API_BASE_URL}/${messageId}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId,
          status: data.status
        };
      } else {
        return {
          success: false,
          error: data.error?.message || 'Failed to get message status'
        };
      }
    } catch (error) {
      console.error('Error getting message status:', error);
      return {
        success: false,
        error: 'Network error'
      };
    }
  }
}

export default WhatsAppService.getInstance(); 