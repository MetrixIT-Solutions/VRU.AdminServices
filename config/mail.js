/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const config = require('config');
"use strict";
const nodemailer = require('nodemailer');
// const smtpTransport = require('nodemailer-smtp-transport');
const logger = require('../src/lib/logger');

// --- Begin sendEMail: Code to send an email

const sendEMail = (toUserEmail, mailSubject, htmlContent, callback) => {
  const transporter = nodemailer.createTransport({
    host: config.mailServerHost,
    port: config.mailServerPort,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: config.fromMail,
      pass: config.fromMailPswd
    }
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: config.fromAdrs, // sender address
      to: toUserEmail, // list of receivers
      subject: mailSubject, // Subject line
      // text: "Hello world?", // plain text body
      html: htmlContent, // html body
    });

    // console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    callback(null, info);

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  }

  main().catch(error => {
    logger.error('There was an Error in config/mail.js, at sendEMail function:' + error);
    callback(error, '');
  });


  //=================================== GMAIL Process Start ===================== //
  // var transporter = nodemailer.createTransport(smtpTransport({
  //   service: 'gmail',
  //   host: config.mailServerHost,
  //   port: config.mailServerPort,
  //   auth: {
  //     user: config.fromMail,
  //     pass: config.fromMailPswd
  //   }
  // }));
  // var mailOptions = {
  //   from: 'NoReply BBQ Holic <noreply@barbequeholic.com>',
  //   to: toUserEmail,
  //   subject: mailSubject,
  //   html: htmlContent
  // };
  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     logger.error('There was an Error in config/mail.js, at sendEMail function:' + error);
  //     callback(error, info);
  //   } else {
  //     callback(error, info);
  //   }
  // });
  //=================================== GMAIL Process End ===================== //
}
// --- End sendEMail: Code to send an mail

module.exports = {
  sendEMail
};

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';