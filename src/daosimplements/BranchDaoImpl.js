/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var {v4: uuidv4} = require('uuid');

const CommonSrvc = require('../services/CommonSrvc');

const userBrncQhry = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} : reqBody.entityId ? {entId: reqBody.entityId} : {};
  const branchObj = tData.ut == 'Branch' ? { _id : tData.bid } : (reqBody.branch ? { branch: reqBody.branch } : {});

  return { delFlag: false, ...orgObj, ...entObj, ...branchObj, $or: [
    { 'eName': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'bName': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'bCode': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'cPerson': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'mobCcNum': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'emID': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'blName': { $regex: reqBody.searchStr, $options: 'i' } }
  ]};
}

const admnBranchCreateData = (reqBody, tData) => {
  const usrData = setUsrData(reqBody, tData);
  const brnchData = setBranchData(reqBody, tData);
  return {...usrData, ...brnchData};
} 

const admnBranchView = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { _id : tData.bid } : {};

  return { delFlag: false, _id: reqBody.id, ...orgObj, ...entObj, ...branchObj };
}

const setAdmnBranchUpdate = (reqBody, tData) => {
  return setBranchData(reqBody, tData);
}

const setResturantObj = (reqBody, id, tData) => {
  return getResturantObj(reqBody, id, tData)
}

const ofrsBrnchQry = (reqBody, tData) => {
  const status = reqBody.status ? {bStatus: reqBody.status} : {};
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});
  const entId = reqBody.entId ? { entId: reqBody.entId } : tData.ent ? { entId: tData.ent } :{};
  const branchObj = tData.ut == 'Branch' ? { _id: tData.bid } : {};

  return {delFlag: false, ...orgObj, ...status, ...entId, ...branchObj};
}

const getRestaurantId = (data, reqBody, tData, key) => {
  const currentDt = CommonSrvc.currUTCObj();
  const query = { delFlag: false, _id: data.entId };
  const updateObj = key == 'create' ? {
    $inc : {bCount: 1 },
    $set: {
      uuType: tData.ur,
      uUser: tData.iss,
      uuName: tData.un,
      uDtTm: currentDt.currUTCDtTm,
      uDtStr: currentDt.currUTCDtTmStr,
      uDtNum: currentDt.currUTCDtTmNum
    },
    $push: {
      rbNames: reqBody.bName
    }
  } : key == 'update' ? {
    $set: {
      uuType: tData.ur,
      uUser: tData.iss,
      uuName: tData.un,
      uDtTm: currentDt.currUTCDtTm,
      uDtStr: currentDt.currUTCDtTmStr,
      uDtNum: currentDt.currUTCDtTmNum
    },
    $push: { rbNames: reqBody.bName },
  } : {
    $set: {
      uuType: tData.ur,
      uUser: tData.iss,
      uuName: tData.un,
      uDtTm: currentDt.currUTCDtTm,
      uDtStr: currentDt.currUTCDtTmStr,
      uDtNum: currentDt.currUTCDtTmNum
    },
    $pull: { rbNames: reqBody.oldBName }
  }
  return { query, updateObj };
}

const branchesTotalList = (reqBody, tData) => {
  const searchStr = reqBody.searchStr || '';
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});

  return {
    delFlag: false, ...orgObj, entId: tData.ent, bStatus: 'Active', $or: [
      { 'bName': { $regex: searchStr, $options: 'i' } },
      { 'bCode': { $regex: searchStr, $options: 'i' } }
    ]
  };
}

const statusUpdate = (reqBody, tData) => {
  const currentDt = CommonSrvc.currUTCObj();
  return {
    bStatus: reqBody.bStatus,

    uuType: tData.ur,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentDt.currUTCDtTm,
    uDtStr: currentDt.currUTCDtTmStr,
    uDtNum: currentDt.currUTCDtTmNum
  }
}

const getBranchDatabyId = (id) => ({ delFlag: false, _id: id });

module.exports = {
  userBrncQhry, admnBranchCreateData, admnBranchView, setAdmnBranchUpdate, setResturantObj, ofrsBrnchQry,
  getRestaurantId, branchesTotalList, statusUpdate, getBranchDatabyId
}

