/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SettingsCtrl = require('../../controllers/SettingsCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/restaurant/info', SettingsCtrl.postBbqhRestuarantView);
  app.post('/swit/restaurant/info/update', SettingsCtrl.postBbqhRestuarantUpdate); 
  app.post('/swit/restaurant/pricing/create', SettingsCtrl.postBbqhRestuarantPricingCreate);
  app.post('/swit/restaurant/spcl/day/pricings/list', SettingsCtrl.postBbqhRstrntSpclDaysPricingsList);
  app.post('/swit/restaurant/spcl/day/pricing/view', SettingsCtrl.postBbqhRstrntSpclDayPricingView);
  app.post('/swit/restaurant/spcl/day/pricing/delete', SettingsCtrl.postBbqhRstrntSpclDayPricingDelete);
  app.post('/swit/v2/restaurant/pricing/create', SettingsCtrl.postBbqhRestuarantPricingDataCreate);
  app.post('/swit/v2/restaurant/pricing/update', SettingsCtrl.postBbqhRestuarantPricingDataUpdate);
  app.post('/swit/v2/restaurant/pricing/view', SettingsCtrl.postBbqhRestuarantPricingDataView);
  app.post('/swit/v2/restaurant/branch/pricing/list', SettingsCtrl.postBbqhRestuarantPricingBranchList);
};
