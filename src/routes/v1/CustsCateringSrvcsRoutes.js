/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const ccsc = require('../../controllers/CustsCateringSrvcsCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/admin/custs/catering-service/create', ccsc.createCateringSrvc);
  app.post('/swit/admin/custs/catering-services/list', ccsc.getCateringSrvcsList);
  app.get('/swit/admin/custs/catering-service/view/:id', ccsc.cateringSrvcView);
  app.put('/swit/admin/custs/catering-service/status/update', ccsc.cateringSrvcStatusUpdate);
  app.put('/swit/admin/custs/catering-service/update', ccsc.postCustsCateringSrvcUpdate);

};
