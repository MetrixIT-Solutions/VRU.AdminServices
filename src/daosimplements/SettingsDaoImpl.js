/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');
var moment = require('moment');

const CommonSrvc = require('../services/CommonSrvc');

const bbqhRestrntPricingQuery = () => {
  const date = moment().format('YYYY-MM-DD');
  return { delFlag: false, dType: 'SpecialDay', sdEtDt : {$lt: date} }
}

const deleteQueryForSpclDayPricing = (ids) => {
  return { delFlag: false, _id: { $in: ids }}
}

const createPricingClsd = (resData) => {
  return setPricingClsd(resData);
}
const bbqhRstnQry = (branch, reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});
  const entId = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entityId ? { entId: reqBody.entityId } : {});
  const branchData = tData.ut == 'Branch' ? { branch: tData.bid } : (branch ? { branch} : {});
  return {delFlag: false, ...orgObj, ...branchData, ...entId, dType: 'Regular'}
}

const setResturantObj = (reqBody, tData) => {
  return getResturantObj(reqBody, tData)
}

const createPricing = (reqBody, tData) => {
  return pricingCreateObj(reqBody, tData);
}

const postSpclDayPricingsListQuery = (reqBody, tData) => {
  const searchStr = reqBody.searchStr || '';
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.orgId ? { orgId: reqBody.orgId } : {});
  const data = tData.ut == 'Branch' ? { entId: tData.ent, branch: tData.bid } : (reqBody.branchId ? { branch: reqBody.branchId } : {});;
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} :  (reqBody.entityId ? { entId: reqBody.entityId } : {});;

  return {
    ...orgObj, ...data, ...entObj, delFlag: false, dType: 'SpecialDay',
    $or: [
      { 'eName': { $regex: searchStr, $options: 'i' } },
      { 'eCode': { $regex: searchStr, $options: 'i' } },
      { 'sdStDt': { $regex: searchStr, $options: 'i' } },
      { 'sdEtDt': { $regex: searchStr, $options: 'i' } },
    ]
  };
}

const postSpclDayPricingViewQuery = (reqBody, tData) => {
  const id = reqBody.id ? { _id: reqBody.id } : {};
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});
  const entId = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entityId ? { entId: reqBody.entityId } : {});
  const branchData = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch ? { branch: reqBody.branch } : {});
  const dateQry = reqBody.startDate && reqBody.endDate ? { $or: [{ sdStDt: { $lte: reqBody.startDate }, sdEtDt: { $gte: reqBody.startDate } }, { sdStDt: { $lte: reqBody.endDate }, sdEtDt: { $gte: reqBody.endDate } }, { sdStDt: { $gte: reqBody.startDate }, sdEtDt: { $lte: reqBody.endDate } }] }
    : (reqBody.startDate ? { sdStDt: { $lte: reqBody.startDate }, sdEtDt: { $gte: reqBody.startDate } }
      : (reqBody.endDate ? { sdStDt: { $lte: reqBody.endDate }, sdEtDt: { $gte: reqBody.endDate } } : {}));

  return {
    delFlag: false, ...id, ...orgObj, dType: 'SpecialDay', ...branchData, ...entId,
    ...dateQry
  }
}

const setResturantPriceObj = (reqBody, tData, priceData) => {
  const setData = setResPriObj(reqBody, tData, priceData);
  return setData;
  }

const postBbqhRestPricingView = (reqBody) => {
 const query = { branch: reqBody.branchID, delFlag: false };
 return query;
}  

const updatePricingData = (data, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : {};
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};
  const currentDt = CommonSrvc.currUTCObj();
  const query = {delFlag: false, _id: data._id, ...orgObj, ...entObj, ...branchObj};

  const updateObj = {
    vegAmt: data.vegAmt,
    nonVegAmt: data.nonVegAmt,
    kidAmt: data.kidAmt,
    infantAmt: data.infantAmt,
    vTotalAmt: data.vTotalAmt,
    nvTotalAmt: data.nvTotalAmt,
    kTotalAmt: data.kTotalAmt,
    iTotalAmt: data.iTotalAmt,
    gst: data.gst,
    serTax: data.serTax,

    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentDt.currUTCDtTm,
    uDtStr: currentDt.currUTCDtTmStr,
    uDtNum: currentDt.currUTCDtTmNum
  }
  return { query, updateObj };
}

const getResPricingData = (reqBody) => {
  const query = { branch: reqBody.branchId, day: reqBody.selectedDay, delFlag: false }
  return query
}

