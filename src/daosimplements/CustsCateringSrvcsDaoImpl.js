/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const CustsCateringSrvcs = require('../schemas/CustsCateringSrvcs');
const commonSrvc = require('../services/CommonSrvc');
var { v4: uuidv4 } = require('uuid');
const userType = 'VRU';

const createCateringSrvc = (reqBody, tData) => {
  const obj = setCateringCreate(reqBody, tData);
  const createObj = new CustsCateringSrvcs(obj);
  return createObj;
};

const getCateringSrvcsList = (tData, reqBody) => {
  const srchStr = reqBody.searchStr ? reqBody.searchStr : '';
  const org = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const ent = (tData.ut !== 'VRU' && tData.ut !== 'Board') ? {entId: tData.ent} : (reqBody.entId ? {entId: reqBody.entId} : {});
  const branch = tData.ut === 'Branch' ? {branch: tData.bid} : (reqBody.branch ? {branch: reqBody.branch} : {});

  const query = {
    eStatus: reqBody.status,
    ...org, ...ent, ...branch,
    delFlag: false,
    $or: [
      { 'name': { $regex: srchStr, $options: 'i' } },
      { 'mobCcNum': { $regex: srchStr, $options: 'i' } },
      { 'eventId': { $regex: srchStr, $options: 'i' } },
      { 'eLocation': { $regex: srchStr, $options: 'i' } },
    ]
  };
  const sortQry = (reqBody.status == 'Requested' || reqBody.status == 'Confirmed') ? {eDtStr: 1} : {uDtStr: -1};
  return {query, sortQry};
}

const cateringSrvcView = (_id, tData) => {
  const org = tData.ut !== 'VRU' ? {orgId: tData.oid} : {};
  const ent = (tData.ut !== 'VRU' && tData.ut !== 'Board') ? { entId: tData.ent } : {};
  const branch = tData.ut === 'Branch' ? { branch: tData.bid } : {};
  return { _id, delFlag: false, ...org, ...ent, ...branch};
};

const cateringSrvcStatusUpdate = (reqBody, tData) => {
  const currentUTC = commonSrvc.currUTCObj();
  const query = { _id: reqBody.id, delFlag: false };

  const newLogEntry = {
    _id: currentUTC.currUTCDtTmStr,
    cuType: tData.ut || userType,
    cUser: tData.iss,
    cuName: tData.un,
    status: reqBody.status,
    notes: reqBody.notes || ''
  };

  const updateObj = {
    $set : {
      eStatus: reqBody.status,
      esNotes: reqBody.notes,
      uuType: userType,
      uUser: tData.iss,
      uuName: tData.un,
      uDtTm: currentUTC.currUTCDtTm,
      uDtStr: currentUTC.currUTCDtTmStr,
      uDtNum: currentUTC.currUTCDtTmNum
    },
    $push: {esLogs: {
      $each: [newLogEntry],
      $position: 0
    }}
  };

  return { query, updateObj };
};

const updateCateringSrvcs = (reqBody, tData) => {
  const data = updateData(reqBody, tData);
  return data;
}

module.exports = {
  createCateringSrvc, getCateringSrvcsList, cateringSrvcView, cateringSrvcStatusUpdate, updateCateringSrvcs
};

const setCateringCreate = (reqBody, tData) => {
  const currentUTC = commonSrvc.currUTCObj();
  const number = reqBody.mobileNum.slice(6, 10);
  const eDtStr = reqBody.eDt;
  const date = new Date();
  const time = (date.getHours() * 60)+date.getMinutes()+date.getSeconds();
  const currentDay = currentUTC.currUTCDayOfYear.toString();
  const day = (currentDay.length == 1 ? '00' + currentDay : currentDay.length == 2 ? '0' + currentDay : currentDay);
  const esLogs = [{
    _id: currentUTC.currUTCDtTmStr,
    cuType: tData.ut || userType,
    cUser: tData.iss,
    cuName: tData.un,
    status: reqBody.eStatus || 'Requested',
    notes: ''
  }];
  return {
    _id: uuidv4(),

    orgId: reqBody.orgId,
    oName: reqBody.oName,
    oCode: reqBody.oCode,
    entId: reqBody.entId,
    eName: reqBody.eName,
    eCode: reqBody.eCode,
    branch: reqBody.branch,
    bCode: reqBody.bCode,
    bName: reqBody.bName,

    user: reqBody.user,
    refUID: reqBody.refUID,

    eStatus: reqBody.eStatus || 'Requested',
    eventId: (currentUTC.currUTCYear - 2022) + day + '-' + time + '-' + number,

    name: reqBody.name?.trim(),
    mobCc: '+91',
    mobNum: reqBody.mobileNum,
    mobCcNum: '+91' + reqBody.mobileNum,

    emID: reqBody.emailId?.trim() || '',
    numPersons: reqBody.numPersons || '',
    serviceFor: reqBody.serviceFor?.trim(),
    eDt: reqBody.eDt,
    eDtStr,
    eLocation: reqBody.eLocation?.trim(),
    eInfo: reqBody.eInfo?.trim() || '',
    occassion: reqBody.occassion || '',
    esLogs,
    esNotes: reqBody.esNotes || '',

    delFlag: false,
    cuType: tData.ut || userType,
    cUser: tData.iss,
    cuName: tData.un,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: tData.ut || userType,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const updateData = (reqBody, tData) => {
  const currentUTC = commonSrvc.currUTCObj();
  return {$set: {
    name: reqBody.name?.trim(),
    // mobCc: '+91',
    // mobNum: reqBody.mobileNum,
    // mobCcNum: '+91' + reqBody.mobileNum,

    emID: reqBody.emailId?.trim() || '',
    numPersons: reqBody.numPersons || '',
    serviceFor: reqBody.serviceFor?.trim(),
    eDt: reqBody.eDt,
    eDtStr: reqBody.eDt,
    esNotes: reqBody.esNotes || '',
    eLocation: reqBody.eLocation?.trim(),
    eInfo: reqBody.eInfo?.trim() || '',
    occassion: reqBody.occassion || '',

    uuType: tData.ut || userType,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }};
}