import { supabase } from './supabase';
import { sendLiveEmail } from './email';

export type NotificationType = 'order_status' | 'security' | 'promo' | 'system';

interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  emailTemplate?: 'welcome' | 'order_confirmation' | 'order_status_update' | 'security_code';
  emailData?: any;
}

/**
 * sendCXNotification
 * Sends a notification to the website inbox and optionally via email based on user preferences.
 */
export async function sendCXNotification({
  userId,
  title,
  message,
  type,
  link,
  emailTemplate,
  emailData
}: NotificationPayload) {
  try {
    // 1. Create In-App Notification (Website Inbox)
    const { error: notifyError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        link,
        is_read: false
      });

    if (notifyError) console.error('Failed to create in-app notification:', notifyError);

    // 2. Check User Email Preferences
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, email_notifications_enabled')
      .eq('id', userId)
      .single();

    // 3. Send Email if enabled and template provided
    if (profile?.email_notifications_enabled !== false && emailTemplate && profile?.email) {
      await sendLiveEmail({
        to: profile.email,
        subject: title,
        template: emailTemplate,
        data: emailData || { message }
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error in sendCXNotification:', error);
    return { success: false, error };
  }
}
