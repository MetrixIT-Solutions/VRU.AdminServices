/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');

const CommonSrvc = require('../services/CommonSrvc');
const e = require('cors');

const createSmsSettings = (reqData, tData) => {
  const data = setTempData(reqData, tData);
  return data;
}
const getRstrntSmsSettingsList = (reqBody, tData) => {
  const searchStr = reqBody.searchStr || '';
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.orgId ? { orgId: reqBody.orgId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entId ? { entId: reqBody.entId } : {});
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch ? { branch: reqBody.branch } : {});
  return {
    ...orgObj, ...entObj, ...branchObj, delFlag: false, $or: [
      { 'smsAuthKey': { $regex: searchStr, $options: 'i' } },
      { 'smsApi': { $regex: searchStr, $options: 'i' } },
      { 'tempType': { $regex: searchStr, $options: 'i' } },
      { 'tempId': { $regex: searchStr, $options: 'i' } }
    ]
  };
}

const rstrntSmsSettingsUpdate = (reqData, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqData.orgId ? { orgId: reqData.orgId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : { entId: reqData.entId};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};
  const currentUTC = CommonSrvc.currUTCObj();
  const query = { delFlag: false, _id: reqData.id, ...orgObj, ...entObj, ...branchObj};
  const updateObj = {
    smsAuthKey: reqData.smsAuthKey,
    smsApi: reqData.smsApi,
    smsShortUrl: reqData.smsShortUrl,
    tempType: reqData.tempType,
    tempId: reqData.tempId,

    tempVars: reqData.tempVars,

    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum

  }
  return { query, updateObj }
}

module.exports = {
  createSmsSettings, getRstrntSmsSettingsList, rstrntSmsSettingsUpdate
}

const setTempData = (reqData, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();

  return {
    _id: uuidv4(),
    orgId: reqData.orgId,
    oCode: reqData.oCode,
    oName: reqData.oName,
    entId: reqData.entId,
    eCode: reqData.eCode,
    eName: reqData.eName,

    smsAuthKey: reqData.smsAuthKey,
    smsApi: reqData.smsApi,
    smsShortUrl: reqData.smsShortUrl,
    tempType: reqData.tempType,
    tempId: reqData.tempId,

    tempVars: reqData.tempVars || [],

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
