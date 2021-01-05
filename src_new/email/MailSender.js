'use strict';
require('dotenv').config();
const nodeMailer = require('nodemailer');

const sendMail = async (mail, subject, text) => {
  const transport = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });
  const mailOption = {
    from: process.env.EMAIL,
    to: mail,
    subject,
    text
  };
  await transport.sendMail(mailOption, async err => {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = {
  sendMail
};
