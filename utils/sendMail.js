const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  // Configure nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  // Email message options
  const mailOptions = {
    from: { name: "El Kindy", address: process.env.NODEMAILER_EMAIL },
    to,
    subject,
    html, // html body
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

module.exports = { sendEmail };
