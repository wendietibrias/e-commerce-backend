import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service:"gmail",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.SENDMAIL_SENDER_ADDRESS,
    pass: process.env.SENDMAIL_SENDER_PASSWORD
  }
});

export default transporter;