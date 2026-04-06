
/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const DashbrdAnltcsCtrl = require('../../controllers/DashbrdAnltcsCtrl');

module.exports.controller = (app) => {

  app.post('/swit/admin/dashboard/analytics/list', DashbrdAnltcsCtrl.postDashbrdAnltcsList);
  app.get('/swit/admin/dashboard/analytics/:recordId', DashbrdAnltcsCtrl.getDashbrdAnltcsView);

};
