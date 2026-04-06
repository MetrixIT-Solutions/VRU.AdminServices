/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');

const CommonSrvc = require('../services/CommonSrvc');

const categoryCreate = (reqbody, tData) => {
  const categoryData = setCategoryData(reqbody, tData);
  return categoryData;
}

const getCategoriesList = (reqParams, reqBody, tData) => {
  const mType = reqParams.type ? reqParams.type.replaceAll('%20', '') : ''
  const type = mType ? {type: mType} : {};
  const categoryValue = reqParams.category ? reqParams.category.replaceAll('%20', '') : '';
  const category = categoryValue ? {category: categoryValue} : {}
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entId ? { entId: reqBody.entId } : {});
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch ? { branch: reqBody.branch } : {});

  return {
    ...orgObj, ...entObj, ...branchObj,
    ...type,
    ...category,
    delFlag: false,
  };
}

module.exports = {
  categoryCreate, getCategoriesList
}

const setCategoryData = (reqBody, tData) => {
  const curUtc = CommonSrvc.currUTCObj();
  const orgId = tData.ut === 'VRU' ? reqBody.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? reqBody.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? reqBody.oName : tData.on;
  return {
    _id: uuidv4(),
    orgId, oCode, oName,

    entId: reqBody.entId,
    eName: reqBody.eName,
    eCode: reqBody.eCode,
    branch: reqBody.branch || '',
    bCode: reqBody.bCode || '',

    type: reqBody.type,
    category: reqBody.category,
    subCategory: reqBody.subCategory || '',

    icon: '',
    iActualName: '',
    iPath: '',

    cuType: tData.ut,
    cUser: tData.iss,
    cuName: tData.un,
    cDtTm: curUtc.currUTCDtTm,
    cDtStr: curUtc.currUTCDtTmStr,
    cDtNum: curUtc.currUTCDtTmNum,
    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
    uDtNum: curUtc.currUTCDtTmNum
  };
}
