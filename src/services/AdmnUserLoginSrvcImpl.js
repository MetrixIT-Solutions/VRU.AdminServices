/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const config = require('config');
const AdmnUserLoginDaoImpl = require('../daosimplements/AdmnUserLoginDaoImpl');
const SetRes = require('../SetRes');
const token = require('../tokens');
const AdminUsersDao = require('../daos/AdminUsersDao');
const SamparkSrvc = require('./SamparkApiCall');

const randomNumber = require('random-number');
const CommonSrvc = require('../services/CommonSrvc');
const AdURASrvc = require('../services/AdminuRolesAccessSrvc');
const AdminUsersLoginDao = require('../daos/AdminUsersLoginDao');

const sendMail = require('../../config/mail');
const logger = require('../lib/logger');

const us = { active: 'Active', blocked: 'Blocked', hold: 'Hold', inactive: 'Inactive' };
const ur = { ca: 'Call Agent' };

const validateUserStatus = (uObj) => {
  if (uObj?.oStatus != 'Active'){
     const oebInAcv = SetRes.oebInactive('organization');
    return oebInAcv;
  } else if(uObj?.eStatus != 'Active') {
    const oebInAcv = SetRes.oebInactive('entity');
    return oebInAcv;
  } else if(uObj?.bStatus != 'Active') {
    const oebInAcv = SetRes.oebInactive('branch');
    return oebInAcv;
  } else if (uObj.uStatus === us.active) {
    return { status: '200' };
  } else if (uObj.uStatus === us.blocked) {
    const bAcc = SetRes.accBlocked();
    return bAcc;
  } else if (uObj.uStatus === us.hold) {
    const hAcc = SetRes.accHold();
    return hAcc;
  } else if (uObj.uStatus === us.inactive) {
    const iaAcc = SetRes.accInactive();
    return iaAcc;
  } else {
    const invd = SetRes.invalidCredentials(inValid);
    return invd;
  }
}

const setUsrLoginRes = (uResObj, res, uaObj, callback) => {
  const ausObj = AdmnUserLoginDaoImpl.setLoginSession(uResObj, uaObj);
  AdminUsersDao.createUser(ausObj.adus, (resObj) => {
    if (resObj.status === '200') {
      const ssnObj = resObj.resData.result;
      AdminUsersDao.createUser(ausObj.adusClsd, (resObj2) => { });
      const tObj = token.adminTokenGeneration({ acsToken: ssnObj._id, ...uResObj }, res);
      if (tObj && tObj?.payload) {
        AdURASrvc.getRlAcsData(tObj?.payload, raRes => {
          const uObj = AdmnUserLoginDaoImpl.setUsrData(uResObj);
          const ls = SetRes.successRes(uObj);
          if (tObj?.payload?.ut === 'VRU' || (tObj?.payload?.ut === 'Board' && tObj?.payload?.ur === 'Admin')) {
            const data = { ...ls, resData: { ...ls.resData, rAccObj: null, oPlan: tObj?.payload?.op } };
            callback(data);
          } else {
            const rolesObj = raRes.status == '200' ? Object.assign({}, raRes?.resData?.result?.toObject()) : {};
            const data = { ...ls, resData: { ...ls.resData, rAccObj: rolesObj, oPlan: tObj?.payload?.op } };
            callback(data);
          }
          uResObj.uRole == 'Call Agent' && SamparkSrvc.samparkLogin(uResObj, '0.0.0.0', (resObj) => { });
        });
      } else {
        const uke = SetRes.unKnownErr({});
        callback(uke);
      }
    } else {
      const uke = SetRes.unKnownErr({});
      callback(uke);
    }
  });
}

const postAdminUserProfileView = (tData, callback) => {
  const query = AdmnUserLoginDaoImpl.postAdminUserProfileView(tData);
  AdminUsersDao.getAdminUserData(query, callback);
}

const postAdminUserProfileUpdate = (reqBody, tData, callback) => {
  const obj = AdmnUserLoginDaoImpl.postAdminUserProfileUpdate(reqBody, tData);
  AdminUsersDao.updateAdminUserData(obj.query, obj.updateObj, callback);
}

