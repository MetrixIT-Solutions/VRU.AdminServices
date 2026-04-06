/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustOffersCtrl = require('../../controllers/CustOffersCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/admin/cust/offers/list', CustOffersCtrl.postCustOffersList);
  app.post('/swit/admin/cust/offers/create', CustOffersCtrl.postCustOffersCreate);
  app.post('/swit/admin/cust/offers/update', CustOffersCtrl.postCustOffersUpdate);
  app.post('/swit/admin/cust/offers/status/update', CustOffersCtrl.postCustOffersStsUpdate);
  app.post('/swit/admin/cust/offers/delete', CustOffersCtrl.postCustOffersDelete);
};
