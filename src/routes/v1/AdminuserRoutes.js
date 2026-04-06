/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */


const AdminUsersCtrl = require('../../controllers/AdminUsersCtrl');
const AdUsrLgnCtrl = require('../../controllers/AdmnUserLoginCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/admin/users/list', AdminUsersCtrl.postAdminUsersList);
  app.post('/swit/admin/user/create', AdminUsersCtrl.createAdminUsers);
  app.put('/swit/admin/user/update/:recordId', AdminUsersCtrl.updateAdminUser);
  app.post('/swit/admin/user/view/:recordId', AdminUsersCtrl.getAdminUserView);
  app.put('/swit/admin/user/status/update', AdminUsersCtrl.AdminUserStatusUpdate);
  app.put('/swit/admin/user/password/update', AdminUsersCtrl.AdminUserPwsdChange);
  app.get('/swit/admin/users/count/:orgId', AdminUsersCtrl.getAdminUsersCount);

  app.post('/swit/admin/user/forgot-password', AdUsrLgnCtrl.postAdminForgotPswd);
  app.post('/swit/admin/user/forgot-password/otp-verify', AdUsrLgnCtrl.postAdminForgotPswdOtpVer);
  app.post('/swit/admin/user/reset/password', AdUsrLgnCtrl.postAdminResetPswd);
  app.post('/swit/admin/users/agents/list', AdminUsersCtrl.postAdminUsersAgentList);
  app.post('/swit/admin/users/total/list', AdminUsersCtrl.getAdminUsrsTotalList);

};