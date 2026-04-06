/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const RestaurantInfos = require('../schemas/RestaurantInfos');
const SetRes = require('../SetRes');
const RestaurantPricings = require('../schemas/RestaurantPricings');

const logger = require('../lib/logger');


const getSpclDayPricingsList = (query, callback) => {
  RestaurantInfos.find(query).then((resObj) => {
    if (resObj && resObj.length) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/SettingsDao.js, at getSpclDayPricingsList:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const postBbqhRestPricingView = (query, callback) => {
  RestaurantPricings.find(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData([]);
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/SettingsDao.js, at postBbqhRestPricingView:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  })
}

const getResPricingData = (query, callback) => {
  RestaurantPricings.findOne(query).then((resObj) => {
    if (resObj) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/SettingsDao.js, at postBbqhRestPricingView:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}


const updatePricingData = (query, uObj, callback) => {
  RestaurantPricings.findOneAndUpdate(query, {$set: uObj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/SettingsDao.js, at updatePricingData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const deleteSpclDayPricingsData = (query, callback) => {
  RestaurantInfos.deleteMany(query).then((resObj) => {
    if (resObj.deletedCount > 0) {
      const sr = SetRes.successRes('Success');
      callback(sr);
    } else {
      const nd = SetRes.deleteFailed();
      callback(nd);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/SettingsDao.js, at getBbqhRestuarantView:' + error);
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
    logger.error('Unknown Error in daos/SettingsDao.js, at commonCreateFunc:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getBbqhRestuarantView = (query, callback) => {
  RestaurantInfos.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const nd = SetRes.noData({});
      callback(nd);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/SettingsDao.js, at getBbqhRestuarantView:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const updateRestuarantInfo = (query, uObj, callback) => {
  RestaurantInfos.findOneAndUpdate(query, {$set: uObj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/SettingsDao.js, at updateRestuarantInfo:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const postBbqhRstrntSpclDaysPricingsList = (query, actPgNum, rLimit, callback) => {
  let resultObj = { spclDaysPrcngsListCount: 0, spclDaysPrcngsList: [] };
  RestaurantInfos.find(query).skip((actPgNum - 1) * rLimit).limit(rLimit).sort({ cDtStr: -1 }).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { spclDaysPrcngsListCount: resObj.length, spclDaysPrcngsList: resObj };
      RestaurantInfos.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { spclDaysPrcngsListCount: resultCount, spclDaysPrcngsList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in daos/SettingsDao.js, at postBbqhRstrntSpclDaysPricingsList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      });
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/SettingsDao.js, at postBbqhRstrntSpclDaysPricingsList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

module.exports = {
  getSpclDayPricingsList, deleteSpclDayPricingsData, commonCreateFunc, getBbqhRestuarantView, deleteSpclDayPricingsData, updateRestuarantInfo, 
  postBbqhRstrntSpclDaysPricingsList, postBbqhRestPricingView, updatePricingData, getResPricingData
}