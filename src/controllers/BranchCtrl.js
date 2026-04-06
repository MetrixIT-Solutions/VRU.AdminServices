/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const BranchSrvc = require('../services/BranchSrvc');
const BranchCtrlVldns = require('../ctrlvldtns/BranchCtrlVldns');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');
const token = require('../tokens');
const util = require('../lib/util');
const SetRes = require('../SetRes');

const postBbqhBranchList = (req, res) => {
  const vldRes = BranchCtrlVldns.postBBQHBrnchListVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        BranchSrvc.postBbqhBranchList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const postBbqhBranchCreate = (req, res) => {
  const vldRes = BranchCtrlVldns.postBBQHBrnchCrtVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        BranchSrvc.postBbqhBranchCreate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const postBbqhBranchUpdate = (req, res) => {
  const vldRes = BranchCtrlVldns.postBBQHBrnchEditVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        BranchSrvc.postBbqhBranchUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const postBbqhAllBranchList = (req, res) => {
  token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
    const tokenValid = CommonCtrlVldns.tokenVldn(tData);
    if (tokenValid.flag) {
      BranchSrvc.postBbqhAllBranchList(req.body, tData.tokenData, (resObj) => {
        util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
      });
    } else util.sendApiResponse(res, tokenValid.result);
  });
}

const getAdminBranchTotalList = (req, res) => {
  if (req.headers.vruadatoken) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        BranchSrvc.getAdminBranchTotalList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    const te = SetRes.tokenRequired();
    util.sendApiResponse(res, te);
  }
}

const postBbqhBranchStatusUpdate =  (req, res) => {
  const vldRes = BranchCtrlVldns.postBBQHBrnchStatusUpdateVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        BranchSrvc.postBbqhBranchStatusUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
 } else util.sendApiResponse(res, vldRes.result);
}

module.exports = {
  postBbqhBranchList, postBbqhBranchCreate, postBbqhBranchUpdate, postBbqhAllBranchList,
  getAdminBranchTotalList, postBbqhBranchStatusUpdate
}