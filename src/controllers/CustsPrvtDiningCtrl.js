
/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const util = require('../lib/util');
const CustsPrvtDiningCtrlVldtns = require('../ctrlvldtns/CustsPrvtDiningCtrlVldn');
const CustsPrvtDiningSrvc = require('../services/CustsPrvtDiningSrvc');
const token = require('../tokens');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');
const SetRes = require('../SetRes');

//----------------------BEGIN Private Dining Apis----------------------//\

const createPrivateDining = (req, res, next) => {
  const createVldn = CustsPrvtDiningCtrlVldtns.createVldn(req);
  if (createVldn.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsPrvtDiningSrvc.createPrivateDining(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, createVldn.result);
}

const getPrivateDiningList = (req, res, next) => {
  const lv = CustsPrvtDiningCtrlVldtns.listVldn(req);
  if (lv.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsPrvtDiningSrvc.getPrivateDiningList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, lv.result);
}

const privateDiningView = (req, res, next) => {
  const sv = CustsPrvtDiningCtrlVldtns.viewVldn(req);
  if (sv.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsPrvtDiningSrvc.privateDiningView(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, sv.result);
}

const privateDiningStatusUpdate = (req, res, next) => {
  const sv = CustsPrvtDiningCtrlVldtns.statusVldn(req);
  if (sv.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsPrvtDiningSrvc.privateDiningStatusUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, sv.result);
}

const postCustPrivateDiningCountByTime = (req, res) => {
  const vldRes = CustsPrvtDiningCtrlVldtns.postCustDshbrdVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsPrvtDiningSrvc.postCustPrivateDiningCountByTime(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postCustPrivateDiningCountByDate = (req, res) => {
  const vldRes = CustsPrvtDiningCtrlVldtns.postCustDshbrdVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsPrvtDiningSrvc.postCustPrivateDiningCountByDate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postCustsPrivateDiningUpdate = (req, res) => {
  const vldRes = CustsPrvtDiningCtrlVldtns.postPrivateDiningUpdateVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsPrvtDiningSrvc.postCustsPrivateDiningUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const getPrivateDiningLcsList = (req, res, next) => {
  const lv = CustsPrvtDiningCtrlVldtns.getPrivateDiningLfcVldn(req);
  if (lv.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsPrvtDiningSrvc.getPrivateDiningLcsList(req.params.id, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, lv.result);
}

const getPrivateDiningTotalList = (req, res) => {
  if (req.headers.vruadatoken) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsPrvtDiningSrvc.getPrivateDiningTotalList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, SetRes.tokenRequired());
  }
}

//----------------------END Private Dining Apis----------------------//\

module.exports = {
  createPrivateDining, getPrivateDiningList, privateDiningView, privateDiningStatusUpdate, 
  postCustPrivateDiningCountByTime, postCustPrivateDiningCountByDate, postCustsPrivateDiningUpdate,
  getPrivateDiningLcsList, getPrivateDiningTotalList
};