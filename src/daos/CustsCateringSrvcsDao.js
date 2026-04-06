/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const ccs = require('../schemas/CustsCateringSrvcs');

//----------------------BEGIN Catering Srvcs Apis----------------------//\

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
    logger.error('Unknown Error in daos/CustsCateringSrvcsDao.js, at commonCreateFunc:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getCateringSrvcsList = (obj, reqBody, callback) => {
  let resultObj = { catSrvcsListCount: 0, catSrvcsList: [] };
  ccs.find(obj.query).skip((reqBody.actPgNum - 1) * reqBody.rLimit).limit(reqBody.rLimit).sort(obj.sortQry).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { catSrvcsListCount: resObj.length, catSrvcsList: resObj };
      ccs.countDocuments(obj.query).then((resultCount) => {
        if (resultCount) {
          resultObj = { catSrvcsListCount: resultCount, catSrvcsList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in daos/CustsCateringSrvcsDao.js, at getCateringSrvcsList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      })
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsCateringSrvcsDao.js, at getCateringSrvcsList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const cateringSrvcView = (query, callback) => {
  ccs.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsCateringSrvcsDao.js, at cateringSrvcView:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const cateringSrvcUpdate = (query, updateObj, callback) => {
  ccs.findOneAndUpdate(query, updateObj, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsCateringSrvcsDao.js, at cateringSrvcUpdate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

//----------------------END Catering Srvcs Apis----------------------//\

module.exports = {
  commonCreateFunc, getCateringSrvcsList, cateringSrvcView, cateringSrvcUpdate
};

