/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */


const AdminOrgsCtrl = require('../../controllers/AdminOrgsCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/admin/org/create/:ocode', AdminOrgsCtrl.postAdminOrgCreate);
  app.post('/swit/admin/orgs/list', AdminOrgsCtrl.getAdminOrgsList);
  app.post('/swit/admin/org/view', AdminOrgsCtrl.postAdminOrgView);
  app.post('/swit/admin/org/status/update', AdminOrgsCtrl.postAdminOrgStatusUpdate);
  app.post('/swit/admin/org/update/:ocode', AdminOrgsCtrl.postAdminOrgUpdate);
  app.post('/swit/admin/orgs/total/list', AdminOrgsCtrl.getAdminOrgsTotalList);
  app.put('/swit/admin/org/subplan/update', AdminOrgsCtrl.putAdOrgSubscription);

};