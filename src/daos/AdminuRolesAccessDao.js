/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const AdminUserRolesAccess = require('../schemas/AdUserRolesAccess');

const postAdminUsrRlsAcsList = (crntPgNum, rLimit, obj, callback) => {
  let resultObj = { rolesAcsCount: 0, rolesAcsList: [] };
  AdminUserRolesAccess.find(obj.query).sort(obj.sort).skip((crntPgNum - 1) * rLimit).limit(rLimit).then((resObj) => {
    if (resObj && resObj.length > 0) {
      urRlsAcsGetTotalCount(obj.query, resObj, callback);
    } else {
      const result = SetRes.noData(resultObj);
      callback(result);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/AdminUserRolesAccessDao.js, at postAdminUsrRlsAcsList:' + error);
    const uke = SetRes.unKnownErr(resultObj);
    callback(uke);
  });
};

const postAdminUsrRlsAcsCreate = (roleData, callback) => {
  roleData.save().then((resObj) => {
    if (resObj && resObj._id) {
      const succ = SetRes.successRes(resObj);
      callback(succ);
    } else {
      const cf = SetRes.createFailed('Role creation failed');
      callback(cf);
    }
  }).catch((error) => {
    if (error.keyPattern && error.keyPattern.rName || error.keyPattern && error.keyPattern.rCode) {
      const uniq = error.keyPattern.rName ? 'Role Name' : 'Role Code';
      logger.error('Uniqueness Error in daos/AdminUserRolesAccessDao.js, at postAdminUsrRlsAcsCreate:' + error);
      const err = SetRes.uniqueness(uniq + ' Already Exists');
      callback(err);
    } else {
      logger.error('Unknown Error in daos/AdminUserRolesAccessDao.js, at postAdminUsrRlsAcsCreate:' + error);
      const uke = SetRes.unKnownErr({});
      callback(uke);
    }
  });
}

const getAdminUsrRlsAcsView = (query, callback) => {
  AdminUserRolesAccess.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const res = SetRes.successRes(resObj);
      callback(res);
    } else {
      const emp = SetRes.noData({});
      callback(emp);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/AdminUserRolesAccessDao.js, at getAdminUsrRlsAcsView:' + error);
    const uke = SetRes.unKnownErr({});
    callback(uke);
  });
}

const putAdminUsrRlsAcsUpdate = (query, updateObj, callback) => {
  AdminUserRolesAccess.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const res = SetRes.successRes(resObj);
      callback(res);
    } else {
      const cf = SetRes.updateFailed('Update failed');
      callback(cf);
    }
  }).catch((error) => {
    if (error.keyPattern && error.keyPattern.rName || error.keyPattern && error.keyPattern.rCode) {
      const uniq = error.keyPattern.rName ? 'Role Name' : 'Role Code';
      logger.error('Uniqueness Error in daos/AdminUserRolesAccessDao.js, at putAdminUsrRlsAcsUpdate:' + error);
      const err = SetRes.uniqueness(uniq + ' Already Exists');
      callback(err);
    } else {
      logger.error('Unknown Error in daos/AdminUserRolesAccessDao.js, at putAdminUsrRlsAcsUpdate:' + error);
      const uke = SetRes.unKnownErr({});
      callback(uke);
    }
  });
}

module.exports = {
  postAdminUsrRlsAcsList, postAdminUsrRlsAcsCreate, getAdminUsrRlsAcsView, putAdminUsrRlsAcsUpdate
};

const urRlsAcsGetTotalCount = (query, resObj, callback) => {
  let resultObj = { rolesAcsCount: resObj.length, rolesAcsList: resObj };
  AdminUserRolesAccess.countDocuments(query).then((resultCount) => {
    if (resultCount) {
      resultObj = { rolesAcsCount: resultCount, rolesAcsList: resObj };
      const result = SetRes.successRes(resultObj);
      callback(result);
    } else {
      const result = SetRes.successRes(resultObj);
      callback(result);
    }
  }).catch((errCount) => {
    logger.error('Unknown Error in daos/AdminUserRolesAccessDao.js, at urRlsAcsGetTotalCount(countDocuments):' + errCount);
    const result = SetRes.successRes(resultObj);
    callback(result);
  });
}