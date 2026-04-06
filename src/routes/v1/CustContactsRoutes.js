/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustContactsCtrl = require('../../controllers/CustContactsCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/admin/cust/contacts/list', CustContactsCtrl.postCustContactsList);
  app.post('/swit/admin/cust/contacts/status/update', CustContactsCtrl.postCustContactsStatusUpdate);
  app.post('/swit/admin/cust/contact/create', CustContactsCtrl.postCustContactCreate);
  app.get('/swit/admin/cust/contact/lfcs/list/:id', CustContactsCtrl.getCustContactLfcsList);

};
