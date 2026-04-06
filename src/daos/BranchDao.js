/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const AdminBranches = require('../schemas/AdminBranches');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const getBrnchList = (query, reqBody, callback) => {
  let resultObj = { branchListCount: 0, branchList: [] };
  AdminBranches.find(query).skip((reqBody.actPgNum - 1) * reqBody.rLimit).limit(reqBody.rLimit).sort({cDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { branchListCount: resObj.length, branchList: resObj };
      AdminBranches.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { branchListCount: resultCount, branchList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in service/BranchDao.js, at getBrnchList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      });
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/BranchDao.js, at getBrnchList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const createData = (data, callback) => {
  data.save().then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.createFailed({});
      callback(uf);
    }
  }).catch((error) => {
    if (error.keyPattern && error.keyPattern.bName || error.keyPattern && error.keyPattern.bCode) {
      const uniq = error.keyPattern.bName ? 'Branch Name' : 'Branch Code';
      logger.error('Uniqueness Error in daos/BranchDao.js, at createData:' + error);
      const err = SetRes.uniqueness(uniq + ' Already Exists');
      callback(err);
    } else {
      logger.error('Un-konwn Error in daos/BranchDao.js, at createData:' + error);
      const err = SetRes.unKnownErr();
      callback(err);
    }
  });
}

const branchUpdate = (query, updateObj, callback) => {
  AdminBranches.findOneAndUpdate(query, {$set: updateObj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/BranchDao.js, at branchUpdate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}


const getAllBrnchList = (query, callback) => {
  AdminBranches.find(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const nf = SetRes.noData({});
      callback(nf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/BranchDao.js, at getAllBrnchList:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const getAdminBranchTotalList = (query, callback) => {
  AdminBranches.find(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/BranchDao.js, at getAdminBranchTotalList:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  })
}

const getAdminBranchList = (query, callback) => {
  AdminBranches.findOne(query).then((resObj) => {
    if (resObj) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/BranchDao.js, at getAdminBranchList:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  })
}

module.exports = {
  getBrnchList, createData, branchUpdate, getAllBrnchList, getAdminBranchTotalList, getAdminBranchList
};
