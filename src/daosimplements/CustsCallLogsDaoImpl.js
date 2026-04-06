/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */
var { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const userType = 'VRU';

const CommonSrvc = require('../services/CommonSrvc');

const postCustsCallLogCreate = (reqBody, adData, tokenData, value) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const customerData = reqBody.customerData;
  const _id =  uuidv4();
  const orgId = value == 'missedcall' ? reqBody.orgId : tokenData.ut === 'VRU' ? reqBody.orgId : tokenData.oid;
  const oCode = value == 'missedcall' ?  reqBody.oCode : tokenData.ut === 'VRU' ? reqBody.oCode : tokenData.oc;
  const oName =  value == 'missedcall' ? reqBody.oName : tokenData.ut === 'VRU' ? reqBody.oName : tokenData.on; 
  return {
    _id,
    idSeq: currentUTC.currUTCYear + currentUTC.currUTCMonth + currentUTC.currUTCDayOfYear,

    orgId, oCode, oName, 
    entId: reqBody.entId,
    eCode: reqBody.eCode,
    eName: reqBody.eName,
    branch: reqBody.branch,
    bCode: reqBody.bCode,
    bName: reqBody.bName,
    aUser: adData.aUser,
    aRefUID: adData.aRefUID,
    aName: adData.aName,
    cCategory: reqBody.callCategory,
    cType: reqBody.callType || '',
    cFor: reqBody.callFor || '',
    cStatus: reqBody.callStatus,
    cNum: reqBody.cNum ? reqBody.cNum : _id,

    cuUser: customerData._id ? customerData._id : '',
    cRefUID: customerData.refUID ? customerData.refUID : '',
    cName: customerData.sName ? customerData.sName : '',

    name: reqBody.cname ? reqBody.cname : customerData.name ? customerData.name : 'Guest',
    mobCc: customerData.mobCc,
    mobNum: customerData.mobNum,
    mobCcNum: customerData.mobCcNum,
    altMobCc: customerData.altMobCc ? customerData.altMobCc: '',
    altMobNum: customerData.altMobNum ? customerData.altMobNum : '',
    altMobCcNum: customerData.altMobCcNum ? customerData.altMobCcNum : '',
    emID: customerData.emID ? customerData.emID : '',
    altEmID: customerData.altEmID ?  customerData.altEmID : '',
    callogs: reqBody.callogs,
    notes: reqBody.notes ? reqBody.notes : '',

    cuType: tokenData.ut || userType,
    cUser: tokenData.iss,
    cuName: tokenData.un,
    cDtTm: reqBody.msdClDtTm ? reqBody.msdClDtTm : currentUTC.currUTCDtTm,
    cDtStr: reqBody.msdClDtmStr ? reqBody.msdClDtmStr : currentUTC.currUTCDtTmStr,
    cDtNum: reqBody.msdClDtmNum ? reqBody.msdClDtmNum : currentUTC.currUTCDtTmNum,
    uuType: tokenData.ut || userType,
    uUser: tokenData.iss,
    uuName: tokenData.un,
    uDtTm: reqBody.msdClDtTm ? reqBody.msdClDtTm : currentUTC.currUTCDtTm,
    uDtStr: reqBody.msdClDtmStr ? reqBody.msdClDtmStr : currentUTC.currUTCDtTmStr,
    uDtNum:reqBody.msdClDtmNum ? reqBody.msdClDtmNum : currentUTC.currUTCDtTmNum
  };
}

const getAdminCustCallLogsList = (reqBody, tokenData) => {
  const accessQuery = accessByUser(tokenData);
  const searchStr = reqBody.searchStr || '';
  const cCategory =  {cCategory: reqBody.key};
  const status = reqBody.keyStatus  == 'All' ? {} : (reqBody.keyStatus  == 'Other' ? {cStatus: {$nin: ['Closed', 'Not Answered', 'Callback', 'Missed Call']}} : {cStatus: reqBody.keyStatus});
  const callAgent = reqBody.agentKey ? { aUser:reqBody.agentKey} : {};
  let dateFilterQuery = dateTypeFilterQuery(reqBody);
  const orgObj = tokenData.ut !== 'VRU' ? {orgId: tokenData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {})
  const entObj = tokenData.ut == 'Entity' ? { entId: tokenData.ent } : (reqBody.entityId ? { entId: reqBody.entityId } : {});
  const branchObj = tokenData.ut == 'Branch' ? { branch: tokenData.bid } : (reqBody.branch ? { branch: reqBody.branch } : {});

  const query = {
    delFlag: false,
    ...accessQuery,
    ...cCategory,
    ...status,
    ...callAgent,
    ...orgObj,
    ...entObj,
    ...branchObj,
    ...dateFilterQuery,
    $or: [
      { 'cStatus': { $regex: searchStr, $options: 'i' } },
      { 'name': { $regex: searchStr, $options: 'i' } },
      { 'mobNum': { $regex: searchStr, $options: 'i' } },
      { 'cType': { $regex: searchStr, $options: 'i' } },
      { 'cFor': { $regex: searchStr, $options: 'i' } },
    ],
  }
  const sort = reqBody.sortBy || { cDtNum: -1 };
  return { query, sort };
}

const AdminCustCallLogView = (recordId, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  return { _id: recordId, delFlag: false, ...orgObj, ...entObj, ...branchObj };
}

const callLogsClsdQry = () => {
  const pst15days = moment().subtract(15, 'days').format();
  return {delFlag: false, cDtStr: {$lte: pst15days}};
}

