/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const net = require('net');

const AdmnUserLoginSrvc = require('../services/AdmnUserLoginSrvc');
const AdmnUserLoginCtrlVldns = require('../ctrlvldtns/AdmnUserLoginCtrlVldns');
const SetRes = require('../SetRes');
const util = require('../lib/util');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');
const token = require('../tokens');

const apiServerStatus = (req, res, next) => {
  const resObj = SetRes.apiServerStatus();
  util.sendApiResponse(res, resObj);
}

const postAdminUserLogin = (req, res, next, passport) => {
  const vldRes = AdmnUserLoginCtrlVldns.postUsrLgnVldn(req);
  if (vldRes.flag) {
    AdmnUserLoginSrvc.postAdminUserLogin(req, res, next, passport, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const postAdminUserProfileView = (req, res, next) => {
  if (req.headers.vruadatoken) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        AdmnUserLoginSrvc.postAdminUserProfileView(tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    const tr = SetRes.tokenRequired();
    util.sendApiResponse(res, tr);
  }
}

const postAdminUserProfileUpdate = (req, res, next) => {
  const vldRes = AdmnUserLoginCtrlVldns.profileUpdateVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        AdmnUserLoginSrvc.postAdminUserProfileUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminForgotPswd = (req, res) => {
  const vldRes = AdmnUserLoginCtrlVldns.adminFPVald(req);
  if(vldRes.isTrue) {
    AdmnUserLoginSrvc.AdminForgotPswd(req.body, res, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminForgotPswdOtpVer = (req, res) => {
  const vldRes = AdmnUserLoginCtrlVldns.adminFPOtpVald(req);
  if(vldRes.isTrue) {
    const tknRes = token.custUserTokenDecode(req.headers.vruadotoken);
    const tokenvald = AdmnUserLoginCtrlVldns.tokenValdtn(tknRes);
    if (tokenvald.isTrue) {
      AdmnUserLoginSrvc.AdminForgotPswdOtpVer(req.body, tknRes.tokenData, res, (resObj) => {
        util.sendApiResponse(res, resObj);
      });
    } else util.sendApiResponse(res, tokenvald.result);
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminResetPswd = (req, res) => {
  const vldRes = AdmnUserLoginCtrlVldns.AdminRestPwdVald(req);
  if(vldRes.isTrue) {
    const tData = token.custUserTokenDecode(req.headers.vruadotoken);
    const tokenValid = AdmnUserLoginCtrlVldns.tokenValdtn(tData);
    if (tokenValid.isTrue) {
      AdmnUserLoginSrvc.AdminResetPswd(req.body, tData.tokenData, (resObj) => {
        util.sendApiResponse(res, resObj);
      });
    } else util.sendApiResponse(res, tokenValid.result);
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminUserLogout = (req, res, next) => {
  const vldRes = AdmnUserLoginCtrlVldns.postAdminUserAgentIdVldn(req);
  if (vldRes.isTrue) {
    const tData = token.custUserTokenDecode(req.headers.vruadatoken);
    const tokenValid = CommonCtrlVldns.tokenVldn(tData);
    if (tokenValid.flag) {
      const ip = req.ip;
      const ips = req.ips;
      const ipv = net.isIP(ip);
      AdmnUserLoginSrvc.AdminUserLogOut(req.body, tData.tokenData, { ip, ips, ipv }, (resObj) => {
        util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
      });
    } else util.sendApiResponse(res, tokenValid.result);
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminUserResetPswrd = (req, res, next) => {  
  const vldRes = AdmnUserLoginCtrlVldns.postUsrChnagePswdVldn(req);
  if (vldRes.isTrue) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        AdmnUserLoginSrvc.adUserPrflChangePswd(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
};

const postOrgAdminSetPswrd = (req, res, next) => {
  const vldRes = AdmnUserLoginCtrlVldns.postOrgAdminSetPswrdVldn(req);
  if (vldRes.isTrue) {
    AdmnUserLoginSrvc.postOrgAdminSetPswrd(req.body, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

module.exports = {
  apiServerStatus, postAdminUserLogin, postAdminUserProfileView, postAdminUserProfileUpdate,
  postAdminForgotPswd, postAdminForgotPswdOtpVer, postAdminResetPswd, postAdminUserLogout, postAdminUserResetPswrd, postOrgAdminSetPswrd
};
