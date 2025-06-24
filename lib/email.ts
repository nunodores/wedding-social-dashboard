import nodemailer from 'nodemailer';

// Create transporter (use mock for development)
const transporter =  nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  // : {
  //     sendMail: async (options: any) => {
  //       console.log('📧 Mock Email:', {
  //         from: options.from,
  //         to: options.to,
  //         subject: options.subject,
  //         html: options.html.substring(0, 200) + '...'
  //       });
  //       return { success: true };
  //     }
 ;

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailTemplate) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Wedding Events Platform <noreply@weddingplatform.com>',
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}

export function generateCoupleCredentialsEmail(
  coupleEmail: string,
  eventCode: string,
  password: string,
  eventName: string
): EmailTemplate {
  return {
    to: coupleEmail,
    subject: `Your Wedding Event Credentials - ${eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d946ef;">Welcome to Your Wedding Event Platform!</h2>
        <p>Your wedding event has been created successfully. Here are your login credentials:</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Event Details:</h3>
          <p><strong>Event Name:</strong> ${eventName}</p>
          <p><strong>Event Code:</strong> ${eventCode}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        
        <p>You can now login to configure your event, manage guests, and customize your wedding platform.</p>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" 
           style="background: #d946ef; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
          Login to Your Dashboard
        </a>
        
        <p style="margin-top: 30px; color: #666;">
          Best wishes for your special day!<br>
          The Wedding Events Team
        </p>
      </div>
    `,
  };
}

export function generateGuestCredentialsEmail(
  guestEmail: string,
  guestName: string,
  password: string,
  eventName: string,
  eventCode: string
): EmailTemplate {
  return {
    to: guestEmail,
    subject: `Wedding Celebration - ${eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d946ef;">You're Invited to Share in the Celebration!</h2>
        <p>Hello ${guestName},</p>
        <p>You've been invited to share photos and memories for ${eventName}!</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Your Access Credentials:</h3>
          <p><strong>Event Code:</strong> ${eventCode}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        
        <p>Use these credentials to access the wedding platform and share your favorite moments from the celebration!</p>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/guest-login" 
           style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
          Join the Celebration
        </a>
        
        <p style="margin-top: 30px; color: #666;">
          Looking forward to seeing your photos!
        </p>
      </div>
    `,
  };
}