/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var {v4: uuidv4} = require('uuid');
var moment = require('moment');

const CommonSrvc = require('../services/CommonSrvc');

const getOffersData  = () => {
  const date1 = new Date();
  const yestDate = date1.getDate() - 1;
  date1.setDate(yestDate);
  const date = moment(date1).format('YYYY-MM-DD');
  return{ delFlag: false, oStatus: 'Active', eDtStr: date}
}

const custOfrsQry = (reqBody, tData) => {
  const branch = reqBody.branch ? reqBody.branch == 'No Branch' ? {branch: {$in: ['', null]}} : {branch: reqBody.branch} : {};
 const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.orgId ? { orgId: reqBody.orgId } : {});
 const entObj = tData.ut == 'Entity' ? {entId: tData.ent} : (reqBody.entityId ? {entId: reqBody.entityId} : {});
 const branchObj = tData.ut == 'Branch' ? {branch: tData.bid} : (reqBody.branch ? {branch: reqBody.branch} : {});
 
 return { delFlag: false, ...orgObj, ...entObj, ...branchObj, ...branch,  $or: [
    { 'oType': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'coupon': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'title': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'oStatus': { $regex: reqBody.searchStr, $options: 'i' } }
  ]};
}

const custOfrsViewQry = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  return {delFlag: false, _id: reqBody.id, ...orgObj, ...entObj, ...branchObj };
}

const setCustOffers = (reqBody, tData) => {
  const ofrsData = setOfrsData(reqBody, tData);
  const usrData = setUsrData(tData);
  return {...ofrsData, ...usrData}
}

const setOfrsUpdObj = (reqBody, tData) => {
  return setOfrsData(reqBody, tData);
}
const setOfrsStsUpdObj = (reqBody, tData) => {
  const currentDt = CommonSrvc.currUTCObj();
  return {
    oStatus: reqBody.oStatus,
    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentDt.currUTCDtTm,
    uDtStr: currentDt.currUTCDtTmStr,
    uDtNum: currentDt.currUTCDtTmNum
  };
}

const custBOfrsQry = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  return {delFlag: false, _id: reqBody.id, ...orgObj, ...entObj, ...branchObj};
}

const setOfferClsdData = (reqBody, tData) => {
  return getOfferClsdData(reqBody, tData);
}

module.exports = {
  getOffersData, custOfrsQry, custOfrsViewQry, setCustOffers, setOfrsUpdObj,
  setOfrsStsUpdObj, custBOfrsQry, setOfferClsdData
};


const setOfrsData = (reqBody, tData) => {
  const currentDt = CommonSrvc.currUTCObj();
  const orgId = tData.ut === 'VRU' ? reqBody.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? reqBody.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? reqBody.oName : tData.on;
  return {
    orgId, oCode, oName,
    entId: reqBody.entId,
    eCode:reqBody.eCode,
    eName: reqBody.eName,
    branch: reqBody.branch,
    bCode: reqBody.bCode,
    bName: reqBody.bName,
    oType: reqBody.oType,
    coupon: reqBody.coupon,
    title: reqBody.title,
    desc: reqBody.desc,
    minbValue: parseInt(reqBody.minbValue) || 0,
    minMem: parseInt(reqBody.minMem) || 0,
    dp: parseInt(reqBody.dp) || 0,
    amount: parseInt(reqBody.amount) || 0,
    sDt: reqBody.sDtStr,
    sDtStr: reqBody.sDtStr,
    eDt: reqBody.eDtStr,
    eDtStr: reqBody.eDtStr,
    oStatus: reqBody.oStatus,
    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentDt.currUTCDtTm,
    uDtStr: currentDt.currUTCDtTmStr,
    uDtNum: currentDt.currUTCDtTmNum,

  }
}

const setUsrData = (tData) => {
  const currentDt = CommonSrvc.currUTCObj();
  return {
    _id: uuidv4(),
    cuType: tData.ut,
    cUser: tData.iss,
    cuName: tData.un,
    cDtTm: currentDt.currUTCDtTm,
    cDtStr: currentDt.currUTCDtTmStr,
    cDtNum: currentDt.currUTCDtTmNum,
  }
}


const getOfferClsdData = (reqBody, tData) => {
  const currentDt = CommonSrvc.currUTCObj();
  return {
    _id: reqBody._id,
    orgId: reqBody.orgId,
    oCode: reqBody.oCode,
    oName: reqBody.oName,
    entId: reqBody.entId,
    eCode:reqBody.eCode,
    eName: reqBody.eName,

    branch: reqBody.branch || '',
    bCode: reqBody.bCode || '',
    oType: reqBody.oType,
    coupon: reqBody.coupon,
    title: reqBody.title,
    desc: reqBody.desc,
    minbValue: reqBody.minbValue || 0,
    minMem: reqBody.minMem || 0,
    dp: reqBody.dp || 0,
    amount: reqBody.amount || 0,
    sDt: reqBody.sDt,
    sDtStr: reqBody.sDtStr,
    eDt: reqBody.eDt,
    eDtStr: reqBody.eDtStr,
    oStatus: reqBody.oStatus,
    cuType: tData.ut,
    cUser: tData.iss,
    cuName: tData.un,
    cDtTm: currentDt.currUTCDtTm,
    cDtStr: currentDt.currUTCDtTmStr,
    cDtNum: currentDt.currUTCDtTmNum,
    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentDt.currUTCDtTm,
    uDtStr: currentDt.currUTCDtTmStr,
    uDtNum: currentDt.currUTCDtTmNum,
  }
}

