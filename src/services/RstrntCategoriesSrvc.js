/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const RstrntCategoriesDaoImpl = require('../daosimplements/RstrntCategoriesDaoImpl');
const RstrntCategoriesDao = require('../daos/RstrntCategoriesDao');
const RestaurantCategories = require('../schemas/RestaurantCategories');

const SetRes = require('../SetRes');

const postRstrntCategoryCreate = (reqBody, tData, callback) => {
  if(tData.ut !== 'VRU' || (tData.ut === 'VRU' && reqBody.orgId && reqBody.oCode && reqBody.oName)) {
    const obj =  RstrntCategoriesDaoImpl.categoryCreate(reqBody, tData);
    const createObj  = new RestaurantCategories(obj);
    RstrntCategoriesDao.commonCreateFunc(createObj, callback)
  } else {
    const rf = SetRes.msdReqFields();
    callback(rf);
  }
}

const getRstrntCategoriesList = (reqParams, reqBody, tData, callback) => {
  const query =  RstrntCategoriesDaoImpl.getCategoriesList(reqParams, reqBody, tData);
  RstrntCategoriesDao.getCategoriesList(query, callback)
}
module.exports = {
  postRstrntCategoryCreate, getRstrntCategoriesList
};
