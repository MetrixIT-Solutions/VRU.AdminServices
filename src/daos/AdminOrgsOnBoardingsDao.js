/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const adOrgsOnBrdngs = require('../schemas/AdminOrgsOnBoardings');
const adOrgsOnBrdngsLcs = require('../schemas/AdminOrgsOnBoardingsLcs');

const adminOrgsOnbrdngsList = (crntPgNum, rLimit, query, callback) => {
  let resultObj = { onBrdngsCount: 0, onBrdngsList: [] };
  adOrgsOnBrdngs.find(query).sort({ cDtStr: -1 }).skip((crntPgNum - 1) * rLimit).limit(rLimit).then((resObj) => {
    if (resObj && resObj.length > 0) {
      urRlsGetTotalCount(query, resObj, callback);
    } else {
      const result = SetRes.noData(resultObj);
      callback(result);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/AdminOrgsOnBoardingsDaos.js, at adminOrgsOnbrdngsList:' + error);
    const uke = SetRes.unKnownErr(resultObj);
    callback(uke);
  });
};

const postAdminOrgsOnBrdngCreate = (createData, callback) => {
  createData.save().then((resObj) => {
    if (resObj && resObj._id) {
      const succ = SetRes.successRes(resObj);
      callback(succ);
    } else {
      const cf = SetRes.createFailed('Failed');
      callback(cf);
    }
  }).catch((error) => {
    if (error.code == '11000') {
      const msg = error?.keyPattern?.oName ? 'Organization Name ' : error?.keyPattern?.oCode ? 'Organization Code ' : error?.keyPattern?.mobCcNum ? 'Mobile Number ' : 'Email ID';
      logger.error('Uniqueness Error in daos/AdminOrgsDao.js, at postAdminOrgCreate:' + error);
      const err = SetRes.uniqueness(msg + 'Already Exists');
      callback(err);
    } else {
      logger.error('Unknown Error in daos/AdminOrgsOnBoardingsDaos.js, at postAdminOrgsOnBrdngCreate:' + error);
      const uke = SetRes.unKnownErr({});
      callback(uke);
    }
  });
}

const getAdminOrgsOnBrdngView = (query, callback) => {
  adOrgsOnBrdngs.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const res = SetRes.successRes(resObj);
      callback(res);
    } else {
      const emp = SetRes.noData({});
      callback(emp);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/AdminOrgsOnBoardingsDaos.js, at getAdminOrgsOnBrdngView:' + error);
    const uke = SetRes.unKnownErr({});
    callback(uke);
  })
}

const putAdminOrgsOnBrdngUpdate = (query, updateObj, callback) => {
  adOrgsOnBrdngs.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const res = SetRes.successRes(resObj);
      callback(res);
    } else {
      const cf = SetRes.updateFailed('Update failed');
      callback(cf);
    }
  }).catch((error) => {
    if (error.code == '11000') {
      const msg = error?.keyPattern?.oName ? 'Organization Name ' : error?.keyPattern?.oCode ? 'Organization Code ' : error?.keyPattern?.mobCcNum ? 'Mobile Number ' : 'Email ID';
      logger.error('Uniqueness Error in daos/AdminOrgsDao.js, at postAdminOrgCreate:' + error);
      const err = SetRes.uniqueness(msg + 'Already Exists');
      callback(err);
    } else {
      logger.error('Unknown Error in daos/AdminOrgsOnBoardingsDaos.js, at putAdminOrgsOnBrdngUpdate:' + error);
      const uke = SetRes.unKnownErr({});
      callback(uke);
    }
  })
}

const getOnbrdngsLfcsList = (query, callback) => {
adOrgsOnBrdngsLcs.find(query).sort({ cDtStr: -1 }).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const result = SetRes.noData({});
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/AdminOrgsOnBoardingsDaos.js, at getOnbrdngsLfcsList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

module.exports = {
  adminOrgsOnbrdngsList, postAdminOrgsOnBrdngCreate, getAdminOrgsOnBrdngView, putAdminOrgsOnBrdngUpdate, getOnbrdngsLfcsList
};

const urRlsGetTotalCount = (query, resObj, callback) => {
  let resultObj = { onBrdngsCount: resObj.length, onBrdngsList: resObj };
  adOrgsOnBrdngs.countDocuments(query).then((resultCount) => {
    if (resultCount) {
      resultObj = { onBrdngsCount: resultCount, onBrdngsList: resObj };
      const result = SetRes.successRes(resultObj);
      callback(result);
    } else {
      const result = SetRes.successRes(resultObj);
      callback(result);
    }
  }).catch((errCount) => {
    logger.error('Unknown Error in daos/AdminOrgsOnBoardingsDaos.js, at urRlsGetTotalCount(countDocuments):' + errCount);
    const result = SetRes.successRes(resultObj);
    callback(result);
  });
}