const adminOtpUpdate = (reqBody, userId, tData, res, callback) => {
  const otpNumberLimit = { min: 100000, max: 999999, integer: true };
  const otpNumber = randomNumber(otpNumberLimit).toString();
  const currentUTC = CommonSrvc.currUTCObj();
  const genSalt =  CommonSrvc.genSalt(config.mySaltLen);
  const pswObj = CommonSrvc.encryptStr(otpNumber, genSalt);
  if (pswObj && pswObj.strHash) {
    const updateObj = AdmnUserLoginDaoImpl.setOtpUserData(pswObj, tData, currentUTC);
    const userUpdateQuery = AdmnUserLoginDaoImpl.userGetQuery(reqBody);
    AdminUsersLoginDao.userAdminUpdate(userUpdateQuery, updateObj, (otpRes) => {
      if (otpRes.status == '200') {
        const otpResult = otpRes.resData.result;
        const tokenD = token.otpTokenGeneration(otpResult, 'forgot', res);
        if (tokenD) {
          const eCode = otpResult?.eCode || otpResult?.oCode || 'VRU';
          const eName = otpResult?.eName || otpResult?.oName || 'V Reserve U';
          const mailSub = `${eCode}-ForgotPassword-OTP`;
          const mailContent = 
          `<p>${eName}(${eCode}) Password Verification Code <b>${otpNumber}</b></p>
           <p><b>Note:</b> This is a system-generated email. Please do not reply to this message.</p>
           <p>Regards,<br/><b>${eName} Team</b></p>`;
          sendOtpToEmail(otpResult.emID, mailSub, mailContent);
          callback({ httpStatus: 200, status: '201', resData: { email: otpResult.emID, otpMessage: 'OTP Sent Successfully' } });
        } else {
          logger.error('There was an Un-known Error in services/AdminUsersLoginSrvcImpl.js at adminOtpUpdate - otpTokenGeneration: Token generation failed');
          callback({ httpStatus: 400, status: '181', resData: { otpMessage: 'OTP Sent failed' } });
        }
      } else
        callback({ httpStatus: otpRes.httpStatus, status: '183', resData: { email: reqBody.usrID, otpMessage: 'OTP Sent failed' } });
    });
  } else {
    logger.error('There was an Error in services/AdminUsersLoginSrvcImpl.js, at adminOtpUpdate: OTP Sent failed');
    callback({ httpStatus: 400, status: '183', result: { email: reqBody.usrID, otpMessage: 'OTP Sent failed' } });
  }
}

const verifyOTPResponse = (tokenDecodedData, otpNumber, res, callback) =>  {
  const query = AdmnUserLoginDaoImpl.userOtpGetQuery(tokenDecodedData);
  AdminUsersLoginDao.getUserData(query, (userObj) => {
    if (userObj.status == '200') {
      const pswObj =  CommonSrvc.encryptStr(otpNumber, userObj.resData.result.otpLav);
      if (pswObj.strHash == userObj.resData.result.otp) {
        const tokenD = token.otpTokenGeneration(userObj.resData.result, 'reset-password', res);
        if (tokenD) {
          callback({ httpStatus: 200, status: '202', resData: { otpMessage: 'OTP verified successfully' } });
        } else {
          logger.error('There was an Un-known Error in services/AdminUsersLoginSrvcImpl.js at verifyOTPResponse - loginOTPTokenGeneration: Token generation failed');
          callback({ httpStatus: 500, status: '181', resData: { otpMessage: 'OTP verification failed', message: '' } });
        }
      } else {
        logger.error('There was an Error in services/AdminUsersLoginSrvcImpl.js at verifyOTPResponse - passwordEncryption: OTP verification failed');
        callback({ httpStatus: 400, status: '182', resData: { otpMessage: 'OTP verification failed', message: 'Invalid OTP' } });
      }
    } else {
      logger.error('There was an Error in services/AdminUsersLoginSrvcImpl.js at verifyOTPResponse - UserLogin: OTP verification failed');
      callback({ httpStatus: 400, status: '182', resData: { otpMessage: 'OTP verification failed', message: userObj.status === '204' ? 'Invalid user account' : 'Unknown Error' } });
    }
  });
}

module.exports = {
  validateUserStatus, setUsrLoginRes, postAdminUserProfileView, postAdminUserProfileUpdate, adminOtpUpdate, verifyOTPResponse
};
const sendOtpToEmail = (email, mailSub, mailContent) => {
  sendMail.sendEMail(email, mailSub, mailContent, (resObj) => {});
}
