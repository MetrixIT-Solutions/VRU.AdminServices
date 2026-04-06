/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');
var net = require('net');
// var xml2json = require('xml2js'); 
// var parser = new xml2json.Parser();

const AdmnUserLoginSrvcImpl = require('../services/AdmnUserLoginSrvcImpl');
const CommonSrvc = require('../services/CommonSrvc');
const SetRes = require('../SetRes');
const invalidPswd = 'Invalid Password';
const sendMail = require('../../config/mail');
const AdmnUserLoginDaoImpl = require('../daosimplements/AdmnUserLoginDaoImpl');
const AdminUsersLoginDao = require('../daos/AdminUsersLoginDao');
const logger = require('../../src/lib/logger');
const SamparkApiCall = require('./SamparkApiCall');

const postAdminUserLogin = (req, res, next, passport, callback) => {
  require('../passport')(passport);
  passport.authenticate('bbqh-admin-local-login', (resObj) => {
    try {
      if (resObj.status === '200') {
        const ip = req.ip;
        const ips = req.ips;
        const ipv = net.isIP(ip);
        const uaObj = { ip, ips, ipv, ...JSON.parse(req.headers.vruaduiinfo) };
        AdmnUserLoginSrvcImpl.setUsrLoginRes(resObj.resData.result.toJSON(), res, uaObj, callback);
      } else {
        callback(resObj);
      }
    } catch (error) {
      logger.error('Unknown Error in services/AdmnUserLoginSrvc.js, at postAdminUserLogin(catch):' + error);
      const uke = SetRes.unKnownErr({});
      callback(uke);
    }
  })(req, res, next);
}

const passportVerifyUserLogin = (uResObj, password, callback) => {
  const vu = AdmnUserLoginSrvcImpl.validateUserStatus(uResObj);
  if (vu.status === '200') {
    const pswdObj = CommonSrvc.encryptStr(password, uResObj.logPswdLav);
    if (pswdObj.strHash === uResObj.logPswd) {
      const ls = SetRes.successRes(uResObj);
      callback(ls);
    } else {
      const ic = SetRes.invalidCredentials(invalidPswd);
      callback(ic);
    }
  } else {
    callback(vu);
  }
}

const postAdminUserProfileView = (tData, callback) => {
  AdmnUserLoginSrvcImpl.postAdminUserProfileView(tData, callback);
}

const postAdminUserProfileUpdate = (reqBody, tData, callback) => {
  AdmnUserLoginSrvcImpl.postAdminUserProfileUpdate(reqBody, tData, callback);
}

const AdminForgotPswd = (reqBody, res, callback) => {
  const query = AdmnUserLoginDaoImpl.userGetQuery(reqBody);
  AdminUsersLoginDao.getUserData(query, uResObj => {
    if (uResObj.status == '200') {
      const userData = uResObj.resData.result;
      const vu = AdmnUserLoginSrvcImpl.validateUserStatus(userData);
      if (vu.status === '200') {
        if (userData?.emID) {
          const decodedTokenData = { iss: userData?._id, un: userData?.name, ut: userData?.uType };
          AdmnUserLoginSrvcImpl.adminOtpUpdate(reqBody, userData?._id, decodedTokenData, res, callback);
        } else {
          sendOtpToEmail(config.toMails, userData);
          const resObj = SetRes.msgData();
          callback(resObj);
        }
      } else callback(vu);
    } else callback(uResObj);
  });
}

const AdminForgotPswdOtpVer = (reqBody, tokenDecodedData, res, callback) => {
  AdmnUserLoginSrvcImpl.verifyOTPResponse(tokenDecodedData, reqBody.otp, res, callback);
}

const AdminResetPswd = (reqBody, decodeData, callback) => {
  const genSalt = CommonSrvc.genSalt(config.mySaltLen);
  const pswObj = CommonSrvc.encryptStr(reqBody.password, genSalt);
  const updateObj = AdmnUserLoginDaoImpl.passwordUpdateData(pswObj, decodeData, false);
  const userUpdateQuery = AdmnUserLoginDaoImpl.userOtpGetQuery(decodeData);
  AdminUsersLoginDao.userAdminUpdate(userUpdateQuery, updateObj, callback);
}

