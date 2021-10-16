const nodemailer = require("nodemailer");


const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
  name: "mail.example.com", // mail.example.com or smtp.mail.com
  host: "mail.example.com", // mail.example.com or smtp.mail.com
  port: 465,
  secure: true,
  logger: true,
  //debug: true,
});

const sendConfirmationEmail = (name, email, emailToken) => {
  return transport
    .sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please copy paste this code to confirm account</p>
          <h1>${emailToken}</h1>
          </div>`,
    })
    .catch((err) => console.error("error", err));
};

module.exports = sendConfirmationEmail;