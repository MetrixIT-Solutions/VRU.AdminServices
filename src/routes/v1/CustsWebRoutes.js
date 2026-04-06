/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsWebCtrl = require('../../controllers/CustsWebCtrl');

module.exports.controller = (app, passport) => {

  app.post('/vru/custs/branches/list', CustsWebCtrl.getCustsBranchesList);
  app.post('/vru/cust/catering-srvc/create', CustsWebCtrl.createCateringSrvc);
  app.post('/vru/cust/contact/create', CustsWebCtrl.createCustsContact);
  app.post('/vru/cust/offers/list', CustsWebCtrl.getCustsOffersList);
  app.post('/vru/cust/private/dining/create', CustsWebCtrl.createPrivateDining);
  app.post('/vru/cust/table/booking/create', CustsWebCtrl.createTableBkg);
  app.post('/vru/custs/table/blckd/dates/list', CustsWebCtrl.getCustsTableBlckDates);
  app.post('/vru/cust/user/login/send/otp', CustsWebCtrl.postCustUserSignupCreate);
  app.post('/vru/cust/user/login/verify/otp', CustsWebCtrl.postCustUserLoginVerifyOtp);
  app.post('/vru/cust/user/feedback/create', CustsWebCtrl.postCustUserFeedbackCreate);
  app.post('/vru/cust/user/franchise/create', CustsWebCtrl.postCustUserFranchiseCreate);
  app.post('/vru/restaurant/info', CustsWebCtrl.getRestaurantInformation);
  app.post('/vru/cust/spcl/day/pricings/list', CustsWebCtrl.getSpecialDaysPricingsList);

};