const setUsrData = (reqBody, tData) => {
  const currentDt = CommonSrvc.currUTCObj();
  return {
    _id: uuidv4(),
    idSeq: {
      seq: 'IND' + '-' + reqBody.stateCode + '-' + currentDt.currUTCYear + currentDt.currUTCMonth + currentDt.currUTCDay,
      countryCode: reqBody.countryCode || '',
      stateCode: reqBody.stateCode || '',
      distCode: reqBody.districtCode || '',
      zip: reqBody.pincode || '',
      aLocality: reqBody.mandal || '',
      area: reqBody.village || '',
      year: currentDt.currUTCYear,
      month: currentDt.currUTCMonth,
      day: currentDt.currUTCDay
    }, 
    isPrimary: false,
    cuType: tData.ur,
    cUser: tData.iss,
    cuName: tData.un,
    cDtTm: currentDt.currUTCDtTm,
    cDtStr: currentDt.currUTCDtTmStr,
    cDtNum: currentDt.currUTCDtTmNum,
  }
}

const setBranchData = (reqBody, tData) => {
  const currentDt = CommonSrvc.currUTCObj();
  const orgId = tData.ut === 'VRU' ? reqBody.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? reqBody.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? reqBody.oName : tData.on;
  const str = reqBody.bName;
  const d1 = str.split('');
  const lt1 = d1.slice(0,3).join('');
  const br1 = reqBody.eCode + lt1;
  const bCode = br1.toUpperCase();

  return {
    orgId, oCode, oName,
    entId: reqBody.entId,
    eCode:reqBody.eCode,
    eName: reqBody.eName,
    bName: reqBody.bName, 
    bCode: reqBody.bCode ? reqBody.bCode : bCode,
    rType : reqBody.rType || reqBody.entityType,
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
    fDt: reqBody.fDt,
    fDtStr: reqBody.fDt,
    blName: reqBody.blName,
    houseNum: reqBody.houseNum,
    area: reqBody.area,
    mandal: reqBody.mandal,
    zip: reqBody.zip,
    country: 'India',
    countryCode: 'IND',
    state: reqBody.state,
    stateCode: reqBody.stateCode,
    district: reqBody.district,
    plusCode: reqBody.plusCode || {},
    geocoordinates: reqBody.geocoordinates || {},
    bSlots: reqBody.bSlots || [], 
    bStatus: reqBody.bStatus || 'Active',
    bIcon: reqBody.bIcon || '',
    biActualName: reqBody.biActualName || '',
    biPath: reqBody.biPath || '',
    uuType: tData.ur,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentDt.currUTCDtTm,
    uDtStr: currentDt.currUTCDtTmStr,
    uDtNum: currentDt.currUTCDtTmNum
  }
}

const getResturantObj = (reqBody, id, tData) => {
  const currentDt = CommonSrvc.currUTCObj();
  const orgId = tData.ut === 'VRU' ? reqBody.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? reqBody.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? reqBody.oName : tData.on;
  return {
    _id: uuidv4(),
    orgId, oCode, oName,
    entId: reqBody.entId,
    eCode: reqBody.eCode,
    eName: reqBody.eName,
    branch: id,
    bCode: reqBody.bCode,
    seatCapacity: parseInt(reqBody.seatCapacity),
    bcLaps: parseInt(reqBody.bcLaps),
    wVegAmt: parseInt(reqBody.wVegAmt),
    wNonVegAmt: parseInt(reqBody.wNonVegAmt),
    wKidAmt: parseInt(reqBody.wKidAmt),
    wInfantAmt: parseInt(reqBody.wInfantAmt),
    wGst: parseInt(reqBody.wGst),
    wSerTax: parseInt(reqBody.wSerTax),
    wvTotalAmt: parseInt(reqBody.wvTotalAmt),
    wnvTotalAmt: parseInt(reqBody.wnvTotalAmt),
    wkTotalAmt: parseInt(reqBody.wkTotalAmt),
    wiTotalAmt: parseInt(reqBody.wiTotalAmt),
    weVegAmt: parseInt(reqBody.weVegAmt),
    weNonVegAmt: parseInt(reqBody.weNonVegAmt),
    weKidAmt: parseInt(reqBody.weKidAmt),
    weInfantAmt: parseInt(reqBody.weInfantAmt),
    weGst: parseInt(reqBody.weGst),
    weSerTax: parseInt(reqBody.weSerTax),
    wevTotalAmt: parseInt(reqBody.wevTotalAmt),
    wenvTotalAmt: parseInt(reqBody.wenvTotalAmt),
    wekTotalAmt: parseInt(reqBody.wekTotalAmt),
    weiTotalAmt: parseInt(reqBody.weiTotalAmt),
    cuType: tData.ur,
    cUser: tData.iss,
    cuName: tData.un,
    cDtTm: currentDt.currUTCDtTm,
    cDtStr: currentDt.currUTCDtTmStr,
    cDtNum: currentDt.currUTCDtTmNum,
    uuType: tData.ur,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentDt.currUTCDtTm,
    uDtStr: currentDt.currUTCDtTmStr,
    uDtNum: currentDt.currUTCDtTmNum
  }
}
