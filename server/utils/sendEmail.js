const nodemailer = require("nodemailer");

// ==============================
// Email Transporter
// ==============================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==============================
// Send Email
// ==============================

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Trello Lite" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("sendEmail failed:", error.message);
    // Re-throw so the caller (e.g. forgotPassword) actually knows
    // the send failed, instead of silently treating it as success.
    throw error;
  }
};

module.exports = sendEmail;