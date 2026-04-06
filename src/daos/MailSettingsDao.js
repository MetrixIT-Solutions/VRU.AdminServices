/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const MailSettings = require('../schemas/MailSettings');

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
      logger.error('Un-known Error in daos/MailSettingsDao.js, at commonCreateFunc:' + err);
      const errRes2 = SetRes.unKnownErr({});
      callback(errRes2);
  });
}

 const getRstrntMailSettingsList = (query, reqBody, callback) => {
  let resultObj = { mailSettingsListCount: 0, mailSettingsList: [] };
  MailSettings.find(query).skip((reqBody.actPgNum - 1) * reqBody.rLimit).limit(reqBody.rLimit).sort({cDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { mailSettingsListCount: resObj.length, mailSettingsList: resObj };
      MailSettings.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { mailSettingsListCount: resultCount, mailSettingsList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-known Error in daos/MailSettingsDao.js, at getRstrntMailSettingsList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      });
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/MailSettingsDao.js, at getRstrntMailSettingsList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
 }

const postRstrntMailSettingsUpdate = (query, updateObj, callback) => {
  MailSettings.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const upData = SetRes.updateFailed({});
      callback(upData);
    }
  }).catch((error) => {
      logger.error('Un-known Error in daos/MailSettingsDao.js, at postRstrntMailSettingsUpdate:' + error);
      const err = SetRes.unKnownErr({});
      callback(err);
  });
}

 module.exports = {
  commonCreateFunc, getRstrntMailSettingsList, postRstrntMailSettingsUpdate
};
