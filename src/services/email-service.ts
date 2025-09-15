
'use server';

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '465', 10),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

interface MailOptions {
  from?: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

async function sendMail(options: MailOptions) {
  try {
    await transporter.sendMail({
      from: `"TotthoAi Error Reporter" <${process.env.MAIL_USER}>`,
      ...options,
    });
    console.log('Error notification email sent successfully.');
  } catch (error) {
    console.error('Failed to send error notification email:', error);
    // We don't re-throw here because we don't want to cause another error loop
  }
}

export async function sendErrorNotification({
  error,
  pathname,
  componentStack,
}: {
  error: Error & { digest?: string };
  pathname?: string;
  componentStack?: string;
}) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Skipping error email in development mode.');
    return;
  }
  
  const adminEmail = process.env.MAIL_ADMIN_RECEIVER;
  if (!adminEmail) {
    console.error('MAIL_ADMIN_RECEIVER is not set. Cannot send error email.');
    return;
  }

  const subject = `Error on TotthoAi: ${error.message}`;
  const htmlBody = `
    <h1>An Error Occurred on TotthoAi</h1>
    <p><strong>Message:</strong> ${error.message}</p>
    ${pathname ? `<p><strong>Path:</strong> ${pathname}</p>` : ''}
    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    <h2>Error Details:</h2>
    <pre>
        <strong>Digest:</strong> ${error.digest || 'N/A'}
        <br>
        <strong>Stack Trace:</strong>
        ${error.stack}
    </pre>
    ${componentStack ? `<h2>Component Stack:</h2><pre>${componentStack}</pre>` : ''}
  `;

  await sendMail({
    to: adminEmail,
    subject,
    text: `An error occurred: ${error.message}`,
    html: htmlBody,
  });
}
