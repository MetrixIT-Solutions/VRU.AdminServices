/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsPrvtDiningCtrl = require('../../controllers/CustsPrvtDiningCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/admin/custs/private/dining/create', CustsPrvtDiningCtrl.createPrivateDining);
  app.post('/swit/admin/custs/private/dining/list', CustsPrvtDiningCtrl.getPrivateDiningList);
  app.post('/swit/admin/custs/private/dining/view', CustsPrvtDiningCtrl.privateDiningView);
  app.post('/swit/admin/custs/private/dining/status/update', CustsPrvtDiningCtrl.privateDiningStatusUpdate);
  app.post('/swit/admin/custs/private/dining/count/by/time', CustsPrvtDiningCtrl.postCustPrivateDiningCountByTime);
  app.post('/swit/admin/custs/private/dining/count/by/date', CustsPrvtDiningCtrl.postCustPrivateDiningCountByDate);
  app.post('/swit/admin/custs/private/dining/update', CustsPrvtDiningCtrl.postCustsPrivateDiningUpdate);
  app.get('/swit/admin/custs/private/dining/lcs/list/:id', CustsPrvtDiningCtrl.getPrivateDiningLcsList);
  app.post('/swit/admin/cust/private/dining/total/list', CustsPrvtDiningCtrl.getPrivateDiningTotalList);
  
};

