/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const BkngDataCtrl = require('../../controllers/BkngDataCtrl');
const CustCtrl = require('../../controllers/CustCtrl');
const prvDngCtrl = require('../../controllers/prvDngCtrl');
const fdbckCtrl = require('../../controllers/FdbckCtrl');
const GsiCtrl = require('../../controllers/GsiCtrl');

module.exports.controller = (app, passport) => {

  app.get('/update/bkg/data/:sd/:ed', BkngDataCtrl.getBkgsData);
  app.get('/update/customer/data/:sd/:ed', CustCtrl.getCustsData);
  app.get('/update/prvtdng/data', prvDngCtrl.getPrvDngsData);
  app.get('/update/feedback/data', fdbckCtrl.getFdbckData);
  app.get('/update/gsi/data', GsiCtrl.getGsiData);

};
