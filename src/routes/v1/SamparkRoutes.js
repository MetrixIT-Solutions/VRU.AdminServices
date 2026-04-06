
  /**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SamparkCtrl = require('../../controllers/SamparkCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/admin/user/agent/call',  SamparkCtrl.postAdminUserAgentCall);
  app.post('/swit/admin/user/agent/call/close',  SamparkCtrl.postAdminUserAgentCallClose);
  app.post('/swit/admin/user/agent/call/hangup',  SamparkCtrl.postAdminUserAgentCallHangup);
  app.post('/swit/admin/user/agent/break/start',  SamparkCtrl.postAdminUserAgentBreakStart);
  app.post('/swit/admin/user/agent/break/end',  SamparkCtrl.postAdminUserAgentBreakEnd);
  app.post('/swit/admin/user/agent/call/hold/start',  SamparkCtrl.postAdminUserAgentCallHoldStart);
  app.post('/swit/admin/user/agent/call/hold/stop',  SamparkCtrl.postAdminUserAgentCallHoldStop);
  app.post('/swit/admin/user/agent/call/redial',  SamparkCtrl.postAdminUserAgentCallRedial);
  app.post('/swit/admin/user/agent/info', SamparkCtrl.postAdminUserAgentInfo);
  app.post('/swit/admin/custs/missedcalls/list', SamparkCtrl.postCustsMissedCallsApi);
  
};
