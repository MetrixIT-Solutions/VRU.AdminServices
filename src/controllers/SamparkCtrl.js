/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var cron = require('node-cron');
var ip = require('ip');

const SamparkSrvc = require('../services/SamparkSrvc');
const util = require('../lib/util');
const SamparkCtrlVldn = require('../ctrlvldtns/SamparkCtrlVldn');
const token = require('../tokens');

// --- Begin: CronJob for every one hour for missed call create
// cron.schedule('0 * * * *', () => {
//   SamparkSrvc.postCronjobForMissedCallsApi();
// });
// --- End: CronJob for every one hour for missed call create

const postAdminUserAgentCall = (req, res, next) => {
  const ipv4 = ip.address('public', 'ipv4');
  const vldRes = SamparkCtrlVldn.postAdminUserAgentCall(req);
  if (vldRes.isTrue) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = SamparkCtrlVldn.tokenVldn(tData);
      if (tokenValid.flag) {
        SamparkSrvc.postAdminUserAgentCall(req.body, ipv4, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminUserAgentCallClose = (req, res, next) => {
  const ipv4 = ip.address('public', 'ipv4');
  const vldRes = SamparkCtrlVldn.postAdminUserAgentIdVldn(req);
  if (vldRes.isTrue) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = SamparkCtrlVldn.tokenVldn(tData);
      if (tokenValid.flag) {
        SamparkSrvc.postAdminUserAgentCallClose(req.body, ipv4, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminUserAgentCallHangup = (req, res, next) => {
  const ipv4 = ip.address('public', 'ipv4');
  const vldRes = SamparkCtrlVldn.postAdminUserAgentIdVldn(req);
  if (vldRes.isTrue) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = SamparkCtrlVldn.tokenVldn(tData);
      if (tokenValid.flag) {
        SamparkSrvc.postAdminUserAgentCallHangup(req.body, ipv4, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}


const postAdminUserAgentBreakStart = (req, res, next) => {
  const ipv4 = ip.address('public', 'ipv4');
  const vldRes = SamparkCtrlVldn.postAdminUserAgentIdVldn(req);
  if (vldRes.isTrue) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = SamparkCtrlVldn.tokenVldn(tData);
      if (tokenValid.flag) {
        SamparkSrvc.postAdminUserAgentBreakStart(req.body, ipv4, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminUserAgentBreakEnd = (req, res, next) => {
  const ipv4 = ip.address('public', 'ipv4');
  const vldRes = SamparkCtrlVldn.postAdminUserAgentIdVldn(req);
  if (vldRes.isTrue) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = SamparkCtrlVldn.tokenVldn(tData);
      if (tokenValid.flag) {
        SamparkSrvc.postAdminUserAgentBreakEnd(req.body, ipv4, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}
const postAdminUserAgentCallHoldStart = (req, res, next) => {
  const ipv4 = ip.address('public', 'ipv4');
  const vldRes = SamparkCtrlVldn.postAdminUserAgentIdVldn(req);
  if (vldRes.isTrue) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = SamparkCtrlVldn.tokenVldn(tData);
      if (tokenValid.flag) {
        SamparkSrvc.postAdminUserAgentCallHoldStart(req.body, ipv4, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminUserAgentCallHoldStop = (req, res, next) => {
  const ipv4 = ip.address('public', 'ipv4');
  const vldRes = SamparkCtrlVldn.postAdminUserAgentIdVldn(req);
  if (vldRes.isTrue) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = SamparkCtrlVldn.tokenVldn(tData);
      if (tokenValid.flag) {
        SamparkSrvc.postAdminUserAgentCallHoldStop(req.body, ipv4, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminUserAgentCallRedial = (req, res, next) => {
  const ipv4 = ip.address('public', 'ipv4');
  const vldRes = SamparkCtrlVldn.postAdminUserAgentRedialVldn(req);
  if (vldRes.isTrue) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = SamparkCtrlVldn.tokenVldn(tData);
      if (tokenValid.flag) {
        SamparkSrvc.postAdminUserAgentCallRedial(req.body, ipv4, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminUserAgentInfo = (req, res, next) => {
  const ipv4 = ip.address('public', 'ipv4');
  const vldRes = SamparkCtrlVldn.postAdminUserAgentIdVldn(req);
  if (vldRes.isTrue) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = SamparkCtrlVldn.tokenVldn(tData);
      if (tokenValid.flag) {
        SamparkSrvc.postAdminUserAgentInfo(req.body, ipv4, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postCustsMissedCallsApi = (req, res, next) => {
  token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
    const tokenValid = SamparkCtrlVldn.tokenVldn(tData);
    if (tokenValid.flag) {
      SamparkSrvc.postCustsMissedCallsApi(tData.tokenData, (resObj) => {
        util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
      });
    } else util.sendApiResponse(res, tokenValid.result);
  });
}

module.exports = {
  postAdminUserAgentCall, postAdminUserAgentCallClose, postAdminUserAgentCallHangup, 
  postAdminUserAgentBreakStart, postAdminUserAgentBreakEnd, postAdminUserAgentCallHoldStart,
  postAdminUserAgentCallHoldStop, postAdminUserAgentCallRedial, postAdminUserAgentInfo, postCustsMissedCallsApi
};
