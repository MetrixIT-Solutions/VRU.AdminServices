/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const MailSettingsCtrl = require('../../controllers/MailSettingsCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/restaurant/mail/settings/create', MailSettingsCtrl.postRstrntMailSettingsCreate);
  app.post('/swit/restaurant/mail/settings/list', MailSettingsCtrl.getRstrntMailSettingsList); 
  app.post('/swit/restaurant/mail/settings/update', MailSettingsCtrl.postRstrntMailSettingsUpdate);

};
