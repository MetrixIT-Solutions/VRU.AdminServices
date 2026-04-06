/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');
var jwt = require('jsonwebtoken');
var moment = require('moment');

const ausdi = require('./daosimplements/AdmnUserLoginDaoImpl');
const ausd = require('./daos/AdminUsersLoginDao');

'use strict';
var crypto = require('crypto');

var logger = require('./lib/logger');

const ENCRYPTION_KEY = config.criptoEncryptKey; // process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

// --- Begin: adminTokenGeneration: Token Generation Code
const adminTokenGeneration = (userObj, res) => {
  try {
    const exp = moment().add(config.webSessionExpire, config.webSessionExpireType).valueOf();
    const ate = moment().add(3, 'minutes').valueOf();
    const payload = {
      iss: userObj._id,
      uid: userObj.refUID,
      mp: userObj.myPrimary,
      mpt: userObj.mpType,
      un: userObj.name,
      usn: userObj.sName,
      mn: userObj.mobCcNum,
      eid: userObj.emID,
      ut: userObj.uType,
      ur: userObj.uRole,
      urs: userObj.urSeq,
      atn: userObj.acsToken,
      bid: userObj.branch ? userObj.branch : '',
      bcd: userObj.bCode ? userObj.bCode : '',
      bn: userObj.bName ? userObj.bName : '',
      oid: userObj.orgId,
      oc: userObj.oCode,
      on: userObj.oName,
      op: userObj?.oPlan || '',
      ent: userObj.entId ? userObj.entId : '',
      ec: userObj.eCode ? userObj.eCode : '',
      en: userObj.eName ? userObj.eName : '',
      exp, ate
    };

    const jwtToken = jwt.sign(payload, config.jwtSecretKey);
    const token = encrypt(jwtToken);
    res.header('vruadatoken', token);
    return {token, payload};
  } catch(error) {
    logger.error('src/tokens.js - adminTokenGeneration: Un-Known Error: ' + error);
    return null;
  }
}
// --- End: adminTokenGeneration: Token Generation Code

/**
 * Begin: adUsrRefreshToken
 * @param {string} reqToken string
 * @param {object} res
 * @done {function} callback function
 */
const adUsrRefreshToken = (reqToken, res, done) => {
  try {
    const currentDtNum = moment().valueOf();
    const jwtToken = decrypt(reqToken);
    const tokenData = jwt.verify(jwtToken, config.jwtSecretKey);
    if (tokenData?.ate >= currentDtNum) {
      setRefreshToken(tokenData, currentDtNum, reqToken, res, done);
    } else {
      const sQuery = ausdi.setAdUserSsnQuery(tokenData);
      ausd.getAdUserSsnData(sQuery, (resObj) => {
        if (resObj.status === '200') {
          const ate = moment().add(3, 'minutes').valueOf();
          setRefreshToken({ ...tokenData, ate }, currentDtNum, reqToken, res, done);
        } else if (resObj.status === '204') {
          res.header('vruadatoken', reqToken);
          done({ tokenData, status: 'Expired', rolesObj: {} });
        } else {
          res.header('vruadatoken', reqToken);
          done({ tokenData, status: 'Error', rolesObj: {} });
        }
      });
    }
  } catch (error) {
    logger.error('src/tokens.js - adUsrRefreshToken: Un-Known Error: ' + error);
    done(null);
  }
}
// --- End: adUsrRefreshToken

// --- Begin: custUserTokenDecode
const custUserTokenDecode = (reqToken) => {
  try {
    const currentDtNum = moment().valueOf();
    const jwtToken = decrypt(reqToken);
    const tokenData = jwt.decode(jwtToken, config.jwtSecretKey);
    if (tokenData.exp >= currentDtNum) {
      return { tokenData, status: 'Success' };
    } else {
      return { tokenData, status: 'Expired' };
    }
  } catch(error) {
    logger.error('src/tokens.js - custUserTokenDecode: Un-Known Error: ' + error);
    return null;
  }
}
// --- End: custUserTokenDecode

const otpTokenGeneration = (userObj, otpType, res) => {
  try {
    const exp = moment().add(config.otpSessionExpire, config.otpSessionExpireType).valueOf();
    const payload = {
      iss: userObj._id,
      mp: userObj.myPrimary,
      uid: userObj.refUID,
      mn: userObj.mobCcNum || '',
      eid: userObj.emID,
      ut: userObj.uType,
      un: userObj.name,
      ot: otpType,
      exp
    };

    const jwtToken = jwt.sign(payload, config.jwtSecretKey);
    const token = encrypt(jwtToken);
    res.header('vruadotoken', token);
    return token;
  } catch(error) {
    logger.error('src/tokens.js - otpTokenGeneration: Un-Known Error: ' + error);
    return null;
  }
}

