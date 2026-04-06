/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const custsTableBlckdDts = require('../schemas/CustsTableBlckdDts');
const logger = require('../lib/logger');
const SetRes = require('../SetRes');

const tableBolckedCreate = (data, callback) => {
  data.save().then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.createFailed({});
      callback(uf);
    }
  }).catch((error) => {
    if (error?.keyPattern?.branch) {
      logger.error('Un-known Error in daos/custsTableBlckdDtsDao.js, at tableBolckedCreate:' + error);
      const err = SetRes.uniqueness();
      callback(err);
    } else {
      logger.error('Un-known Error in daos/custsTableBlckdDtsDao.js, at tableBolckedCreate:' + error);
      const err = SetRes.unKnownErr();
      callback(err);
    }
  });
}

const tableBolckedList = (crntPgNum, rLimit, obj, callback) => {
  let resultObj = { tableBolckedListCount: 0, tableBolckedList: [] };
  custsTableBlckdDts.find(obj.query).sort(obj.sort).skip((crntPgNum - 1) * rLimit).limit(rLimit).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { tableBolckedListCount: resObj.length, tableBolckedList: resObj };
      custsTableBlckdDts.countDocuments(obj.query).then((resultCount) => {
        if (resultCount) {
          resultObj = { tableBolckedListCount: resultCount, tableBolckedList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((errorCount) => {
        logger.error('Unknown Error in daos/custsTableBlckdDtsDao.js, at tableBolckedList(countDocuments):' + errorCount);
        const result = SetRes.unKnownErr(resultObj);
        callback(result);
      })
    } else {
      const result = SetRes.noData(resultObj);
      callback(result);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/custsTableBlckdDtsDao.js, at tableBolckedList:' + error);
    const uke = SetRes.unKnownErr(resultObj);
    callback(uke);
  })
};

const tableBolckedStatusUpdate = (query, updateObj, callback) => {
  custsTableBlckdDts.findOneAndUpdate(query, {$set: updateObj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/custsTableBlckdDtsDao.js, at tableBolckedStatusUpdate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

module.exports = {
  tableBolckedCreate, tableBolckedList, tableBolckedStatusUpdate
}