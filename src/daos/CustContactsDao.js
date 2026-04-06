/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsContacts = require('../schemas/CustsContacts');
const CustsContactsLfcs = require('../schemas/CustsContactsLfcs');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const getCustContactsList = (query, reqBody, callback) => {
  let resultObj = { contactsListCount: 0, contactsList: [] };
  CustsContacts.find(query).skip((reqBody.actPgNum - 1) * reqBody.rLimit).limit(reqBody.rLimit).sort({cDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { contactsListCount: resObj.length, contactsList: resObj };
      CustsContacts.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { contactsListCount: resultCount, contactsList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in service/CustContactsDao.js, at getCustContactsList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      });
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustContactsDao.js, at getCustContactsList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const custContactsUpdate = (query, updateObj, callback) => {
  CustsContacts.findOneAndUpdate(query, {$set: updateObj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustContactsDao.js, at custContactsUpdate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const commonCreateFunc = (createObj, callback) => {
  createObj.save().then((uResObj) => {
    if (uResObj && uResObj._id) {
      const result = SetRes.successRes(uResObj);
      callback(result);
    } else {
      const cF = SetRes.createFailed({});
      callback(cF);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/CustsContactsDao.js, at commonCreateFunc:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
};

const getCustContactLfcsList = (query, callback) => {
  CustsContactsLfcs.find(query).sort({ cDtStr: -1 }).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const result = SetRes.noData({});
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/CustsContactsDao.js, at getCustContactLfcsList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

module.exports = {
  getCustContactsList, custContactsUpdate, commonCreateFunc, getCustContactLfcsList
};
