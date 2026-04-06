/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const aurCtrl = require('../../controllers/AdminuRolesCtrl');

module.exports.controller = (app) => {

  app.post('/swit/admin/useroles/list', aurCtrl.adminUsrRlsList);
  app.post('/swit/admin/useroles/active/list', aurCtrl.getAdminUsrRlsActiveList);
  app.post('/swit/admin/useroles/create', aurCtrl.postAdminUsrRlsCreate);
  app.get('/swit/admin/useroles/:id', aurCtrl.getAdminUsrRlsView);
  app.put('/swit/admin/useroles/update/:id', aurCtrl.putAdminUserRoleUpdate);
  app.put('/swit/admin/useroles/status-update/:id', aurCtrl.putAdminUsrRlsStatusUpdate);
  app.put('/swit/admin/useroles/delete/:id', aurCtrl.adminUsrRlsDelete);

};
