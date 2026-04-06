/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const RestaurantMenu = require('../schemas/RestaurantMenu');

const commonCreateFunc = (creatData, callback) => {
  creatData.save().then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.createFailed({});
      callback(uf);
    }
  }).catch((err) => {
    if (err.code == '11000') {
      const msg = 'Item already exists with this branch-entity-organisation';
      logger.error('Uniqueness Error in daos/RstrntMenuDao.js, at commonCreateFunc:' + err);
      const errRes = SetRes.uniqueness(msg);
      callback(errRes);
    } else {
      logger.error('Un-konwn Error in daos/RstrntMenuDao.js, at commonCreateFunc:' + err);
      const errRes2 = SetRes.unKnownErr({});
      callback(errRes2);
    }
  });
}

const getRstrntMenuItemsList = (query, actPgNum, rLimit, callback) => {
  let resultObj = { menuListCount: 0, menuList: [] };
  RestaurantMenu.find(query).skip((actPgNum - 1) * rLimit).limit(rLimit).sort({ cDtStr: -1 }).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { menuListCount: resObj.length, menuList: resObj };
      RestaurantMenu.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { menuListCount: resultCount, menuList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in daos/RstrntMenuDao.js, at getRstrntMenuItemsList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      });
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/RstrntMenuDao.js, at getRstrntMenuItemsList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const postRstrntMenuItemUpdate = (query, updateObj, callback) => {
  RestaurantMenu.findOneAndUpdate(query, {$set: updateObj}, {new: true}).then((resObj) => {
   if(resObj && resObj._id){
    const result = SetRes.successRes(resObj);
    callback(result);
   } else {
    const uf = SetRes.updateFailed({});
    callback(uf);
   }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/RstrntMenuDao.js, at postRstrntMenuItemStatusUpdate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const postRstrntMenuItemDelete = (query, callback) => {
  RestaurantMenu.deleteOne(query).then((resObj) => {
    if(resObj && resObj.deletedCount > 0){
     const result = SetRes.successRes(resObj);
     callback(result);
    } else {
     const df = SetRes.deleteFailed({});
     callback(df);
    }
   }).catch((error) => {
     logger.error('Un-konwn Error in daos/RstrntMenuDao.js, at postRstrntMenuItemDelete:' + error);
     const err = SetRes.unKnownErr({});
     callback(err);
   })
}

 module.exports = {
  commonCreateFunc, getRstrntMenuItemsList, postRstrntMenuItemUpdate, postRstrntMenuItemDelete
};
