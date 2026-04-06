/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const CustsCallLogs = require('../schemas/CustsCallLogs')

const commonCreateFunc = (data, callback) => {
  data.save().then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const cf = SetRes.createFailed({});
      callback(cf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsCallLOgsDao.js, at commonCreateFunc:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getAdminCustCallLogsList = (crntPgNum, rLimit, obj, callback) => {
  let resultObj = { adminCustCallLogsListCount: 0, adminCustCallLogsList: [] };
  CustsCallLogs.find(obj.query).sort(obj.sort).skip((crntPgNum - 1) * rLimit).limit(rLimit).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { adminCustCallLogsListCount: resObj.length, adminCustCallLogsList: resObj };
      CustsCallLogs.countDocuments(obj.query).then((resultCount) => {
        if (resultCount) {
          resultObj = { adminCustCallLogsListCount: resultCount, adminCustCallLogsList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((errorCount) => {
        logger.error('Unknown Error in daos/AdminCustCallLogsDao.js, at getAdminCustCallLogsList(countDocuments):' + errorCount);
        const result = SetRes.unKnownErr(resultObj);
        callback(result);
      })
    } else {
      const result = SetRes.noData(resultObj);
      callback(result);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/AdminCustCallLogsDao.js, at getAdminCustCallLogsList:' + error);
    const uke = SetRes.unKnownErr(resultObj);
    callback(uke);
  })
};

const getAdminCustCallLogData = (query, callback) => {
  CustsCallLogs.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/AdminCustCallLogsDao.js, at getAdminCustCallLogData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const custCallLogsList = (query, sort, callback) => {
  CustsCallLogs.find(query).sort(sort).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/AdminCustCallLogsDao.js, at custCallLogsList:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const deleteCallLogs = (query, callback) => {
  CustsCallLogs.findOneAndDelete(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/AdminCustCallLogsDao.js, at deleteCallLogs:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const postAdminCustCallLogCountByStatus = (query, callback) => {
  CustsCallLogs.aggregate(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData([]);
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/AdminCustCallLogsDao.js, at postAdminCustCallLogCountByStatus:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}

module.exports = {
  commonCreateFunc, getAdminCustCallLogsList, getAdminCustCallLogData, custCallLogsList, deleteCallLogs, postAdminCustCallLogCountByStatus
};
