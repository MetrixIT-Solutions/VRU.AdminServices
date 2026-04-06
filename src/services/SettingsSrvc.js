/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */
var { v4: uuidv4 } = require('uuid');

const SettingsDaoImpl = require('../daosimplements/SettingsDaoImpl');
const SettingsDao = require('../daos/SettingsDao');
const RestaurantInfos = require('../schemas/RestaurantInfos');
const RestaurantPricings = require('../schemas/RestaurantPricings');
const RestaurantInfosClsd = require('../schemas/RestaurantInfosClsd');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');


const bbqhRestrntPricingClsdCreate = () => {
  const query = SettingsDaoImpl.bbqhRestrntPricingQuery();
  SettingsDao.getSpclDayPricingsList(query, (resObj) => {
    if (resObj.status == '200') {
      const data = resObj.resData.result.map(item => item._id);
      const deleteQuery = SettingsDaoImpl.deleteQueryForSpclDayPricing(data);
      SettingsDao.deleteSpclDayPricingsData(deleteQuery, (resObj1) => {
        resObj1.status == '200' && restrntPricingClsdCreate(0, resObj.resData.result, (resObj2) => { });
      })
    }
  })
}

const postBbqhRestuarantView = (reqBody, tData, callback) => {
  if (tData.ut == 'Branch') {
    const qry = SettingsDaoImpl.bbqhRstnQry(tData.bid, reqBody, tData);
    getResPricingData(qry, tData, callback)
  } else if (tData.ut == 'Board' && (tData.ur == 'Admin' || tData.ur == 'Director')) {
    const qry = SettingsDaoImpl.bbqhRstnQry(reqBody.id, reqBody, tData);
    getResPricingData(qry, tData, callback)
  } else if (reqBody.id) {
    const qry = SettingsDaoImpl.bbqhRstnQry(reqBody.id, reqBody, tData);
    getResPricingData(qry, tData, callback)
  } else {
    const qry1 = SettingsDaoImpl.bbqhRstnQry('', reqBody, tData);
    SettingsDao.getBbqhRestuarantView(qry1, resObj => {
      callback(resObj);
    });
  }
}

const postBbqhRestuarantUpdate = (reqBody, tData, callback) => {
  const updObj = SettingsDaoImpl.setResturantObj(reqBody, tData);
  if (tData.ut == 'Branch') {
    const qry = SettingsDaoImpl.bbqhRstnQry(tData.bid, reqBody, tData);
    SettingsDao.updateRestuarantInfo(qry, updObj, callback);
  } else if ((tData.ut == 'Board' && (tData.ur == 'Admin' || tData.ur == 'Director')) || (tData.ut == 'VRU')) {
    const qry = SettingsDaoImpl.bbqhRstnQry(reqBody.id, reqBody, tData);
    SettingsDao.updateRestuarantInfo(qry, updObj, callback);
  } else {
    const rs = SetRes.successRes({});
    callback(rs);
  }
}

const postBbqhRestuarantPricingCreate = (reqBody, tData, callback) => {
  if (tData.ut !== 'VRU' || (tData.ut === 'VRU' && reqBody.orgId && reqBody.oCode && reqBody.oName)) {
    const obj = SettingsDaoImpl.createPricing(reqBody, tData);
    const createObj = new RestaurantInfos(obj);
    SettingsDao.commonCreateFunc(createObj, callback);
  } else {
    const ms = SetRes.msdReqFields();
    callback(ms);
  }
}

const postBbqhRstrntSpclDaysPricingsList = (reqBody, tData, callback) => {
  const obj = SettingsDaoImpl.postSpclDayPricingsListQuery(reqBody, tData);
  SettingsDao.postBbqhRstrntSpclDaysPricingsList(obj, reqBody.actPgNum, reqBody.rLimit, callback);
}

const postBbqhRstrntSpclDayPricingView = (reqBody, tData, callback) => {
  const query = SettingsDaoImpl.postSpclDayPricingViewQuery(reqBody, tData);
  SettingsDao.getBbqhRestuarantView(query, callback);
}

const postBbqhRstrntSpclDayPricingDelete = (reqBody, callback) => {
  const deleteQuery = SettingsDaoImpl.deleteQueryForSpclDayPricing([reqBody.id]);
  SettingsDao.deleteSpclDayPricingsData(deleteQuery, callback);
}

