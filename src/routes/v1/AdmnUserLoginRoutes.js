/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const AdUsrLgnCtrl = require('../../controllers/AdmnUserLoginCtrl');

module.exports.controller = (app, passport) => {

  app.get('/', AdUsrLgnCtrl.apiServerStatus);

  app.post('/swit/admin/user/login', (req, res, next) => AdUsrLgnCtrl.postAdminUserLogin(req, res, next, passport));
  app.get('/swit/admin/user/profile/view',  AdUsrLgnCtrl.postAdminUserProfileView);
  app.post('/swit/admin/user/profile/update',  AdUsrLgnCtrl.postAdminUserProfileUpdate);
  app.post('/swit/admin/user/logout', AdUsrLgnCtrl.postAdminUserLogout);
  app.post('/swit/admin/user/profile/change/pswrd',  AdUsrLgnCtrl.postAdminUserResetPswrd);
  app.post('/swit/admin/user/org/admin/set/pswrd',  AdUsrLgnCtrl.postOrgAdminSetPswrd);

};
