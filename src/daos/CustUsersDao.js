/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsUsers = require('../schemas/CustsUsers');

const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const getCustUsersList = (query, reqBody, callback) => {
  let resultObj = { usersListCount: 0, usersList: [] };
  CustsUsers.find(query).skip((reqBody.actPgNum - 1) * reqBody.rLimit).limit(reqBody.rLimit).sort({cDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { usersListCount: resObj.length, usersList: resObj };
      CustsUsers.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { usersListCount: resultCount, usersList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in daos/CustUsersDao.js, at getCustUsersList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      })
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustUsersDao.js, at getCustUsersList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const postCustuserView = (query, callback) => {
  CustsUsers.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const resMsg = SetRes.successRes(resObj);
      callback(resMsg);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((err) => {
    logger.error('Unknown Error in daos/CustUsersDao.js, at postCustuserView:' + err);
    const errMsg = SetRes.unKnownErr({});
    callback(errMsg);
  });
}

const postCustuserUpdate = (query, updateObj, callback) => {
  CustsUsers.findOneAndUpdate(query, updateObj, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustUsersDao.js, at postCustuserUpdate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

module.exports = {
  getCustUsersList, postCustuserView, postCustuserUpdate
}