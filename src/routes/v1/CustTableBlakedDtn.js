/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustTableBlakedDtnCtrl = require('../../controllers/CustTableBlakedDtnCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/admin/table/blocked/create', CustTableBlakedDtnCtrl.tableBolckedCreate);
  app.post('/swit/admin/table/blocked/list', CustTableBlakedDtnCtrl.tableBolckedList);
  app.put('/swit/admin/table/blocked/active/status/update', CustTableBlakedDtnCtrl.tableBolckedStatusUpdate);
};