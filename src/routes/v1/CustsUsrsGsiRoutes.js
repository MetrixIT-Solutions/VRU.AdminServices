/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsUsrsGsiCtrl = require('../../controllers/CustsUsrsGsiCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/admin/custs/gsi/list', CustsUsrsGsiCtrl.getCustsGsiList);
  app.post('/swit/admin/custs/gsi/create', CustsUsrsGsiCtrl.postCustsGsiCreate);
  app.post('/swit/admin/custs/gsi/oexp/count', CustsUsrsGsiCtrl.getCustsGsiOExpCount);
  app.post('/swit/admin/custs/gsi/update', CustsUsrsGsiCtrl.custsGsiUpdate);
  app.get('/swit/admin/custs/gsi/view/:id', CustsUsrsGsiCtrl.getCustsGsiView);
  app.post('/swit/admin/custs/gsi/avg/count/by/month', CustsUsrsGsiCtrl.getCustsGsiAvgCountByMnth);

};
