/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const DashbrdAnltcsSrvc = require('../services/DashbrdAnltcsSrvc');
const DashbrdAnltcsCtrlVldns = require('../ctrlvldtns/DashbrdAnltcsCtrlVldns');
const token = require('../tokens');
const util = require('../lib/util');

const postDashbrdAnltcsList = (req, res) => {
  const vldRes = DashbrdAnltcsCtrlVldns.postDashbrdAnltcsListVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = DashbrdAnltcsCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        DashbrdAnltcsSrvc.getDashbrdAnltcsList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const getDashbrdAnltcsView = (req, res, next) => {
  const vldRes = DashbrdAnltcsCtrlVldns.getDashbrdAnltcsViewVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = DashbrdAnltcsCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        DashbrdAnltcsSrvc.getDashbrdAnltcsView(req.params.recordId, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
        });
      } else {
        const tokenRes = tokenValid.result;
        util.sendApiResponse(res, tokenRes);
      }
    });
  } else {
    const reqRes = vldRes.result;
    util.sendApiResponse(res, reqRes);
  }
}

module.exports = {
  postDashbrdAnltcsList,
  getDashbrdAnltcsView
};
