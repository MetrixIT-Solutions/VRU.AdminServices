/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsUsrsGsi = require('../schemas/CustsUsersGSI');
const CustsUsersGsiClsd = require('../schemas/CustsUsersGSIClsd');
const CustsUsersGsiAns = require('../schemas/CustsUsersGSIAns');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const getCustsGsiListByAgg = (query, callback) => {
  CustsUsrsGsi.aggregate(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/CustsUsrsGsiDao.js, at getCustsGsiListByAgg:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  })
}

const deleteManyGsiData = (query, callback) => {
  CustsUsrsGsi.deleteMany(query).then((resObj) => {
    if (resObj && resObj.deletedCount > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/CustsUsrsGsiDao.js, at deleteManyGsiData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const getGsiAnalysisData = (query, callback) => {
  CustsUsersGsiAns.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const result = SetRes.noData({});
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-known Error in service/CustsUsrsGsiDao.js, at getGsiAnalysisData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const updateGsiAnalysisData = (query, updateobj, callback) => {
  CustsUsersGsiAns.findOneAndUpdate(query, {$set: updateobj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
     const result = SetRes.successRes(resObj);
     callback(result);
   } else {
     const uf = SetRes.updateFailed({});
     callback(uf);
   }
 }).catch((error) => {
   logger.error('Un-known Error in daos/CustsUsrsGsiDao.js, at updateGsiAnalysisData:' + error);
   const err = SetRes.unKnownErr({});
   callback(err);
 })
}

const getCustsGsiList = (query, reqBody, callback) => {
  let resultObj = { custsGsiListCount: 0, custsGsiList: [] };
  CustsUsrsGsi.find(query).skip((reqBody.actPgNum - 1) * reqBody.rLimit).limit(reqBody.rLimit).sort({cDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { custsGsiListCount: resObj.length, custsGsiList: resObj };
      CustsUsrsGsi.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { custsGsiListCount: resultCount, custsGsiList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-known Error in service/CustsUsrsGsiDao.js, at getCustsGsiList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      });
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/CustsUsrsGsiDao.js, at getCustsGsiList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const createData = (data, callback) => {
  data.save().then((resObj) => {
    if (resObj && resObj._id) {
     const result = SetRes.successRes(resObj);
     callback(result);
   } else {
     const cf = SetRes.createFailed({});
     callback(cf);
   }
 }).catch((error) => {
  if (error.keyPattern && error.keyPattern.branch){
    logger.error('Uniqueness Error in daos/CustsUsrsGsiDao.js, at createData:' + error);
    const err = SetRes.uniqueness('A record with the same branch, date, and guest mobile number already exists');
    callback(err);
  } else {
    logger.error('Un-known Error in daos/CustsUsrsGsiDao.js, at createData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  }
 });
}

const custsGsiUpdate = (query, updateobj, callback) => {
  CustsUsrsGsi.findOneAndUpdate(query, {$set: updateobj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
     const result = SetRes.successRes(resObj);
     callback(result);
   } else {
     const uf = SetRes.updateFailed({});
     callback(uf);
   }
 }).catch((error) => {
   logger.error('Un-known Error in daos/CustsUsrsGsiDao.js, at custsGsiUpdate:' + error);
   const err = SetRes.unKnownErr({});
   callback(err);
 });
}

const getCustsGsiView = (query, callback) => {
  CustsUsrsGsi.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const result = SetRes.noData({});
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-known Error in service/CustsUsrsGsiDao.js, at getCustsGsiView:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const updateCustsGsiClsd = (query, updateobj, callback) => {
  CustsUsersGsiClsd.findOneAndUpdate(query, {$set: updateobj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
     const result = SetRes.successRes(resObj);
     callback(result);
   } else {
     const uf = SetRes.updateFailed({});
     callback(uf);
   }
 }).catch((error) => {
   logger.error('Un-known Error in daos/CustsUsrsGsiDao.js, at updateCustsGsiClsd:' + error);
   const err = SetRes.unKnownErr({});
   callback(err);
 });
}

const getCustsGsiTotalList = (query, callback) => {
  CustsUsrsGsi.find(query).then((resObj) => {
    if (resObj && resObj.length) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const result = SetRes.noData({});
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-known Error in service/CustsUsrsGsiDao.js, at getCustsGsiTotalList:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

module.exports = {
  getCustsGsiListByAgg, deleteManyGsiData, getGsiAnalysisData, updateGsiAnalysisData, getCustsGsiList, createData, custsGsiUpdate, getCustsGsiView, updateCustsGsiClsd, getCustsGsiTotalList
};
