/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const async = require('async');

const AdminUsers = require('../schemas/AdminUsers');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const getAdminUserData = (query, callback) => {
  AdminUsers.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/AdminUsersDao.js, at getAdminUserData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const updateAdminUserData = (query, updateObj, callback) => {
  AdminUsers.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.updateFailed({});
      callback(noData);
    }
  }).catch((error) => {
    if (error.errmsg && error.errmsg.indexOf('refUID_1') > 0) {
      logger.error('There was an Uniqueness(refID) error occured in daos/AdminusersDAO.js, at updateAdminUserData:' + error);
      const uniqueMsg = "User ID  already exists";
      const uM = SetRes.uniqueness(uniqueMsg);
      callback(uM);
    } else if(error.errmsg && error.errmsg.indexOf('myPrimary_1') > 0) {
      logger.error('There was an Uniqueness(Email) error occured in daos/AdminusersDAO.js, at updateAdminUserData:' + error);
      const uniqueMsg = "Email already exists";
      const uM = SetRes.uniqueness(uniqueMsg);
      callback(uM);
    } else {
      logger.error('Un-konwn Error in daos/AdminUsersDao.js, at updateAdminUserData:' + error);
      const err = SetRes.unKnownErr({});
      callback(err);
    }
  })
}

const getAdminUsersList = (crntPgNum, rLimit, obj, callback) => {
  let resultObj = { adUsrsTotalCount: 0, admnUsersListCount: 0, admnUsersList: [] };
  async.parallel([
    (cb) => {
      getAdUsrsList(crntPgNum, rLimit, obj, resObj1 => cb(null, resObj1));
    },
    (cb) => {
      getAdUsrsListCount(obj.query, resObj2 => cb(null, resObj2));
    },
    (cb) => {
      getAdUsrsListCount(obj.opQuery, resObj3 => cb(null, resObj3));
    }
  ], (err, result) => {
    if (err) {
      logger.error('There was an Error in daos/CustsBookingsDao.js at postCustTableDshbrdCount:' + err);
    }
    resultObj.adUsrsTotalCount = result[2] || 0;
    if (result[0] && result[0].length > 0) {
      resultObj.admnUsersList = result[0];
      resultObj.admnUsersListCount = result[1] ? result[1] : result[0].length;
      const resFinalObj = SetRes.successRes(resultObj);
      callback(resFinalObj);
    } else {
      const resFinalObj = SetRes.noData(resultObj);
      callback(resFinalObj);
    }
  });
}

const createUser = (createUserData, callback) => {
  createUserData.save().then((uResObj) => {
    const result = SetRes.successRes(uResObj);
    callback(result);
  }).catch((error) => {
    if (error.errmsg && error.errmsg.indexOf('refUID_1') > 0) {
      logger.error('There was an Uniqueness(refID) error occured in daos/AdminusersDAO.js, at createUser:' + error);
      const uniqueMsg = "user ID  already exists";
      const uM = SetRes.uniqueness(uniqueMsg);
      callback(uM);
    } else if(error.errmsg && error.errmsg.indexOf('myPrimary_1') > 0){
      logger.error('There was an Uniqueness(mobileNum) error occured in daos/AdminusersDAO.js, at createUser:' + error);
      const uniqueMsg = createUserData?.mpType == 'Email' ? 'Email already exists' : 'Mobile Number already exists';
      const uM = SetRes.uniqueness(uniqueMsg);
      callback(uM);
    } else {
      logger.error('There was an Un-konwn Error occured in daos/AdminusersDAO.js, at createUser:' + error);
      const err = SetRes.unKnownErr({});
      callback(err);
    }
    
  });
};

const getAdminUsersAgentList = (query, callback) => {
  AdminUsers.find(query).then((resObj) => {
    if (resObj) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/AdminUsersDao.js, at getAdminUsersAgentList:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const getAdminUsrsTotalList = (obj, callback) => {
  AdminUsers.find(obj.query, obj.project).sort({cDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/AdminUsersDao.js, at getAdminUsrsTotalList:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  })
}

const updateMultipleAdminUsersData = (query, updateObj, callback) => {
  AdminUsers.updateMany(query, updateObj, { new: true }).then((resObj) => {
    if (resObj.modifiedCount > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/AdminUsersDao.js, at getAdminUsersAgentList:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const getAdminUsrsCounts = (query, callback) => {
  AdminUsers.countDocuments(query).then((resObj) => {
    if (resObj) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData(0);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/AdminUsersDao.js, at getAdminUsrsCounts:' + error);
    const err = SetRes.unKnownErr(0);
    callback(err);
  })
}

module.exports = {
  getAdminUserData, updateAdminUserData, getAdminUsersList, createUser, getAdminUsersAgentList, getAdminUsrsTotalList,
  updateMultipleAdminUsersData, getAdminUsrsCounts
};

const getAdUsrsList = (crntPgNum, rLimit, obj, callback) => {
  AdminUsers.find(obj.query).sort(obj.sort).skip((crntPgNum - 1) * rLimit).limit(rLimit).then((resObj) => {
    if (resObj && resObj.length > 0)
      callback(resObj);
    else
      callback([]);
  }).catch((error) => {
    logger.error('Unknown Error in daos/AdminusersDAO.js, at getAdUsrsList:' + error);
    callback([]);
  });
}

const getAdUsrsListCount = (query, callback) => {
  AdminUsers.countDocuments(query).then((resultCount) => {
    if (resultCount)
      callback(resultCount);
    else 
      callback(0);
  }).catch((errorCount) => {
    logger.error('Unknown Error in daos/AdminusersDAO.js, at getAdUsrsListCount(countDocuments):' + errorCount);
    callback(0);
  });
}
