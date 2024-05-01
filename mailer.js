const nodemailer = require("nodemailer");
const { google } = require('googleapis');

const CLIENT_ID = "586743752128-7g8ikpe3f1n09j1ebit9j66gkv2rmaes.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN = "1//04mgEBTyUy7vDCgYIARAAGAQSNwF-L9IrXiO2aN0ppMSH44VCVbcZr444XNpdlG0FUOCCswk-vEX_YfmDF3PrL6se3E2NshJYX68";
const REDIRECT_URI = "https://developers.google.com/oauthplayground"; 
const MY_EMAIL = "abcdsarrait@gmail.com";


const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendTestEmail = async (to) => {
  const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: MY_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

 
  const from = MY_EMAIL;
  const subject = "🌻 This Is Sent By ElKindy Conservatory 🌻";
  const html = `
    <p>Hey Dear Musician !!!</p>
    <p>🌻 You have been assigned to an event 🌻</p>
    <p>Embrace your Skills</p>
    `;
  return new Promise((resolve, reject) => {
    transport.sendMail({ from, subject, to, html }, (err, info) => {
      if (err) reject(err);
      resolve(info);
    });
  });
};
module.exports = { sendTestEmail };