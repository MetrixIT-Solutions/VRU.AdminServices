/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SmsSettingsCtrl = require('../../controllers/SmsSettingsCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/restaurant/sms/settings/create', SmsSettingsCtrl.postRstrntSmsSettingsCreate);
  app.post('/swit/restaurant/sms/settings/list', SmsSettingsCtrl.getRstrntSmsSettingsList); 
  app.post('/swit/restaurant/sms/settings/update', SmsSettingsCtrl.postRstrntSmsSettingsUpdate);

};
