import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const port = Number(process.env.SMTP_PORT) || 2525;

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Define the email options
  const message = {
    from: `${process.env.FROM_NAME || "LMS Platform"} <${process.env.FROM_EMAIL || "noreply@lms.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send the email
  const info = await transporter.sendMail(message);
  console.log("Message sent: %s", info.messageId);
};
