'use client';

import { toast } from 'react-hot-toast';

/**
 * EMAIL SERVICE — Sends transactional emails via SMTP (Gmail / any provider)
 * Configured through environment variables. No Resend, no paid service.
 * 
 * Calls the internal /api/send-email route which uses nodemailer SMTP.
 */

export interface EmailData {
  to: string;
  subject: string;
  template:
    | 'welcome'
    | 'order_confirmation'
    | 'order_status_update'
    | 'security_code'
    | 'order_confirmed'
    | 'order_packed'
    | 'order_shipped'
    | 'order_delivered'
    | 'order_cancelled'
    | 'order_rejected';
  data: any;
}

export const sendLiveEmail = async ({ to, subject, template, data }: EmailData) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, template, data }),
    });

    const result = await response.json();

    if (result.skipped) {
      // SMTP not configured — silent skip, order still works
      console.warn('[Email] SMTP not configured, email skipped.');
      return { success: false, skipped: true };
    }

    if (!result.success) {
      console.error('[Email] Send failed:', result.error);
      return { success: false, error: result.error };
    }

    console.log(`[Email] ✅ Sent ${template} to ${to}`);
    return { success: true };

  } catch (error) {
    console.error('[Email] Network error:', error);
    return { success: false, error };
  }
};

// ─── Helper Functions ─────────────────────────────────────────

export const sendOrderConfirmation = (email: string, orderId: string, total: number) =>
  sendLiveEmail({
    to: email,
    subject: `Order Confirmed ✅ #${orderId.slice(0, 8)} — Farmers Factory`,
    template: 'order_confirmation',
    data: { orderId, total, date: new Date().toLocaleDateString('en-IN') },
  });

export const sendWelcomeEmail = (email: string, name: string) =>
  sendLiveEmail({
    to: email,
    subject: `Welcome to Farmers Factory, ${name}! 🌿`,
    template: 'welcome',
    data: { name },
  });

export const sendOTPEmail = (email: string, code: string) =>
  sendLiveEmail({
    to: email,
    subject: `Your Verification Code: ${code} — Farmers Factory`,
    template: 'security_code',
    data: { code },
  });

export const sendOrderStatusEmail = (email: string, orderId: string, status: string) =>
  sendLiveEmail({
    to: email,
    subject: `Order Update: ${status.toUpperCase()} — Farmers Factory`,
    template: `order_${status}` as any,
    data: { orderId, status },
  });
