/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');
var config = require('config');

const CommonSrvc = require('../services/CommonSrvc');

const entiCreateData = (reqbody, files, tData) => {
  const data = { eIcon: null, eiActualName: null, eiPath: null, eFIcon: null, eFiActualName: null, eFiPath: null};
  const fileD = setImageData(files, data) ;
  const entiData = setEntiData(reqbody, fileD, tData);
  return entiData;
}

const entisList = (reqBody, tData) => {
  const searchStr = reqBody.searchStr || '';
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const entObj = tData.ut == 'Entity' ? {_id: tData.ent} :  {};
  const branch = tData.ut == 'Branch' ? {orgId: tData.oid, _id: tData.ent} :  {};

  return {
    ...orgObj, ...entObj, ...branch, delFlag: false, $or: [
      { 'eName': { $regex: searchStr, $options: 'i' } },
      { 'eCode': { $regex: searchStr, $options: 'i' } },
      { 'mobCcNum': { $regex: searchStr, $options: 'i' } },
      { 'emID': { $regex: searchStr, $options: 'i' } },
      { 'obType': { $regex: searchStr, $options: 'i' } },
      { 'cPerson': { $regex: searchStr, $options: 'i' } },
      { 'district': { $regex: searchStr, $options: 'i' } }
    ]
  };
}

const setEntisListByOrgQuery = (reqBody, tData) => {
  const searchStr = reqBody.searchStr || '';
  const orgId = tData.ut === 'VRU' ? reqBody.orgId : tData.oid;
  const entObj = tData.ut == 'Entity' ? {_id: tData.ent} :  {};

  const query = { orgId, ...entObj, eStatus: 'Active', delFlag: false, $or: [
    { 'eName': { $regex: searchStr, $options: 'i' } },
    { 'eCode': { $regex: searchStr, $options: 'i' } }
  ]};
  const sortObj = {eName: 1};
  return {query, sortObj};
}

const postEntiView = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});
  const entObj = tData.ut == 'Entity' ? {_id: tData.ent} :  {};

  return { delFlag: false, _id: reqBody.id, ...orgObj, ...entObj };
};

const postEntiViewByEntCode = (eCode) => {
  return { delFlag: false, eCode };
};

const entiStatusUpdate = (reqBody, tData) => {
  const curUtc = CommonSrvc.currUTCObj();
  return {
    eStatus: reqBody.status,

    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
    uDtNum: curUtc.currUTCDtTmNum
  };
}

const entiUpdate = (reqBody, filePaths, tData) => {
  const data = { eIcon: reqBody.icon, eiActualName: reqBody.iActualName, eiPath: reqBody.iPath, eFIcon: reqBody.ficon, eFiActualName: reqBody.fiActualName, eFiPath: reqBody.fiPath};
  const fileD = setImageData(filePaths, data);
  const entiData = setEntiUpdateData(reqBody, fileD, tData);
  return entiData;
}

const entisTotalList = (reqBody, tData) => {
  const searchStr = reqBody.searchStr || '';
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});

  return {
    delFlag: false, ...orgObj, eStatus: 'Active', $or: [
      { 'eName': { $regex: searchStr, $options: 'i' } },
      { 'eCode': { $regex: searchStr, $options: 'i' } }
    ]
  };
}

module.exports = {
  entiCreateData, entisList, setEntisListByOrgQuery, postEntiView, postEntiViewByEntCode, entiStatusUpdate, entiUpdate,
  entisTotalList
};

const setImageData = (files = {}, data = {}) => {
  if (files.icon?.length) {
    const icon = files.icon[0];
    data.eIcon = icon.icon;
    data.eiActualName = icon.originalname;
    data.eiPath = icon.path;
  }
  if (files.favicon?.length) {
    const favicon = files.favicon[0];
    data.eFIcon = favicon.icon;
    data.eFiActualName = favicon.originalname;
    data.eFiPath = favicon.path;
  }
  return data;
};


