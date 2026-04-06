/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const RestaurantCategories = require('../schemas/RestaurantCategories');

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
    logger.error('Unknown Error in daos/RstrntCategoriesDao.js, at commonCreateFunc:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getCategoriesList = (query, callback) => {
  RestaurantCategories.find(query).sort({cDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData([]);
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/RstrntCategoriesDao.js, at getCategoriesList:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}


//----------------------END Private Dining Apis----------------------//\

module.exports = {
  commonCreateFunc, getCategoriesList
};
