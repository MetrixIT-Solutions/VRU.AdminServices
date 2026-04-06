/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../SetRes');
const token = require('../tokens');
const util = require('../lib/util');
const uracVldns = require('../ctrlvldtns/AdminuRolesAccessCtrlVldns');
const usrRarvc = require('../services/AdminuRolesAccessSrvc');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');

const postAdminUsrRlsAcsList = (req, res) => {
  const vldRes = uracVldns.postAdminRolesAcsListVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        usrRarvc.postAdminUsrRlsAcsList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, vldRes.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminUsrRlsAcsCreate = (req, res) => {
  const vldRes = uracVldns.postAdminRolesAcsCrtVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        usrRarvc.postAdminUsrRlsAcsCreate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, vldRes.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const getAdminUsrRlsAcsView = (req, res) => {
  const vldRes = uracVldns.postAdminRolesAcsViewVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        usrRarvc.getAdminUsrRlsAcsView(req.params.recordId, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, vldRes.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminUserRlsAcsUpdate = (req, res) => {
  const vldRes = uracVldns.postAdminRolesAcsEditVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        usrRarvc.putAdminUsrRlsAcsUpdate(req.body, req.params.recordId, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, vldRes.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}


module.exports = {
  postAdminUsrRlsAcsList, postAdminUsrRlsAcsCreate, getAdminUsrRlsAcsView, postAdminUserRlsAcsUpdate
}
