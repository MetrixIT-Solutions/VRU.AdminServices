/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const token = require('../tokens');
const util = require('../lib/util');
const onBrdgsCv = require('../ctrlvldtns/AdminOrgsOnBoardingsCtrlVldns');
const onBrndgSrvc = require('../services/AdminOrgsOnBoardingsSrvc');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');

const adminOrgsOnbrdngsList = (req, res) => {
  const vldRes = onBrdgsCv.listVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        onBrndgSrvc.adminOrgsOnbrdngsList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const adOrgsOnbrdngValidate = (req, res) => {
  const vldRes = onBrdgsCv.validateVldn(req);
  if (vldRes.flag) {
    onBrndgSrvc.adOrgsOnbrdngValidate(req.body, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else util.sendApiResponse(res, vldRes.result);
}
const postAdminOrgsOnBrdngCreate = (req, res) => {
  const vldRes = onBrdgsCv.createVldn(req);
  if (vldRes.flag) {
    onBrndgSrvc.postAdminOrgsOnBrdngCreate(req.body, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const getAdminOrgsOnBrdngView = (req, res) => {
  const vldRes = onBrdgsCv.viewVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        onBrndgSrvc.getAdminOrgsOnBrdngView(req.params.id, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const putAdminOrgsOnBrdngUpdate = (req, res) => {
  const vldRes = onBrdgsCv.updateVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        onBrndgSrvc.putAdminOrgsOnBrdngUpdate(req.body, req.params.id, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const putAdminOrgsOnBrdngStatusUpdate = (req, res) => {
  const vldRes = onBrdgsCv.statusUpdateVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        onBrndgSrvc.putAdminOrgsOnBrdngStatusUpdate(req.body, req.params.id, res, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const putAdminOrgsOnBrdngActivate = (req, res) => {
  const vldRes = onBrdgsCv.activateVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        const devInfo = JSON.parse(req.headers.vruaduiinfo);
        devInfo['ip'] = req.ip || '';
        onBrndgSrvc.putAdminOrgsOnBrdngActivate(req.body, req.params.id, res, devInfo,  tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const getOnbrdngsLfcsList = (req, res) => {
  const vldRes = onBrdgsCv.onBrdngLfcsVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        onBrndgSrvc.getOnbrdngsLfcsList(req.params.id, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

module.exports = {
  adminOrgsOnbrdngsList, adOrgsOnbrdngValidate, postAdminOrgsOnBrdngCreate, getAdminOrgsOnBrdngView, putAdminOrgsOnBrdngUpdate, 
  putAdminOrgsOnBrdngStatusUpdate, putAdminOrgsOnBrdngActivate, getOnbrdngsLfcsList
};