module.exports = { 
  bbqhRestrntPricingQuery, deleteQueryForSpclDayPricing, createPricingClsd,
  bbqhRstnQry, setResturantObj, createPricing, postSpclDayPricingsListQuery,
  postSpclDayPricingViewQuery, setResturantPriceObj, postBbqhRestPricingView,
  updatePricingData, getResPricingData
}

const getResturantObj = (reqBody, tData) => {
  const currentDt = CommonSrvc.currUTCObj();
  return {
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
    uuType: 'Admin',
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentDt.currUTCDtTm,
    uDtStr: currentDt.currUTCDtTmStr,
    uDtNum: currentDt.currUTCDtTmNum
  }
}

const pricingCreateObj = (reqBody, tData) => {
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
    branch: reqBody.branch ? reqBody.branch : '',
    bCode: reqBody.bCode ? reqBody.bCode : '',
    seatCapacity: parseInt(reqBody.seatCapacity),
    bcLaps: parseInt(reqBody.bcLaps),

    title: reqBody.spclDayTitle ? reqBody.spclDayTitle : '',
    dType: reqBody.dType ? reqBody.dType : 'Regular',
    sdStDt: reqBody.startDate ? reqBody.startDate : '',
    sdEtDt: reqBody.endDate ? reqBody.endDate : '',

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
    uDtNum: currentDt.currUTCDtTmNum
  }
}

const setPricingClsd = (resData) => {
  const currentDt = CommonSrvc.currUTCObj();
  return {
    _id: uuidv4(),

    orgId: resData.orgId,
    oCode: resData.oCode,
    oName: resData.oName,
    entId: resData.entId,
    eCode: resData.eCode,
    eName: resData.eName,
    branch: resData.branch,
    bCode: resData.bCode,

    seatCapacity: resData.seatCapacity,
    bcLaps: resData.bcLaps,

    title: resData.title,
    dType: resData.dType,
    sdStDt: resData.sdStDt,
    sdEtDt: resData.sdEtDt,

    wVegAmt: resData.wVegAmt,
    wNonVegAmt: resData.wNonVegAmt,
    wKidAmt: resData.wKidAmt,
    wInfantAmt: resData.wInfantAmt,
    wGst: resData.wGst,
    wSerTax: resData.wSerTax,
    wvTotalAmt: resData.wvTotalAmt,
    wnvTotalAmt: resData.wnvTotalAmt,
    wkTotalAmt: resData.wkTotalAmt,
    wiTotalAmt: resData.wiTotalAmt,
    weVegAmt: resData.weVegAmt,
    weNonVegAmt: resData.weNonVegAmt,
    weKidAmt: resData.weKidAmt,
    weInfantAmt: resData.weInfantAmt,
    weGst: resData.weGst,
    weSerTax: resData.weSerTax,
    wevTotalAmt: resData.wevTotalAmt,
    wenvTotalAmt: resData.wenvTotalAmt,
    wekTotalAmt: resData.wekTotalAmt,
    weiTotalAmt: resData.weiTotalAmt,
    cuType: resData.cuType,
    cUser: resData.cUser,
    cuName: resData.cuName,
    cDtTm: currentDt.currUTCDtTm,
    cDtStr: currentDt.currUTCDtTmStr,
    cDtNum: currentDt.currUTCDtTmNum,
    uuType: resData.cuType,
    uUser: resData.cUser,
    uuName: resData.cuName,
    uDtTm: currentDt.currUTCDtTm,
    uDtStr: currentDt.currUTCDtTmStr,
    uDtNum: currentDt.currUTCDtTmNum
  }
}

const setResPriObj = (reqBody, tData, priceData) => {
  const currentDt = CommonSrvc.currUTCObj();
  return {
    _id: uuidv4(),
    orgId: reqBody.orgId,
    oCode: reqBody.oCode,
    oName: reqBody.oName,
    entId: reqBody.entId,
    eName: reqBody.eName,
    eCode: reqBody.eCode,
    branch: reqBody.branchId,
    bCode: reqBody.branchCode,

    sdStDt: reqBody.startDate || '',
    sdEdDt: reqBody.sEndDate || '',
    day: priceData.day || '',
    vegAmt: priceData.vegAmt || '',
    nonVegAmt: priceData.nonVegAmt || '',
  
    kidAmt: parseInt(priceData.kidAmt || 0),
    infantAmt: parseInt(priceData.infantAmt || 0),
    vTotalAmt: parseInt(priceData.vTotalAmt || 0),
    nvTotalAmt: parseInt(priceData.nvTotalAmt || 0),
    kTotalAmt: parseInt(priceData.kTotalAmt || 0),
    iTotalAmt: parseInt(priceData.iTotalAmt || 0),
    gst: parseInt(priceData.gst || 0),
    serTax: parseInt(priceData.serTax || 0),
  
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