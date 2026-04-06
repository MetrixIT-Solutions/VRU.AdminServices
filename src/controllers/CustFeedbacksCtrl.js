/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustFeedbacksSrvc = require('../services/CustFeedbacksSrvc');
const CustFeedbacksCtrlVldns = require('../ctrlvldtns/CustFeedbacksCtrlVldns');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');
const token = require('../tokens');
const util = require('../lib/util');

const postAdminUserFeedbackList = (req, res) => {
  const vldRes = CustFeedbacksCtrlVldns.postUsrFdBkListVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustFeedbacksSrvc.postAdminUserFeedbackList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminUserFeedbackCreate  = (req, res) => {
  const vldRes = CustFeedbacksCtrlVldns.postUsrFdBkCreateVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustFeedbacksSrvc.postAdminUserFeedbackCreate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

module.exports = {
  postAdminUserFeedbackList, postAdminUserFeedbackCreate
};