const vrucuTokenGeneration = (userObj, otpType, res) => {
  try {
    const exp = moment().add(config.otpSessionExpire, config.otpSessionExpireType) .valueOf();
    const payload = {
      iss: userObj._id,
      mp: userObj.myPrimary,
      uid: userObj.refUID,
      mn: userObj.mobCcNum || '',
      eid: userObj.emID,
      ut: userObj.uType,
      un: userObj.name,
      ot: otpType,
      exp
    };
    const jwtToken = jwt.sign(payload, config.jwtSecretKey);
    const token = encrypt(jwtToken);
    res.header('vrucutoken', token);
    return token
  } catch (error) {
    logger.error('src/tokens.js - vrucuTokenGeneration Error: ' + error);
    return null;
  }
};

const vrucuRefreshToken = (reqToken, res) => {
  try {
    const currentDtNum = moment().valueOf();
    const jwtToken = decrypt(reqToken);
    const tokenData = jwt.verify(jwtToken, config.jwtSecretKey);
    const exp = moment().add(config.webSessionExpire, config.webSessionExpireType).valueOf();
    if (tokenData.exp >= currentDtNum) {
      const payload = { ...tokenData, tt: config.tType, exp };

      const jwtNewToken = jwt.sign(payload, config.jwtSecretKey);
      const token = encrypt(jwtNewToken);
      res.header('vrucutoken', token);
      return { tokenData, status: 'Success' };
    } else {
      res.header('vrucutoken', reqToken);
      return { tokenData, status: 'Expired' };
    }
  } catch (error) {
    logger.error('src/tokens.js - vrucuRefreshToken: Un-Known Error: ' + error);
    return null;
  }
}

// --- Begin: accessTokenValidation
const accessTokenValidation = (reqToken, res, tokenType, callback) => {
  try {
    if(reqToken) {
      const tokenObj = adUsrRefreshToken(reqToken, res, tokenType);
      if (tokenObj && !tokenObj.isExpired) {
        callback({httpStatus: 200, status: '200', tokenData: tokenObj.tokenData});
      } else if (tokenObj && tokenObj.isExpired) {
        logger.error('src/tokens.js - accessTokenValidation: Error: Access token has been expired');
        callback({httpStatus: 400, status: '190', tokenData: {}});
      } else {
        logger.error('src/tokens.js - accessTokenValidation: Error: Access token decode failed');
        callback({httpStatus: 400, status: '191', tokenData: {}});
      }
    } else {
      logger.error('src/tokens.js - accessTokenValidation: Error: Access token is required');
      callback({httpStatus: 400, status: '192', tokenData: {}});
    }
  } catch(error) {
    logger.error('src/tokens.js - accessTokenValidation: Un-Known Error: ' + error);
    callback({httpStatus: 500, status: '199', tokenData: {}});
  }
}
// --- End: accessTokenValidation

/**
 * @param {string} text string
 * @return {string}
 */
const encrypt = (text) => {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * @param {string} text string
 * @return {string}
 */
const decrypt = (text) => {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = {
  adminTokenGeneration, adUsrRefreshToken,
  custUserTokenDecode, accessTokenValidation, otpTokenGeneration, vrucuTokenGeneration, vrucuRefreshToken,
  decrypt, encrypt
}

const setRefreshToken = (tokenData, currentDtNum, reqToken, res, done) => {
  const exp = moment().add(config.webSessionExpire, config.webSessionExpireType).valueOf();
  if (tokenData.exp >= currentDtNum && tokenData.atn) {
    const payload = {...tokenData, exp};

    const jwtNewToken = jwt.sign(payload, config.jwtSecretKey);
    const token = encrypt(jwtNewToken);

    if (tokenData?.ut === 'VRU' || (tokenData?.ut === 'Board' && tokenData.ur === 'Admin')) {
      res.header('vruadatoken', token);
      done({tokenData, status: 'Success', rolesObj: null});
    } else {
      const {getRlAcsData} = require('./services/AdminuRolesAccessSrvc');
      getRlAcsData(tokenData, resObj => {
        res.header('vruadatoken', token);
        const data = resObj.status == '200' ? Object.assign({}, resObj.resData.result.toObject()) : {};
        done({ tokenData, status: 'Success', rolesObj: data });
      });
    }
  } else {
    res.header('vruadatoken', reqToken);
    done({tokenData, status: 'Expired', rolesObj: {}});
  }
}
