/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const AdminOrgs = require('../schemas/AdminOrgs')

const postAdminOrgCreate = (creatData, callback) => {
  creatData.save().then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.createFailed({});
      callback(uf);
    }
  }).catch((error) => {
    if (error.code == '11000') {
      const msg = error.keyPattern && error.keyPattern.oName ? 'Organization Name ' : 'Organization Code '
      logger.error('Uniqueness Error in daos/AdminOrgsDao.js, at postAdminOrgCreate:' + error);
      const err = SetRes.uniqueness(msg + 'Already Exists');
      callback(err);
    } else {
      logger.error('Un-konwn Error in daos/AdminOrgsDao.js, at postAdminOrgCreate:' + error);
      const err = SetRes.unKnownErr();
      callback(err);
    }
  });
}

const getAdminOrgsList = (query, actPgNum, rLimit, callback) => {
  let resultObj = { orgsListCount: 0, orgsList: [] };
  AdminOrgs.find(query).skip((actPgNum - 1) * rLimit).limit(rLimit).sort({ cDtStr: -1 }).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { orgsListCount: resObj.length, orgsList: resObj };
      AdminOrgs.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { orgsListCount: resultCount, orgsList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in daos/AdminOrgsDao.js, at getAdminOrgsList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      })
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/AdminOrgsDao.js, at getAdminOrgsList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const postAdminOrgView = (query, callback) => {
  AdminOrgs.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/AdminOrgsDao.js, at postAdminOrgView:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const postAdminOrgUpdate = (query, updateObj, callback) => {
  AdminOrgs.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.updateFailed({});
      callback(noData);
    }
  }).catch((error) => {
    if (error.code == '11000') {
      const msg = error.keyPattern && error.keyPattern.oName ? 'Organization Name ' : 'Organization Code '
      logger.error('Uniqueness Error in daos/AdminOrgsDao.js, at postAdminOrgUpdate:' + error);
      const err = SetRes.uniqueness(msg + 'Already Exists');
      callback(err);
    } else {
      logger.error('Un-konwn Error in daos/AdminOrgsDao.js, at postAdminOrgUpdate:' + error);
      const err = SetRes.unKnownErr();
      callback(err);
    }
  });
}

const getAdminOrgsTotalList = (query, callback) => {
  AdminOrgs.find(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/AdminOrgsDao.js, at getAdminOrgsTotalList:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}

module.exports = {
  postAdminOrgCreate, getAdminOrgsList, postAdminOrgView, postAdminOrgUpdate, getAdminOrgsTotalList
};
