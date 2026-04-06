/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const adminUsrRoles = require('../schemas/AdUserRoles');

const adminUsrRlsList = (crntPgNum, rLimit, obj, callback) => {
  let resultObj = { rolesCount: 0, rolesList: [] };
  adminUsrRoles.find(obj.query).sort(obj.sort).skip((crntPgNum - 1) * rLimit).limit(rLimit).then((resObj) => {
    if (resObj && resObj.length > 0) {
      urRlsGetTotalCount(obj.query, resObj, callback);
    } else {
      const result = SetRes.noData(resultObj);
      callback(result);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/AdminuRolesDaos.js, at adminUsrRlsList:' + error);
    const uke = SetRes.unKnownErr(resultObj);
    callback(uke);
  });
};

const postAdminUsrRlsCreate = (roleData, callback) => {
  roleData.save().then((resObj) => {
    if (resObj && resObj._id) {
      const succ = SetRes.successRes(resObj);
      callback(succ);
    } else {
      const cf = SetRes.createFailed('Role creation failed');
      callback(cf);
    }
  }).catch((error) => {
    if (error.errmsg && error.errmsg.indexOf('rName') > 0) {
      logger.error('There was an Uniqueness(rName) error occured in daos/AdminuRolesDaos.js, at postAdminUsrRlsCreate:' + error);
      const nue = SetRes.createFailed('Role Name already exists');
      callback(nue);
    } else if (error.errmsg && error.errmsg.indexOf('rCode') > 0) {
      logger.error('There was an Uniqueness(rCode) error occured in daos/AdminuRolesDaos.js, at postAdminUsrRlsCreate:' + error);
      const cue = SetRes.createFailed('Role Code already exists');
      callback(cue);
    } else {
      logger.error('Unknown Error in daos/AdminuRolesDaos.js, at postAdminUsrRlsCreate:' + error);
      const uke = SetRes.unKnownErr({});
      callback(uke);
    }
  })
}

const getAdminUsrRlsView = (query, callback) => {
  adminUsrRoles.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const res = SetRes.successRes(resObj);
      callback(res);
    } else {
      const emp = SetRes.noData();
      callback(emp);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/AdminuRolesDaos.js, at getAdminUsrRlsView:' + error);
    const uke = SetRes.unKnownErr({});
    callback(uke);
  })
}

const postb2bUsrRlsUpdate = (query, updateObj, callback) => {
  adminUsrRoles.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const res = SetRes.successRes(resObj);
      callback(res);
    } else {
      const cf = SetRes.updateFailed('Update failed');
      callback(cf);
    }
  }).catch((error) => {
    if (error.errmsg && error.errmsg.indexOf('rName') > 0) {
      logger.error('There was an Uniqueness(rName) error occured in daos/AdminuRolesDaos.js, at postb2bUsrRlsUpdate:' + error);
      const nue = SetRes.updateFailed('Role Name already exists');
      callback(nue);
    } else if (error.errmsg && error.errmsg.indexOf('rCode') > 0) {
      logger.error('There was an Uniqueness(rCode) error occured in daos/AdminuRolesDaos.js, at postb2bUsrRlsUpdate:' + error);
      const cue = SetRes.updateFailed('Role Code already exists');
      callback(cue);
    } else {
      logger.error('Unknown Error in daos/AdminuRolesDaos.js, at postb2bUsrRlsUpdate:' + error);
      const uke = SetRes.unKnownErr({});
      callback(uke);
    }
  })
}

const adminUsrRlsDelete = (query, callback) => {
  adminUsrRoles.deleteOne(query).then((resObj) => {
    if (resObj && resObj.deletedCount > 0) {
      const res = SetRes.successRes(resObj);
      callback(res);
    } else {
      const emp = SetRes.deleteFailed();
      callback(emp);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/AdminUserRolesAccessDao.js, at adminUsrRlsDelete:' + error);
    const uke = SetRes.unKnownErr({});
    callback(uke);
  })
}

module.exports = {
  adminUsrRlsList, postAdminUsrRlsCreate, getAdminUsrRlsView, postb2bUsrRlsUpdate, adminUsrRlsDelete
};

const urRlsGetTotalCount = (query, resObj, callback) => {
  let resultObj = { rolesCount: resObj.length, rolesList: resObj };
  adminUsrRoles.countDocuments(query).then((resultCount) => {
    if (resultCount) {
      resultObj = { rolesCount: resultCount, rolesList: resObj };
      const result = SetRes.successRes(resultObj);
      callback(result);
    } else {
      const result = SetRes.successRes(resultObj);
      callback(result);
    }
  }).catch((errCount) => {
    logger.error('Unknown Error in daos/AdminuRolesDaos.js, at urRlsGetTotalCount(countDocuments):' + errCount);
    const result = SetRes.successRes(resultObj);
    callback(result);
  });
}