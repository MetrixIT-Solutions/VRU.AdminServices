/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsFeedbacks = require('../schemas/CustsFeedbacks');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const getfFdbkList = (query, reqBody, callback) => {
  let resultObj = { feedbackListCount: 0, feedbackList: [] };
  CustsFeedbacks.find(query).skip((reqBody.actPgNum - 1) * reqBody.rLimit).limit(reqBody.rLimit).sort({cDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { feedbackListCount: resObj.length, feedbackList: resObj };
      CustsFeedbacks.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { feedbackListCount: resultCount, feedbackList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in service/CustFeedbacksDao.js, at getfFdbkList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      });
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustFeedbacksDao.js, at getfFdbkList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const commonCreateFunc = (newObj, callback) => {
  const fdbk = new CustsFeedbacks(newObj);
  fdbk.save().then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const uf = SetRes.createFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustFeedbacksDao.js, at commonCreateFunc:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

module.exports = {
  getfFdbkList, commonCreateFunc
};
