/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustContactsSrvc = require('../services/CustContactsSrvc');
const CustContactsCtrlVldn = require('../ctrlvldtns/CustContactsCtrlVldn');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');
const token = require('../tokens');
const util = require('../lib/util');

const postCustContactsList = (req, res) => {
  const vldRes = CustContactsCtrlVldn.postCustContsListVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustContactsSrvc.postCustContactsList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const postCustContactsStatusUpdate = (req, res) => {
  const vldRes = CustContactsCtrlVldn.postCustContsStsUpdVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustContactsSrvc.postCustContactsStatusUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const postCustContactCreate = (req, res) => {
  const vldRes = CustContactsCtrlVldn.createVldn(req);
  if (vldRes.flag) {
    CustContactsSrvc.postCustContactCreate(req.body, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const getCustContactLfcsList = (req, res) => {
  const vldRes = CustContactsCtrlVldn.custCntctLfcsVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustContactsSrvc.getCustContactLfcsList(req.params.id, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

module.exports = {
  postCustContactsList, postCustContactsStatusUpdate, postCustContactCreate, getCustContactLfcsList
};