const setEntiData = (reqBody, fileD, tData) => {
  const curUtc = CommonSrvc.currUTCObj();
  const orgId = tData.ut === 'VRU' ? reqBody.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? reqBody.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? reqBody.oName : tData.on;
  return {
    _id: uuidv4(),
    idSeq: {
      seq: 'IND' + reqBody.stateCode + curUtc.currUTCYear + curUtc.currUTCMonth + curUtc.currUTCDay,
      countryCode: 'IND',
      stateCode: reqBody.stateCode,
      year: curUtc.currUTCYear,
      month: curUtc.currUTCMonth,
      day: curUtc.currUTCDay
    },
    orgId, oCode, oName,
    obType: reqBody.obType,

    eName: reqBody.eName,
    eCode: reqBody.eCode,
    cPerson: reqBody.cPerson,
    mobCc: reqBody.mobCc,
    mobNum: reqBody.mobNum,
    mobCcNum: reqBody.mobCcNum,
    emID: reqBody.emID,
    altMobCc: reqBody.altMobCc,
    altMobNum: reqBody.altMobNum,
    altMobCcNum: reqBody.altMobCcNum,
    altEmID: reqBody.altEmID,
    doi: reqBody.doi,
    gst: reqBody.gst,
    pan: reqBody.pan,
    cin: reqBody.cin || '',
    tan: reqBody.tan || '',

    houseNum: reqBody.houseNum,
    area: reqBody.area,
    mandal: reqBody.mandal || '',
    zip: reqBody.zip,
    country: 'India',
    countryCode: 'IND',
    state: reqBody.state,
    stateCode: reqBody.stateCode,
    district: reqBody.district,

    bCount: 1,
    rbNames: [reqBody.bName], 

    rType : reqBody.rType,
    appPerson: reqBody.avgPricingPerPrsn,
    seatCapacity: reqBody.seatCapacity,
    bcLaps: reqBody.bcLaps,

    bSlots: reqBody.bSlots || [], 
    ...fileD,
    eStatus: reqBody.eStatus,

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

const setEntiUpdateData = (reqBody, filePaths, tData) => {
  const curUtc = CommonSrvc.currUTCObj();
  const orgId = tData.ut === 'VRU' ? reqBody.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? reqBody.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? reqBody.oName : tData.on;
  return {
    idSeq: {
      seq: 'IND' + reqBody.stateCode + curUtc.currUTCYear + curUtc.currUTCMonth + curUtc.currUTCDay,
      countryCode: 'IND',
      stateCode: reqBody.stateCode,
      year: curUtc.currUTCYear,
      month: curUtc.currUTCMonth,
      day: curUtc.currUTCDay
    },

    orgId, oCode, oName,
    obType: reqBody.obType,

    eName: reqBody.eName,
    eCode: reqBody.eCode,

    rType : reqBody.rType,
    appPerson: reqBody.avgPricingPerPrsn,
    seatCapacity: reqBody.seatCapacity,
    bcLaps: reqBody.bcLaps,
    
    cPerson: reqBody.cPerson,
    mobCc: reqBody.mobCc,
    mobNum: reqBody.mobNum,
    mobCcNum: reqBody.mobCcNum,
    emID: reqBody.emID,
    altMobCc: reqBody.altMobCc,
    altMobNum: reqBody.altMobNum,
    altMobCcNum: reqBody.altMobCcNum,
    altEmID: reqBody.altEmID,
    doi: reqBody.doi,
    gst: reqBody.gst,
    pan: reqBody.pan,

    houseNum: reqBody.houseNum,
    area: reqBody.area,
    zip: reqBody.zip,
    state: reqBody.state,
    stateCode: reqBody.stateCode,
    district: reqBody.district,

    bSlots: reqBody.bSlots, 
    ...filePaths,
    eStatus: reqBody.eStatus,

    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
    uDtNum: curUtc.currUTCDtTmNum
  }
}