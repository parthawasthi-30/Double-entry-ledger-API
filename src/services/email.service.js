require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-Leadger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Backend Leadger!";
  const text =
    "Hello ${name},\n\nThank you for registering with Backend Leadger. We are excited to have you on board!\n\nBest regards,\nThe Backend Leadger Team";
  const html = `<p>Hello ${name},</p><p>Thank you for registering with Backend Leadger. We are excited to have you on board!</p><p>Best regards,<br>The Backend Leadger Team</p>`;
  await sendEmail(userEmail, subject, text, html);
}
async function sendTransactionEmail(userEmail, name, transactionDetails) {
  const subject = "Transaction Notification from Backend Leadger";
  const text = `Hello ${name},\n\nA new transaction has been recorded in your account:\n\n${transactionDetails}\n\nBest regards,\nThe Backend Leadger Team`;
  const html = `<p>Hello ${name},</p><p>A new transaction has been recorded in your account:</p><p>${transactionDetails}</p><p>Best regards,<br>The Backend Leadger Team</p>`;
  await sendEmail(userEmail, subject, text, html);
}
async function sendTransactionFailureEmail(
  userEmail,
  name,
  transactionDetails,
) {
  const subject = "Transaction Failure Notification from Backend Leadger";
  const text =  `Hello ${name},\n\nWe regret to inform you that a transaction has failed in your account:\n\n${transactionDetails}\n\nPlease review the details and take necessary action.\n\nBest regards,\nThe Backend Leadger Team`;
  const html = `<p>Hello ${name},</p><p>We regret to inform you that a transaction has failed in your account:</p><p>${transactionDetails}</p><p>Please review the details and take necessary action.</p><p>Best regards,<br>The Backend Leadger Team</p>`;
  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendEmail,
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
};
