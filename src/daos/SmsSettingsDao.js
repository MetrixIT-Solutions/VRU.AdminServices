/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const SmsSettings = require('../schemas/SmsSettings');

const commonCreateFunc = (creatData, callback) => {
  creatData.save().then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.createFailed({});
      callback(uf);
    }
  }).catch((err) => {
      logger.error('Un-known Error in daos/SmsSettingsDao.js, at commonCreateFunc:' + err);
      const errRes2 = SetRes.unKnownErr({});
      callback(errRes2);
  });
}

 const getRstrntSmsSettingsList = (query, reqBody, callback) => {
  let resultObj = { smsSettingsListCount: 0, smsSettingsList: [] };
  SmsSettings.find(query).skip((reqBody.actPgNum - 1) * reqBody.rLimit).limit(reqBody.rLimit).sort({cDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { smsSettingsListCount: resObj.length, smsSettingsList: resObj };
      SmsSettings.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { smsSettingsListCount: resultCount, smsSettingsList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-known Error in daos/SmsSettingsDao.js, at getRstrntSmsSettingsList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      });
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/SmsSettingsDao.js, at getRstrntSmsSettingsList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
 }

const postRstrntSmsSettingsUpdate = (query, updateObj, callback) => {
  SmsSettings.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const upData = SetRes.updateFailed({});
      callback(upData);
    }
  }).catch((error) => {
      logger.error('Un-known Error in daos/SmsSettingsDao.js, at postRstrntSmsSettingsUpdate:' + error);
      const err = SetRes.unKnownErr({});
      callback(err);
  })
}

 module.exports = {
  commonCreateFunc, getRstrntSmsSettingsList, postRstrntSmsSettingsUpdate
};
