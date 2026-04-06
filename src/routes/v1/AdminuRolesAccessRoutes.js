/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const auraCtrl = require('../../controllers/AdminuRolesAccessCtrl');

module.exports.controller = (app) => {

  app.post('/swit/admin/rolesaccess/list', auraCtrl.postAdminUsrRlsAcsList);
  app.post('/swit/admin/rolesaccess/create', auraCtrl.postAdminUsrRlsAcsCreate);
  app.get('/swit/admin/rolesaccess/view/:recordId', auraCtrl.getAdminUsrRlsAcsView);
  app.put('/swit/admin/rolesaccess/update/:recordId', auraCtrl.postAdminUserRlsAcsUpdate);

};
