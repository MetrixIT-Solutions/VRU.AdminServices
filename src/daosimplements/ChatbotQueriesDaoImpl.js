/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');

const CommonSrvc = require('../services/CommonSrvc');
const uObj = { ut: 'VRU', un: 'Superadmin', iss: 'VRUAUID10001'};
const orgD = { oName: 'V Reserve U', orgId: 'VRUORGID100001', oCode: 'VRU'};

const postChatbotQryCreate = (reqBody) => {
  const data = setChtbotData(reqBody);
  return data;
}

const chatBotListQry = (reqBody, tData) => {
  return {
    delFlag: false, $or: [
      { 'org': { $regex: reqBody.searchStr, $options: 'i' } },
      { 'name': { $regex: reqBody.searchStr, $options: 'i' } },
      { 'mobCcNum': { $regex: reqBody.searchStr, $options: 'i' } },
      { 'emID': { $regex: reqBody.searchStr, $options: 'i' } }
    ]
  };
}

const setChtbotStsUpdate = (reqBody, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const query = { _id: reqBody.id, delFlag: false };
  const msg = reqBody.msg ? {msg: reqBody.msg} : {};
  const updObj = {
    status: reqBody.status,
    sNotes: reqBody.notes,
    ...msg,
    uuType: 'VRU',
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
  }
  return { query, updObj }
}

const setChtbotMsgUpdate = (reqBody) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const data = reqBody.id ? { _id: reqBody.id }: {...reqBody.uData};
  const query = { ...data, delFlag: false };
  const updObj = {
    msg: reqBody.msg,
    status: 'Requested',
    uuType: uObj.ut,
    uUser: uObj.iss,
    uuName: uObj.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
  }
  return { query, updObj }
}

const chatbotLfcsListQry = (cbQryId) => {
  return { cbQryId, delFlag: false };
}

const chatbotQueriesLcsCreate = (data) => {
  const currentUTC = CommonSrvc.currUTCObj();
  let obj = {
    ...data,
    _id: uuidv4(),
    cbQryId: data._id,
    
    cuType: uObj.ut,
    cUser: uObj.iss,
    cuName: uObj.un,
    cDtTm: currentUTC.currUTCDtTmNum,
    cDtStr: currentUTC.currUTCDtTmStr,
    uuType: uObj.ut,
    uUser: uObj.iss,
    uuName: uObj.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtTm: currentUTC.currUTCDtTmNum,
    uDtStr: currentUTC.currUTCDtTmStr,
  }
  return obj;
}

module.exports = {
  postChatbotQryCreate, chatBotListQry, setChtbotStsUpdate, setChtbotMsgUpdate, chatbotLfcsListQry,
  chatbotQueriesLcsCreate
}

const setChtbotData = (reqBody) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    _id: uuidv4(),
    ...orgD,

    org: reqBody.org,
    name: reqBody.name,
    mobCc: reqBody.mobCc,
    mobNum: reqBody.mobNum,
    mobCcNum: reqBody.mobCcNum,
    emID: reqBody.emID,
    status: 'Created',
    
    cDt: currentUTC.currUTCDt,

    cuType: uObj.ut,
    cUser: uObj.iss,
    cuName: uObj.un,
    cDtTm: currentUTC.currUTCDtTmNum,
    cDtStr: currentUTC.currUTCDtTmStr,
    uuType: uObj.ut,
    uUser: uObj.iss,
    uuName: uObj.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtTm: currentUTC.currUTCDtTmNum,
    uDtStr: currentUTC.currUTCDtTmStr,
  }
}
