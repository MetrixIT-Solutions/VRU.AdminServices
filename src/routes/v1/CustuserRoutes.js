/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustUserCtrl = require('../../controllers/CustUsersCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/customers/list', CustUserCtrl.postCustusersList);
  app.post('/swit/customer/view', CustUserCtrl.postCustuserView);

};
