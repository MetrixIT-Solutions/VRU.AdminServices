/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');

const CommonSrvc = require('../services/CommonSrvc');

const createSmsSettings = (reqData, mailType, tData) => {
  const data = setData(reqData, mailType.value, tData);
  return data;
}

const getRstrntMailSettingsList = (reqBody, tData) => {
  const searchStr = reqBody.searchStr || '';
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.orgId ? { orgId: reqBody.orgId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entId ? { entId: reqBody.entId } : {});
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch ? { branch: reqBody.branch } : {});  
  return {
    ...orgObj, ...entObj, ...branchObj, delFlag: false, $or: [
      { 'mailType': { $regex: searchStr, $options: 'i' } },
      { 'admnToMails': { $regex: searchStr, $options: 'i' } },
      { 'eName': { $regex: searchStr, $options: 'i' } },
    ]
  };
}

const rstrntMailSettingsUpdate = (reqData, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : {};
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {}; 
  const query = { delFlag: false, _id: reqData.id, ...orgObj, ...entObj, ...branchObj};
  const updateObj = {
    fromMail: reqData.fromMail,
    fromMailPswd: reqData.fromMailPswd,
    mailServerHost: reqData.mailServerHost,
    mailServerPort: reqData.mailServerPort,

    admnToMails: reqData.admnToMails,
    senderAdrs: reqData.senderAdrs,
    mailSub: reqData.mailSub || '',
    htmlContent: reqData.htmlContent || '',
    branchToMails: reqData.branchToMails,

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
  createSmsSettings, getRstrntMailSettingsList, rstrntMailSettingsUpdate
}

const setData = (reqData, mailType, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();

  return {
    _id: uuidv4(),
    orgId: reqData.orgId,
    oCode: reqData.oCode,
    oName: reqData.oName,
    entId: reqData.entId,
    eCode: reqData.eCode,
    eName: reqData.eName,

    // fromMail: reqData.fromMail,
    // fromMailPswd: reqData.fromMailPswd,
    // mailServerHost: reqData.mailServerHost,
    // mailServerPort: reqData.mailServerPort,
    // senderAdrs: reqData.senderAdrs,
    
    mailType: mailType,
    admnToMails: reqData.admnToMails,
    mailSub: reqData.mailSub || '',
    htmlContent: reqData.htmlContent || '',
    branchToMails : reqData.branchToMails,

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
