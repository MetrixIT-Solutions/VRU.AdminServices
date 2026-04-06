/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsOffers = require('../schemas/CustsOffers');
const CustsTableBookings = require('../schemas/CustsTableBookings');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const getCustOfrsList = (query, reqBody, callback) => {
  let resultObj = { offersListCount: 0, offersList: [] };
  CustsOffers.find(query).skip((reqBody.actPgNum - 1) * reqBody.rLimit).limit(reqBody.rLimit).sort({cDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { offersListCount: resObj.length, offersList: resObj };
      CustsOffers.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { offersListCount: resultCount, offersList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in service/CustsOffersDao.js, at getCustOfrsList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      });
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsOffersDao.js, at getCustOfrsList:' + error);
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
   logger.error('Un-konwn Error in daos/CustsOffersDao.js, at createData:' + error);
   const err = SetRes.unKnownErr({});
   callback(err);
 });
}

const custOfrsUpdate = (query, updateobj, callback) => {
  CustsOffers.findOneAndUpdate(query, {$set: updateobj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
     const result = SetRes.successRes(resObj);
     callback(result);
   } else {
     const uf = SetRes.updateFailed({});
     callback(uf);
   }
 }).catch((error) => {
   logger.error('Un-konwn Error in daos/CustsOffersDao.js, at custfrnchStsUpdate:' + error);
   const err = SetRes.unKnownErr({});
   callback(err);
 });
}

const custBkngCount = (query, callback) => {
  CustsTableBookings.countDocuments(query).then((resultCount) => {
    if (resultCount > 0) {
      const result = SetRes.countRes(resultCount);
      callback(result);
    } else {
      const result = SetRes.noData({});
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustsOffersDao.js, at custBkngCount:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const custOfrsDelete = (query, callback) => {
  CustsOffers.findOneAndDelete(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const result = SetRes.updateFailed({});
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustsOffersDao.js, at custOfrsDelete:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getOffersData = (query, callback) => {
  CustsOffers.find(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsOffersDao.js, at getOffersData:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}

module.exports = {
  getCustOfrsList, createData, custOfrsUpdate, custBkngCount, custOfrsDelete, getOffersData
};