const postBbqhRestPricingCreate = (reqBody, tData, callback) => {
  if (tData.ut !== 'VRU' || (tData.ut === 'VRU' && reqBody.orgId && reqBody.oCode && reqBody.oName)) {
    pricingCreateFunc(0, reqBody, [], tData, callback);
  } else {
    const ms = SetRes.msdReqFields();
    callback(ms);
  }
}

const postBbqhRestPricingView = (reqBody, tData, callback) => {
  const obj = SettingsDaoImpl.postBbqhRestPricingView(reqBody);
  SettingsDao.postBbqhRestPricingView(obj, callback);
}

const postBbqhRestuarantPricingDataUpdate = (reqBody, tData, callback) => {
  pricingUpdateFunc(0, reqBody, [], tData, callback);
}

const postBbqhRestuarantPricingBranchList = (reqBody, tData, callback) => {
  const obj = SettingsDaoImpl.getResPricingData(reqBody);
  SettingsDao.getResPricingData(obj, callback);
}

module.exports = {
  bbqhRestrntPricingClsdCreate, postBbqhRestuarantView, postBbqhRestuarantUpdate, postBbqhRestuarantPricingCreate,
  postBbqhRstrntSpclDaysPricingsList, postBbqhRstrntSpclDayPricingView, postBbqhRstrntSpclDayPricingDelete,
  postBbqhRestPricingCreate, postBbqhRestPricingView, postBbqhRestuarantPricingDataUpdate, postBbqhRestuarantPricingBranchList
};

const getResPricingData = (qry, tData, callback) => {
  SettingsDao.getBbqhRestuarantView(qry, resObj => {
    if (resObj.status == '200') {
      callback(resObj);
    } else if (resObj.status == '204') {
      const qry1 = SettingsDaoImpl.bbqhRstnQry('', {}, tData);
      SettingsDao.getBbqhRestuarantView(qry1, resObj => {
        callback(resObj);
      });
    } else {
      callback(resObj);
    }
  });
}

const restrntPricingClsdCreate = (i, resData, callback) => {
  if (i < resData.length) {
    const data = resData[i];
    const obj = SettingsDaoImpl.createPricingClsd(data);
    const createObj = new RestaurantInfosClsd(obj);
    SettingsDao.commonCreateFunc(createObj, (resObj) => {
      restrntPricingClsdCreate(i + 1, resData, callback);
    });
  } else {
    callback('success')
  }
}

const pricingCreateFunc = (i, data, arr, tData, callback) => {
  const pricing = data.dayPrices;
  if (i < pricing.length) {
    const priceData = pricing[i];
    const rstPriObj = SettingsDaoImpl.setResturantPriceObj(data, tData, priceData);
    const setPriceObj = new RestaurantPricings(rstPriObj);
    SettingsDao.commonCreateFunc(setPriceObj, (resObj) => {
      const sucessData = resObj.resData.result;
      if (resObj.status == '200') {
        arr.push(sucessData);
        pricingCreateFunc(i + 1, data, arr, tData, callback);
      } else {
        logger.error('Unknown Error in pricingCreateFunc/SettingsSrvc.js, at pricingCreateFunc:' + resObj.resData.message);
        pricingCreateFunc(i + 1, data, arr, tData, callback);
      }
    });
  } else {
    const res = SetRes.successRes(arr)
    callback(res);
  }
}

const pricingUpdateFunc = (i, data, arr, tData, callback) => {
  const updatePricing = data.pricing;
  if (i < updatePricing.length) {
    const pricingData = updatePricing[i];
    const findObj = SettingsDaoImpl.updatePricingData(pricingData, tData);
    SettingsDao.updatePricingData(findObj.query, findObj.updateObj, (resObj) => {
      const sucessData = resObj.resData.result;
      if (resObj.status == '200') {
        arr.push(sucessData);
        pricingUpdateFunc(i + 1, data, arr, tData, callback);
      } else {
        logger.error('Unknown Error in pricingUpdateFunc/SettingsSrvc.js, at pricingUpdateFunc:' + resObj.resData.message);
        pricingUpdateFunc(i + 1, data, arr, tData, callback);
      }
    })
  } else {
    const res = SetRes.successRes(arr)
    callback(res);
  }
}