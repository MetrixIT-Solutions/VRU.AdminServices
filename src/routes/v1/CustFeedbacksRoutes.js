/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustFeedbacksCtrl = require('../../controllers/CustFeedbacksCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/admin/cust/feedbacks/list', CustFeedbacksCtrl.postAdminUserFeedbackList);
  app.post('/swit/admin/cust/feedback/create', CustFeedbacksCtrl.postAdminUserFeedbackCreate);
  // app.post('/swit/admin/cust/feedback/view', CustFeedbacksCtrl.postAdminUserFeedbackView);

};
