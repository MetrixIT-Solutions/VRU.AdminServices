/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const AdminEntis = require('../schemas/AdminEntities');

const postAdminEntiCreate = (creatData, callback) => {
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
      const msg = err?.message && (err.message.includes('eName') ? 'Entity Name Already Exist' : (err.message.includes('eCode') ? 'Entity Code Already Exist' : 'Unknown Error')) || 'Unknown Error';
      logger.error('Uniqueness Error in daos/AdminEntisDao.js, at postAdminEntiCreate:' + err);
      const errRes = SetRes.uniqueness(msg);
      callback(errRes);
    } else {
      logger.error('Un-konwn Error in daos/AdminEntisDao.js, at postAdminEntiCreate:' + err);
      const errRes2 = SetRes.unKnownErr({});
      callback(errRes2);
    }
  });
}

const postAdminEntisList = (query, actPgNum, rLimit, callback) => {
  let resultObj = { entiListCount: 0, entisList: [] };
  AdminEntis.find(query).skip((actPgNum - 1) * rLimit).limit(rLimit).sort({ cDtStr: -1 }).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { entiListCount: resObj.length, entisList: resObj };
      AdminEntis.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { entiListCount: resultCount, entisList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in daos/AdminEntisDao.js, at postAdminEntisList:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      });
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/AdminEntisDao.js, at postAdminEntisList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const getAdminEntisListByOrg = (query, sortObj, callback) => {
  AdminEntis.find(query).sort(sortObj).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/AdminEntisDao.js, at postAdminEntisList:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}

const postAdminEntisView = (query, callback) => {
  AdminEntis.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/AdminEntisDao.js, at postAdminEntisView:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const postAdminEntiUpdate = (query, updateObj, callback) => {
  AdminEntis.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.updateFailed({});
      callback(noData);
    }
  }).catch((err) => {
    if (err.code == '11000') {
      const msg = err?.message && (err.message.includes('eName') ? 'Entity Name Already Exist' : (err.message.includes('eCode') ? 'Entity Code Already Exist' : 'Unknown Error')) || 'Unknown Error';
      logger.error('Uniqueness Error in daos/AdminEntisDao.js, at postAdminEntiUpdate:' + err);
      const errRes = SetRes.uniqueness(msg);
      callback(errRes);
    } else {
      logger.error('Un-konwn Error in daos/AdminEntisDao.js, at postAdminEntiUpdate:' + err);
      const errRes = SetRes.unKnownErr({});
      callback(errRes);
    }
  })
}

const postAdminEntiCountUpdate = (query, updateObj, callback) => {
  AdminEntis.findOneAndUpdate(query, updateObj, {set: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.updateFailed({});
      callback(noData);
    }
  }).catch((err) => {
    if (err.code == '11000') {
      const msg = err?.message && (err.message.includes('eName') ? 'Entity Name Already Exist' : (err.message.includes('eCode') ? 'Entity Code Already Exist' : 'Unknown Error')) || 'Unknown Error';
      logger.error('Uniqueness Error in daos/AdminEntisDao.js, at postAdminEntiUpdate:' + err);
      const errRes = SetRes.uniqueness(msg);
      callback(errRes);
    } else {
      logger.error('Un-konwn Error in daos/AdminEntisDao.js, at postAdminEntiUpdate:' + err);
      const errRes = SetRes.unKnownErr({});
      callback(errRes);
    }
  })
}

const getAdminEntiTotalList = (query, callback) => {
  AdminEntis.find(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/AdminEntisDao.js, at getAdminEntiTotalList:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  })
}

module.exports = {
  postAdminEntiCreate, postAdminEntisList, getAdminEntisListByOrg, postAdminEntisView, postAdminEntiUpdate,
  postAdminEntiCountUpdate, getAdminEntiTotalList
};
