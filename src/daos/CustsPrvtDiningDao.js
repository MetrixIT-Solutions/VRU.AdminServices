/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const CustsPrivateDining = require('../schemas/CustsPrivateDining');
const CustsPrivateDiningLcs = require('../schemas/CustsPrivateDiningLcs');

//----------------------BEGIN Private Dining Apis----------------------//\

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
    logger.error('Unknown Error in daos/CustsPrvtDiningDao.js, at commonCreateFunc:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getPrivateDiningList = (query, reqBody, callback) => {
  let resultObj = { privateDiningListCount: 0, privateDiningList: [] };
  CustsPrivateDining.find(query).skip((reqBody.actPgNum - 1) * reqBody.rLimit).limit(reqBody.rLimit).sort({ bDtStr: 1 }).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { privateDiningListCount: resObj.length, privateDiningList: resObj };
      CustsPrivateDining.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { privateDiningListCount: resultCount, privateDiningList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in daos/CustsPrvtDiningDao.js, at getPrivateDiningList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      })
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsPrvtDiningDao.js, at getPrivateDiningList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const privateDiningView = (query, callback) => {
  CustsPrivateDining.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsPrvtDiningDao.js, at privateDiningView:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const privateDiningUpdate = (query, updateObj, callback) => {
  CustsPrivateDining.findOneAndUpdate(query, {$set: updateObj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsPrvtDiningDao.js, at privateDiningUpdate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const privateDiningCommonAggregateFunc = (query, callback) => {
  CustsPrivateDining.aggregate(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData([]);
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsPrvtDiningDao.js, at privateDiningCommonAggregateFunc:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}

 const getPrivateDiningLcsList = (query, callback) => {
   CustsPrivateDiningLcs.find(query).sort({ cDtStr: -1 }).then((resObj) => {
     if (resObj && resObj.length > 0) {
       const result = SetRes.successRes(resObj);
       callback(result);
     } else {
       const result = SetRes.noData({});
       callback(result);
     }
   }).catch((error) => {
     logger.error('Un-known Error in daos/CustsPrvtDiningDao.js, at getCustContactLfcsList:' + error);
     const err = SetRes.unKnownErr(resultObj);
     callback(err);
   }); 
}

const getPrivateDiningTotalList = (query, project, callback) => {
  CustsPrivateDining.find(query, project).sort({ cDtStr: -1 }).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsPrvtDiningDao.js, at getPrivateDiningTotalList:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}

//----------------------END Private Dining Apis----------------------//\

module.exports = {
  commonCreateFunc, getPrivateDiningList, privateDiningView, privateDiningUpdate, privateDiningCommonAggregateFunc,
  getPrivateDiningLcsList, getPrivateDiningTotalList
};
