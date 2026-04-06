/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const AdminUsers = require('../schemas/AdminUsers');
const AdUserSsns = require('../schemas/AdUserSsns');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const getUserData = (query, callback) => {
  AdminUsers.findOne(query).then((uResObj) => {
    if(uResObj && uResObj._id) {
      const result = SetRes.successRes(uResObj);
      callback(result);
    } else {
      const nD = SetRes.noData({});
      callback(nD);
    }
  }).catch((error) => {
      logger.error('There was an Un-konwn Error occured in daos/AdminUsersLoginDao.js, at getUserData:' + error);
      const err = SetRes.unKnownErr({});
      callback(err);

  });
};

const getAdUserSsnData = (query, callback) => {
  AdUserSsns.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const nD = SetRes.noData({});
      callback(nD);
    }
  }).catch((error) => {
    logger.error('There was an Un-konwn Error occured in daos/AdminUsersLoginDao.js, at getAdUserSsnData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const userAdminUpdate = (query, updateObj, callback) => {
  AdminUsers.findOneAndUpdate(query, { $set: updateObj }, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const resMsg = SetRes.successRes(resObj);
      callback(resMsg);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((err) => {
    logger.error('Unknown Error in daos/AdminUsersLoginDao.js.js at userAdminUpdate: ' + err);
    const errMsg = SetRes.unKnownErr({});
    callback(errMsg);
  });
}

const adUserSsnDelete = (query, callback) => {
  AdUserSsns.deleteOne(query).then((resObj) => {
    if (resObj && resObj.deletedCount > 0) {
      const res = SetRes.successRes(resObj);
      callback(res);
    } else {
      const emp = SetRes.deleteFailed();
      callback(emp);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/AdminUsersLoginDao.js, at adUserSsnDelete:' + error);
    const uke = SetRes.unKnownErr({});
    callback(uke);
  });
}

const createAdUserSsnData = (data, callback) => {
  data.save().then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const nD = SetRes.createFailed({});
      callback(nD);
    }
  }).catch((error) => {
    logger.error('There was an Un-konwn Error occured in daos/AdminUsersLoginDao.js, at createAdUserSsnData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const adUserSsnMultipleDelete = (query, callback) => {
  AdUserSsns.deleteMany(query).then((resObj) => {
    if (resObj && resObj.deletedCount > 0) {
      const res = SetRes.successRes(resObj);
      callback(res);
    } else {
      const emp = SetRes.deleteFailed();
      callback(emp);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/AdminUsersLoginDao.js, at adUserSsnDelete:' + error);
    const uke = SetRes.unKnownErr({});
    callback(uke);
  });
}

module.exports = {
  getUserData, getAdUserSsnData, userAdminUpdate, adUserSsnDelete, createAdUserSsnData, adUserSsnMultipleDelete
}