const AdminUserLogOut = (reqBody, tData, ipObj, callback) => {
  const query = AdmnUserLoginDaoImpl.setDelUsrSsnQuery(tData);
  AdminUsersLoginDao.adUserSsnDelete(query, callback);
  if (reqBody?.agentId && reqBody?.agentId !== 'None') {
    SamparkApiCall.samparkLogout(reqBody, ipv4, (resObj) => { });
  }
};

const adUserPrflChangePswd = (reqBody, tData, callback) => {
  const query = AdmnUserLoginDaoImpl.postAdminUserProfileView(tData);
  AdminUsersLoginDao.getUserData(query, uResObj => {
    if (uResObj.status == '200') {
      const usrData = uResObj.resData.result;
      const cPswdObj = CommonSrvc.encryptStr(reqBody.curPswrd, usrData.logPswdLav);
      if(cPswdObj.strHash === usrData.logPswd) {
        const genSalt = CommonSrvc.genSalt(config.mySaltLen);
        const pswdObj = CommonSrvc.encryptStr(reqBody.password, genSalt);
        const updateObj = AdmnUserLoginDaoImpl.passwordUpdateData(pswdObj, tData, false);
        const userUpdateQuery = AdmnUserLoginDaoImpl.userPswrdGetQuery(tData);
        AdminUsersLoginDao.userAdminUpdate(userUpdateQuery, updateObj, callback);
      } else {
        const resObj = SetRes.pswdErr({});
        callback(resObj);
      }
    } else callback(uResObj);
  });
}

const postOrgAdminSetPswrd = (reqBody, callback) => {
  const query = AdmnUserLoginDaoImpl.getSsnData(reqBody.id, 'get');
  AdminUsersLoginDao.getAdUserSsnData(query, (resObj) => {
    if (resObj.status == '200') {
      const genSalt = CommonSrvc.genSalt(config.mySaltLen);
      const pswObj = CommonSrvc.encryptStr(reqBody.password, genSalt);
      const tData = {iss: resObj.resData.result.adUser}
      const uQuery = AdmnUserLoginDaoImpl.userPswrdGetQuery(tData);
      const updateObj = AdmnUserLoginDaoImpl.passwordUpdateData(pswObj, {}, true);
      AdminUsersLoginDao.userAdminUpdate(uQuery, updateObj, (resObj1) => {
        if (resObj1.status == '200') {
          const query1 = AdmnUserLoginDaoImpl.getSsnData(reqBody.id, 'delete');
          AdminUsersLoginDao.adUserSsnDelete(query1, callback);
        };
        callback(resObj1);
      });
    } else {
      callback(SetRes.noData('The link has expired. Please request a new link to proceed.'));
    }
  })
}

module.exports = {
  postAdminUserLogin, passportVerifyUserLogin, postAdminUserProfileView, postAdminUserProfileUpdate, 
  AdminForgotPswd, AdminForgotPswdOtpVer, AdminResetPswd, AdminUserLogOut, adUserPrflChangePswd, postOrgAdminSetPswrd
};

const sendOtpToEmail = (email, data) => {
  const eCode = data?.eCode || data?.oCode || 'VRU';
  const eName = data?.eName || data?.oName || 'V Reserve U';
  let mailSub = `${eCode}-ForgotPasswordRequest`;
  let htmlContent = 
  `<p>${eName}(${eCode}) You have received a password reset request from <b>' + data.name + ' ' + data.mobNum+'</b>. You can update the password from the admin panel.
   <p><b>Note:</b> This is a system-generated email. Please do not reply to this message.</p>
   <p>Regards,<br/><b>${eName} Team</b></p>`;
  sendMail.sendEMail(email, mailSub, htmlContent, (err, resObj) => {});
}