const dltClLogsQry = (id) => {
  return {delFlag: false, _id: id};
}

const setCLClsdData = (data) => {
  return getCLClsdData(data)
}

const adminCustCallLogsAllCount = (reqBody, tData, status) => {
  let dateFilterQuery = dateTypeFilterQuery(reqBody);
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {})
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} :  {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  return [
    {$match: {delFlag: false, ...orgObj, ...entObj, ...branchObj, cCategory: reqBody.key,  ...dateFilterQuery }},
    {$group: {_id: status, count: {$sum: 1}}}
  ];
}

const adminCustCallLogsClosedCount = (reqBody, tData, status) => {
  let dateFilterQuery = dateTypeFilterQuery(reqBody);
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {})
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} :  {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  return [
    {$match: {delFlag: false, ...orgObj, ...entObj, ...branchObj, cStatus: status, cCategory: reqBody.key, ...dateFilterQuery}},
    {$group: { _id: status, count: {$sum: 1}}}
  ];
}

const adminCustCallLogsCallbackCount = (reqBody, tData, status) => {
  let dateFilterQuery = dateTypeFilterQuery(reqBody);
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {})
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} :  {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  return [
    {$match: {delFlag: false, ...orgObj, ...entObj, ...branchObj, cStatus: status, cCategory: reqBody.key, ...dateFilterQuery}},
    {$group: {_id: status, count: {$sum: 1}}}
  ];
}

const adminCustCallLogsNotAnsweredCount = (reqBody, tData, status) => {
  let dateFilterQuery = dateTypeFilterQuery(reqBody);
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {})
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} :  {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  return [
    {$match: {delFlag: false, ...orgObj, ...entObj, ...branchObj, cStatus: status, cCategory: reqBody.key, ...dateFilterQuery}},
    {$group: {_id: status, count: {$sum: 1}}}
  ];
}
const adminCustCallLogsOthersCount = (reqBody, tData, status) => {
  let dateFilterQuery = dateTypeFilterQuery(reqBody);
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {})
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} :  {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  return [
    {$match: {delFlag: false, ...orgObj, ...entObj, ...branchObj, cStatus: {$nin:['All', 'Closed', 'Callback', 'Not Answered', 'Missed Call']}, cCategory: reqBody.key, ...dateFilterQuery}},
    {$group: {_id: status, count: {$sum: 1}}}
  ];
}

const adminCustCallLogsMissedCallCount = (reqBody, tData, status) => {
  let dateFilterQuery = dateTypeFilterQuery(reqBody);
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {})
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} :  {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  return [
    {$match: {delFlag: false, ...orgObj, ...entObj, ...branchObj, cStatus: status, cCategory: reqBody.key, ...dateFilterQuery }},
    {$group: {_id: status, count: {$sum: 1}}}
  ];
}

const getLastMissedCallData = () => {
  return { delFlag: false, cStatus: 'Missed Call', cType : 'Incoming' };
}

module.exports = {
  postCustsCallLogCreate, getAdminCustCallLogsList, AdminCustCallLogView, callLogsClsdQry, dltClLogsQry, setCLClsdData,
  adminCustCallLogsAllCount, adminCustCallLogsClosedCount, adminCustCallLogsCallbackCount, adminCustCallLogsNotAnsweredCount,
  adminCustCallLogsOthersCount, adminCustCallLogsMissedCallCount, getLastMissedCallData
};

const accessByUser = (tokenData) => {
  switch (tokenData.ur) {
    case 'Call Agent':
      return  {$or: [{aUser: tokenData.iss}, {aRefUID: {$in: ['callagent', '9133921922']}}]};
    default:
      return { };
  }
}

const getCLClsdData = (data) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    _id: data._id,
    idSeq: data.idSeq,
    orgId: data.orgId,
    oName: data.oName,
    oCode: data.oCode,
    entId: data.entId,
    eName: data.eName,
    eCode: data.eCode,
    branch: data.branch,
    bCode: data. bCode,
    bName: data.bName,
    aUser: data.aUser,
    aRefUID: data.aRefUID,
    aName: data.aName,
    cCategory: data.cCategory,
    cType: data.cType,
    cFor: data.cFor,
    cStatus: data.cStatus,
    cuUser: data.cuUser,
    cRefUID: data.cRefUID,
    cName: data.cName,
    name: data.name,
    mobCc: data.mobCc,
    mobNum: data.mobNum,
    mobCcNum: data.mobCcNum,
    altMobCc: data.altMobCc,
    altMobNum: data.altMobNum,
    altMobCcNum: data.altMobCcNum,
    emID: data.emID,
    altEmID: data.altEmID,
    callogs: data.callogs,
    notes: data.notes,
    cuType: data.cuType,
    cUser: data.cUser,
    cuName: data.cuName,
    cDtTm: data.cDtTm,
    cDtStr: data.cDtStr,
    cDtNum: data.cDtNum,
    uuType: data.uuType,
    uUser: data.uUser,
    uuName: data.uuName,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const dateTypeFilterQuery = (reqBody) => {
  switch(reqBody.dateType) {
    case 'Today':
      let startDay = moment.utc().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      return {cDtStr: {$gte: startDay}};
    case 'Yesterday':
      let startLastDay = moment.utc().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
      let endDt = moment.utc().subtract(1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss');
      return {cDtStr: {$gte: startLastDay, $lte: endDt}};
    case 'Week':
      let startWeek = moment.utc().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      return {cDtStr: {$gte: startWeek}};
  }
}
