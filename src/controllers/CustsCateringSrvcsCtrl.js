
/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const util = require('../lib/util');
const ccscv = require('../ctrlvldtns/CustsCateringSrvcsCtrlVldtns');
const tokens = require('../tokens');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');
const ccss = require('../services/CustsCateringSrvcsSrvc');

//----------------------BEGIN Catering Srvcs Apis----------------------//\

const createCateringSrvc = (req, res, next) => {
  const createVldn = ccscv.createVldn(req);
  if (createVldn.flag) {
    tokens.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        ccss.createCateringSrvc(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, createVldn.result);
}

const getCateringSrvcsList = (req, res, next) => {
  const lv = ccscv.listVldn(req);
  if (lv.flag) {
    tokens.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        ccss.getCateringSrvcsList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, lv.result);
};

const cateringSrvcView = (req, res, next) => {
  const sv = ccscv.viewVldn(req);
  if (sv.flag) {
    tokens.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        ccss.cateringSrvcView(req.params.id, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, sv.result);
}

const cateringSrvcStatusUpdate = (req, res, next) => {
  const sv = ccscv.statusVldn(req);
  if (sv.flag) {
    tokens.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        ccss.cateringSrvcStatusUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, sv.result);
}

const postCustsCateringSrvcUpdate = (req, res, next) => {
  const vldRes = ccscv.postCateringSrvcUpdateVldn(req);
  if (vldRes.flag) {
    tokens.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        ccss.postCustsCateringSrvcUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
        });
      } else {
        util.sendApiResponse(res, tokenValid.result);
      }
    });
  } else util.sendApiResponse(res, vldRes.result);
}
//----------------------END Catering Srvcs Apis----------------------//\

module.exports = {
  createCateringSrvc, getCateringSrvcsList, cateringSrvcView, cateringSrvcStatusUpdate, postCustsCateringSrvcUpdate
};