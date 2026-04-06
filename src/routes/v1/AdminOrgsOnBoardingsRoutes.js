/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const adOrgOnBrdgsCtrl = require('../../controllers/AdminOrgsOnBoardingsCtrl');

module.exports.controller = (app) => {

  app.post('/swit/admin/orgs/onboardings/list', adOrgOnBrdgsCtrl.adminOrgsOnbrdngsList);
  app.post('/swit/admin/orgs/onbrdng/orgexists', adOrgOnBrdgsCtrl.adOrgsOnbrdngValidate);
  app.post('/swit/admin/orgs/onboarding/create', adOrgOnBrdgsCtrl.postAdminOrgsOnBrdngCreate);
  app.get('/swit/admin/orgs/onboarding/:id', adOrgOnBrdgsCtrl.getAdminOrgsOnBrdngView);
  app.put('/swit/admin/orgs/onboarding/update/:id', adOrgOnBrdgsCtrl.putAdminOrgsOnBrdngUpdate);
  app.put('/swit/admin/orgs/onboarding/status/update/:id', adOrgOnBrdgsCtrl.putAdminOrgsOnBrdngStatusUpdate);
  app.put('/swit/admin/orgs/onboarding/activate/:id', adOrgOnBrdgsCtrl.putAdminOrgsOnBrdngActivate);
  app.get('/swit/admin/orgs/onboarding/lfcs/list/:id', adOrgOnBrdgsCtrl.getOnbrdngsLfcsList);

};
