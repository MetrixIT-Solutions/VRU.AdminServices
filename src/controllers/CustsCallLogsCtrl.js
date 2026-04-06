/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var cron = require('node-cron');

const CustsCallLogsSrvc = require('../services/CustsCallLogsSrvc');
const CustsCallLogsCtrlVldns = require('../ctrlvldtns/CustsCallLogsCtrlVldns');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns')
const token = require('../tokens');
const util = require('../lib/util');
const SetRes = require('../SetRes');

const postCustsCallLogCreate = (req, res) => {
  const vldRes = CustsCallLogsCtrlVldns.postCustsCallLogCreate(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsCallLogsSrvc.postCustsCallLogCreate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminCustCallLogList = (req, res) => {
  const vldRes = CommonCtrlVldns.postAdminCustCallLogListVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsCallLogsSrvc.postAdminCustCallLogList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const getAdminCustCallLogView = (req, res, next) => {
  const getAdminCustCallLog = CommonCtrlVldns.getAdminUserView(req);
  if (getAdminCustCallLog.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenVldn = CommonCtrlVldns.tokenVldn(tData);
      if (tokenVldn.flag) {
        CustsCallLogsSrvc.getAdminCustCallLog(req.params.recordId, req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else {
        const tokenRes = tokenVldn.result;
        util.sendApiResponse(res, tokenRes);
      }
    });
  } else {
    const reqRes = getAdminCustCallLog.result;
    util.sendApiResponse(res, reqRes);
  }
}

// --- Running a job at 01:00 Every Day --- //
cron.schedule('0 1 * * *', () => {
  CustsCallLogsSrvc.setCallLogsClosed();
});

const postAdminCustCallLogCountByStatus = (req, res, next) => {
  if (req.headers.vruadatoken) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsCallLogsSrvc.postAdminCustCallLogCountByStatus(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    const tr = SetRes.tokenRequired()
    util.sendApiResponse(res, tr);
  }
}

module.exports = {
  postCustsCallLogCreate, postAdminCustCallLogList, getAdminCustCallLogView, postAdminCustCallLogCountByStatus
};
