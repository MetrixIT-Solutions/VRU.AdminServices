/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustFranchiseCntrl = require('../../controllers/CustFranchiseCntrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/admin/cust/franchise/list', CustFranchiseCntrl.postAdminUserFrnchList);
  app.post('/swit/admin/cust/franchise/status/update', CustFranchiseCntrl.postAdminUserfrnchStsUpdate);
  app.post('/swit/admin/cust/franchise/count/by/status', CustFranchiseCntrl.postAdminUserfrnchCountByStatus);
  app.post('/swit/admin/cust/franchise/create', CustFranchiseCntrl.postAdminUserFrnchCreate);
};
