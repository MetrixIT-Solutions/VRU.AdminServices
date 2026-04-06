/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');
var { v4: uuidv4 } = require('uuid');

const CommonSrvc = require('../services/CommonSrvc');

const createMenuData = (reqData, itemData, fileData, tData) => {
  const menuData = setCreateData(reqData, itemData, fileData, tData);
  return menuData;
}

const menuList = (reqBody, tData) => {
  const searchStr = reqBody.searchStr || '';
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.orgId ? { orgId: reqBody.orgId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : reqBody.entityId ? { entId: reqBody.entityId } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : reqBody.branchId ? { branch: reqBody.branchId } : {};
  return {
    ...orgObj, ...entObj, ...branchObj, delFlag: false, $or: [
      { 'category': { $regex: searchStr, $options: 'i' } },
      { 'subCategory': { $regex: searchStr, $options: 'i' } },
      { 'eName': { $regex: searchStr, $options: 'i' } },
      { 'itemName': { $regex: searchStr, $options: 'i' } },
    ]
  };
}

const menuStatusUpdate = (reqBody, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : {};
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};
  const query = { delFlag: false, _id: reqBody.id, ...orgObj, ...entObj, ...branchObj }
  const updateObj = {
    itemStatus: reqBody.status,
    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }
  return { query, updateObj };
}

const menuItemDelete = (_id) => {
  return { delFlag: false, _id }
}

const itemUpdate = (reqBody, fileData, iPath, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const query = { delFlag: false, _id: reqBody.id };
  const updateObj = {
    day: reqBody.day,
    itemName: reqBody.itemName,
    halfPlatePrice: reqBody.halfPlatePrice,
    fullPlatePrice: reqBody.fullPlatePrice,
    icon: fileData.filename ? fileData.filename : reqBody.icon,
    iActualName: fileData.filename ? fileData.originalname : reqBody.iActualName,
    iPath: fileData.filename ? iPath : reqBody.iPath,
    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }
  return { query, updateObj };
}

module.exports = {
  createMenuData, menuList, menuStatusUpdate, menuItemDelete, itemUpdate
}

const setCreateData = (reqData, itemData, fileData, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const orgId = tData.ut === 'VRU' ? reqData.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? reqData.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? reqData.oName : tData.on;
  return {
    _id: uuidv4(),
    orgId, oCode, oName,
    entId: reqData.entId,
    eCode: reqData.eCode,
    eName: reqData.eName,
    branch: reqData.branch,
    bCode: reqData.bCode,
    rType: reqData.rType,

    day: itemData.day,
    category: reqData.category,
    subCategory: reqData.subCategory,
    itemName: itemData.itemName,
    itemDesc: itemData.itemDesc || '',
    itemStatus: itemData.status || 'Active',
    halfPlatePrice: itemData.halfPlatePrice || 0,
    fullPlatePrice: itemData.fullPlatePrice || 0,
    generalPrice: itemData.generalPrice || 0,

    icon: itemData.fileName ? fileData.filename : '',
    iActualName: itemData.fileName ? fileData.originalname : '',
    iPath: itemData.fileName ? fileData.path : '',

    cuType: tData.ut,
    cUser: tData.iss,
    cuName: tData.un,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }
}
