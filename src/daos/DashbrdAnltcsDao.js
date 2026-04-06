/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Dec 2025
 */

const DashbrdAnltcs = require('../schemas/DashbrdAnltcs');
const DashbrdAnltcsClsd = require('../schemas/DashbrdAnltcsClsd');
const DashbrdMnthAnltcs = require('../schemas/DashbrdMnthAnltcs');
const DashbrdYrAnltcs = require('../schemas/DashbrdYrAnltcs');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const commonUpdateFunc = (model, query, updateObj, options, callback) => {
  model.findOneAndUpdate(query, updateObj, options).then((resObj) => {
    if (resObj && resObj._id) {
      callback(SetRes.successRes(resObj));
    } else {
      callback(SetRes.noData({}));
    }
  }).catch((error) => {
    logger.error(`Unknown Error in daos/DashbrdAnltcsDao.js, at commonUpdateFunc(${model.modelName}):` + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
};

const updateDashbrdAnltcs = (query, updateObj, options, callback) => {
  commonUpdateFunc(DashbrdAnltcs, query, updateObj, options, callback);
};

const updateDashbrdAnltcsClsd = (query, updateObj, options, callback) => {
  commonUpdateFunc(DashbrdAnltcsClsd, query, updateObj, options, callback);
};

const updateDashbrdMnthAnltcs = (query, updateObj, options, callback) => {
  commonUpdateFunc(DashbrdMnthAnltcs, query, updateObj, options, callback);
};

const updateDashbrdYrAnltcs = (query, updateObj, options, callback) => {
  commonUpdateFunc(DashbrdYrAnltcs, query, updateObj, options, callback);
};

const getDashbrdAnltcsList = (query, callback) => {
  DashbrdAnltcs.find(query).sort({ rDtStr: -1 }).then((resObj) => {
    if (resObj && resObj.length) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const result = SetRes.noData({});
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/DashbrdAnltcsDao.js, at getDashbrdAnltcsView:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getDashbrdMnthAnltcsList = (query, callback) => {
  DashbrdMnthAnltcs.aggregate(query).sort({ rDtStr: -1 }).then((resObj) => {
    if (resObj && resObj.length) callback(SetRes.successRes(resObj));
    else callback(SetRes.noData({}));
  }).catch((error) => {
    logger.error('Un-known Error in daos/DashbrdAnltcsDao.js, at getDashbrdMnthAnltcsList:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getDashbrdYrAnltcsList = (query, callback) => {
  DashbrdYrAnltcs.aggregate(query).sort({ rDtStr: -1 }).then((resObj) => {
    if (resObj && resObj.length) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const result = SetRes.noData({});
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/DashbrdAnltcsDao.js, at getDashbrdYrAnltcsList:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getDashbrdAnltcsView = (query, callback) => {
  DashbrdAnltcs.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const result = SetRes.noData({});
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/DashbrdAnltcsDao.js, at getDashbrdAnltcsView:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
};

const getDashbrdMnthlyAnltcsView = (query, callback) => {
  DashbrdMnthAnltcs.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const result = SetRes.noData({});
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/DashbrdAnltcsDao.js, at getDashbrdAnltcsView:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const getDashbrdYrlyAnltcsView = (query, callback) => {
  DashbrdYrAnltcs.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const result = SetRes.noData({});
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/DashbrdAnltcsDao.js, at getDashbrdAnltcsView:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

module.exports = {
  updateDashbrdAnltcs, updateDashbrdAnltcsClsd, updateDashbrdMnthAnltcs, updateDashbrdYrAnltcs, getDashbrdAnltcsList,
  getDashbrdMnthAnltcsList, getDashbrdYrAnltcsList, getDashbrdAnltcsView, getDashbrdMnthlyAnltcsView, getDashbrdYrlyAnltcsView
};