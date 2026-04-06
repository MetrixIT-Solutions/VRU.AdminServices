/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustFranchise = require('../schemas/CustsFranchise');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const getfrnchList = (query, reqBody, callback) => {
  let resultObj = { franchiseListCount: 0, franchiseList: [] };
  CustFranchise.find(query).skip((reqBody.actPgNum - 1) * reqBody.rLimit).limit(reqBody.rLimit).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { franchiseListCount: resObj.length, franchiseList: resObj };
      CustFranchise.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { franchiseListCount: resultCount, franchiseList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in service/CustFranchiseDao.js, at getfrnchList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      });
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustFranchiseDao.js, at getfrnchList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const custfrnchStsUpdate = (query, updateobj, callback) => {
  CustFranchise.findOneAndUpdate(query, {$set: updateobj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustFranchiseDao.js, at custfrnchStsUpdate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const custFranchiseCommonAggregateFunc = (query, callback) => {
  CustFranchise.aggregate(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData([]);
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustFranchiseDao.js, at custFranchiseCommonAggregateFunc:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}

const custfrnchCreate = (newObj, callback) => {
  const custFrnch = new CustFranchise(newObj);
  custFrnch.save().then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const uf = SetRes.createFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustFranchiseDao.js, at custfrnchCreate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getFrnchsView = (query, callback) => {
  CustFranchise.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const result = SetRes.noData({});
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/CustFranchiseDao.js, at getFrnchsView:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

module.exports = {
  getfrnchList, custfrnchStsUpdate, custFranchiseCommonAggregateFunc, custfrnchCreate, getFrnchsView
};
