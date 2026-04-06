/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsCallLogsCtrl = require('../../controllers/CustsCallLogsCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/admin/cust/call/log/create', CustsCallLogsCtrl.postCustsCallLogCreate);
  app.post('/swit/admin/cust/calllogs/list', CustsCallLogsCtrl.postAdminCustCallLogList);
  app.post('/swit/admin/cust/calllogs/view/:recordId', CustsCallLogsCtrl.getAdminCustCallLogView);
  app.post('/swit/admin/cust/calllogs/count/by/status', CustsCallLogsCtrl.postAdminCustCallLogCountByStatus);

};
