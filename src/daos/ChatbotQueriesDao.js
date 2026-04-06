/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const ChatbotQueries = require('../schemas/ChatbotQueries');
const ChatbotQueriesLcs = require('../schemas/ChatbotQueriesLcs');

const createData = (data, callback) => {
  data.save().then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.createFailed({});
      callback(uf);
    }
  }).catch((error) => {
    if(error?.keyPattern?.org){
      logger.error('Un-known Error in daos/ChatbotQueriesDao.js, at createData:' + error);
      const err = SetRes.uniqueness();
      callback(err);
    } else {
      logger.error('Un-known Error in daos/ChatbotQueriesDao.js, at createData:' + error);
      const err = SetRes.unKnownErr();
      callback(err);
    }
  });
}

const getChatbotQrsList = (query, reqBody, callback) => {
  let resultObj = { chatBotListCount: 0, chatBotList: [] };
  ChatbotQueries.find(query).skip((reqBody.actPgNum - 1) * reqBody.rLimit).limit(reqBody.rLimit).sort({cDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { chatBotListCount: resObj.length, chatBotList: resObj };
      ChatbotQueries.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { chatBotListCount: resultCount, chatBotList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-known Error in daos/ChatbotQueriesDao.js, at getChatbotQrsList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      });
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/ChatbotQueriesDao.js, at getChatbotQrsList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const postChatbotUpdate = (query, updateObj, callback) => {
  ChatbotQueries.findOneAndUpdate(query, {$set: updateObj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/ChatbotQueriesDao.js, at getChatbotQrsList:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const getChatbotLfcsList = (query, callback) => {
  ChatbotQueriesLcs.find(query).sort({ cDtStr: -1 }).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const result = SetRes.noData({});
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/ChatbotQueriesDao.js, at getChatbotLfcsList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

module.exports = { createData, getChatbotQrsList, postChatbotUpdate, getChatbotLfcsList }