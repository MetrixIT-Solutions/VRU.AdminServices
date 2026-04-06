/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const AdminBranches = require('../schemas/AdminBranches');
const CustsOffers = require('../schemas/CustsOffers');
const RestaurantInfos = require('../schemas/RestaurantInfos');
const CustsUsersInfos = require('../schemas/CustsUsersInfos');
const CustsUsers = require('../schemas/CustsUsers');
const CustsTableBlckdDts = require('../schemas/CustsTableBlckdDts');
const RestaurantPricings = require('../schemas/RestaurantPricings');

const getCustsBranchesList = (query, callback) => {
  AdminBranches.find(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const data = SetRes.successRes(resObj);
      callback(data);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((err) => {
    logger.error('Unknown Error in daos/CustsWebDaos.js, at getCustsBranchesList:' + err);
    const error = SetRes.unKnownErr([]);
    callback(error);
  });
}

const getCustsBranchData = (query, callback) => {
  AdminBranches.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsWebDaos.js, at getCustsBranchData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

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
    logger.error('Unknown Error in daos/CustsWebDaos.js, at commonCreateFunc:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
};

const getCustsOffersList = (query, callback) => {
  CustsOffers.find(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const resData = SetRes.successRes(resObj);
      callback(resData);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/CustsWebDaos.js, at getCustsOffersList:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  })
};


const updateUserInfoBkngsCount = (query, updateObj, callback) => {
  CustsUsersInfos.findOneAndUpdate(query, { $inc: updateObj }, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const resMsg = SetRes.successRes(resObj);
      callback(resMsg);
    } else {
      const noData = SetRes.updateFailed({});
      callback(noData);
    }
  }).catch((err) => {
    logger.error('Unknown Error in daos/CustsWebDaos.js, at updateUserInfoBkngsCount:' + err);
    const errMsg = SetRes.unKnownErr({});
    callback(errMsg);
  })
};

const getCustsTableBlckDates = (query, callback) => {
  CustsTableBlckdDts.find(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const resData = SetRes.successRes(resObj);
      callback(resData);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/CustsWebDaos.js, at getCustsTableBlckDates:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  })
};

const getCustUserData = (query, callback) => {
  CustsUsers.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsWebDaos.js, at getCustUserData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const updateCustUserData = (query, updateObj, callback) => {
  CustsUsers.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.updateFailed({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsWebDaos.js, at updateCustUserData:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
};

const getRestaurantInformation = (query, callback) => {
  RestaurantPricings.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const resData = SetRes.successRes(resObj);
      callback(resData);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/CustsWebDaos.js, at getRestaurantInformation:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
};
const getSpclDaysPrcngsList = (query, callback) => {
  RestaurantInfos.find(query).then((resObj) => {
    if (resObj && resObj.length) {
      const resData = SetRes.successRes(resObj);
      callback(resData);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Unknown Error in daos/CustsWebDaos.js, at getSpclDaysPrcngsList:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
};

module.exports = {
  getCustsBranchesList, getCustsBranchData, commonCreateFunc, getCustsOffersList, updateUserInfoBkngsCount,
  getCustsTableBlckDates, getCustUserData, updateCustUserData, getRestaurantInformation, getSpclDaysPrcngsList
};
