/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const ServerCtrl = require('../../controllers/MailServer');

module.exports.controller = (app, passport) => {
  app.post('/swit/mail/server/list', ServerCtrl.postMailServerList);
  app.post('/swit/mail/server/create', ServerCtrl.postMailServerCreate);

};
