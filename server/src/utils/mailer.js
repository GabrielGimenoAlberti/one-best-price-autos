import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Sends a plain-text alert. Plain text avoids any risk of customer input becoming HTML
export async function notifyNewInquiry(inquiry, vehicle) {
  if (!resend || !process.env.NOTIFY_EMAIL) return; // alerts are optional

  const about = vehicle
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
    : 'General question';

  const { error } = await resend.emails.send({
    from: process.env.MAIL_FROM || 'One Best Price Autos <onboarding@resend.dev>',
    to: process.env.NOTIFY_EMAIL.split(',').map((e) => e.trim()),
    replyTo: inquiry.email, // hitting Reply writes to the customer
    subject: `New inquiry: ${about}`,
    text: [
      `About: ${about}`,
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      inquiry.phone ? `Phone: ${inquiry.phone}` : null,
      '',
      inquiry.message,
      '',
      'Manage inquiries: https://onebestpriceautos.com/admin/inquiries',
    ]
      .filter((line) => line !== null)
      .join('\n'),
  });

  if (error) throw new Error(error.message);
}