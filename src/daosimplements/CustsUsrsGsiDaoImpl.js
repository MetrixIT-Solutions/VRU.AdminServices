/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var moment = require('moment');
var {v4: uuidv4} = require('uuid');

const userType = 'VRU';
const CommonSrvc = require('../services/CommonSrvc');

const deleteManyGsi = () => {
  const date = moment().startOf('month').subtract(3, 'months').startOf('month').format('YYYY-MM-DD');
  return { delFlag: false, sDtStr: { $lt: date } }
}

const getGsiAnalysisData = (resData) => {
  const yDay = moment().subtract(1, 'days');
  const year = yDay.format('YYYY');
  const month = yDay.format('MM');
  const date = year + 'M' + month;
  return { branch: resData._id.branch, captain: resData._id.captain, dType: date };
}

const getSumOfGsiData = () => {
  const yDay = moment().subtract(1, 'days');
  const ystrdyDate = yDay.format('YYYY-MM-DD');
  const startDate = yDay.startOf('month').format('YYYY-MM-DD');
  return [
    {
      $match: { delFlag: false, sDtStr: { $gte: startDate, $lte: ystrdyDate } }
    },
    {
      $group: {
        _id: {
          branch: "$branch",
          captain: "$captain",
          bCode: "$bCode",
          bName: "$bName",
          cEmail: "$cEmail",
          cName: "$cName",
        },
        oExpVal: { $sum: "$oExpVal" },
        cleanVal: { $sum: "$cleanVal" },
        cmfrtVal: { $sum: "$cmfrtVal" },
        bExpVal: { $sum: "$bExpVal" },
        bvrgsVal: { $sum: "$bvrgsVal" },
        buffetVal: { $sum: "$buffetVal" },
        strsVal: { $sum: "$strsVal" },
        dsrtsVal: { $sum: "$dsrtsVal" },
        lveCntrVal: { $sum: "$lveCntrVal" },
        atntvVal: { $sum: "$atntvVal" },
        crtsVal: { $sum: "$crtsVal" },
        billExpVal: { $sum: "$bilExpVal" },
        count: { $sum: 1 },
      }
    },
  ]
}

const  updateGsiAnalysisData = (resData, data) => {
  return updateGsiAnlsData(resData, data);
}

const createGsiAnalysisData = (resData) => {
  return createGsiAnlsData(resData);
}

const custUsrsGsiListQry = (reqBody, tData) => {
  const searchStr = reqBody.searchStr || '';
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entityId ? { entId: reqBody.entityId } : {});  
  const branch = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch ? { branch: reqBody.branch } : {});
  const captain = reqBody.captain ? {captain: reqBody.captain} : {};
  const sDtStr = getDateQry(reqBody);
  return { 
    delFlag: false, ...orgObj, ...entObj, ...branch, ...sDtStr, ...captain,
    $or: [
      { 'cEmail': { $regex: searchStr, $options: 'i' } },
      { 'cName': { $regex: searchStr, $options: 'i' } },
      { 'tNum': { $regex: searchStr, $options: 'i' } },
      { 'gName': { $regex: searchStr, $options: 'i' } },
      { 'gMob': { $regex: searchStr, $options: 'i' } }
    ]
  };
}
const getGsiAvgCount = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entityId ? { entId: reqBody.entityId } : {}); 
  const branch = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch ? { branch: reqBody.branch } : {});
  const captain = reqBody.captain ? {captain: reqBody.captain} : {};
  const sDtStr = getDateQry(reqBody);
  return [
    { $match: { delFlag: false, ...orgObj, ...entObj, ...sDtStr, ...branch, ...captain } },
    { $group: {
        _id: "$sDtStr",
        avgOExpVal: { $avg: "$oExpVal" },
        avgCleanVal: { $avg: "$cleanVal" },
        avgCmfrtVal: { $avg: "$cmfrtVal" },
        avgBExpVal: { $avg: "$bExpVal" },
        avgBvrgsVal: { $avg: "$bvrgsVal" },
        avgBuffetVal: { $avg: "$buffetVal" },
        avgStrsVal: { $avg: "$strsVal" },
        avgDsrtsVal: { $avg: "$dsrtsVal" },
        avgLveCntrVal: { $avg: "$lveCntrVal" },
        avgAtntvVal: { $avg: "$atntvVal" },
        avgCrtsVal: { $avg: "$crtsVal" },
        avgBillExpVal: { $avg: "$bilExpVal" },
      }
    },
  ];
}

const setCustsGsiData = (reqBody, tData) => {
  return setGsiData(reqBody, tData);
}

const getCustsGsiOExpCount = (reqBody, tData) => {
  const sDtStr = { sDtStr: { $gte: reqBody.startDate, $lte: reqBody.endDate } };
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entityId ? { entId: reqBody.entityId } : {}); 
  const branch = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch ? { branch: reqBody.branch } : {});
  const captain = reqBody.captain ? {captain: reqBody.captain} : {};

  return [
    { $match: { delFlag: false, ...orgObj, ...entObj, ...sDtStr, ...branch, ...captain } },
    { $group: { _id: '$sDtStr', avgOExpVal: { $avg: "$oExpVal" } }}
  ];
}

const setGsiUpData = (reqBody, tData) => {
  return setGsiUpdateData(reqBody, tData);
}

const custGsiViewQry = (_id) => {
  return {delFlag: false, _id};
}

const getCustsGsiAvgCountByMnth = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entityId ? { entId: reqBody.entityId } : {}); 
  const branch = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch ? { branch: reqBody.branch } : {});
  const captain = reqBody.captain ? { captain: reqBody.captain } : {};
  const { monthYear } = reqBody;
  const [year, month] = monthYear.split('-').map(Number);
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
  
  return [
    {
      $match: {
        sDtStr: { $gte: startDate, $lte: endDate },
        delFlag: false, ...orgObj, ...entObj, ...branch, ...captain
      }
    },
    {
      $group: {
        _id: {
          branch: "$branch",
          sDtStr: "$sDtStr",
          bCode: "$bCode",
          bName: "$bName"
        },
        avgOExpVal: { $avg: "$oExpVal" },
        avgCleanVal: { $avg: "$cleanVal" },
        avgCmfrtVal: { $avg: "$cmfrtVal" },
        avgBExpVal: { $avg: "$bExpVal" },
        avgBvrgsVal: { $avg: "$bvrgsVal" },
        avgBuffetVal: { $avg: "$buffetVal" },
        avgStrsVal: { $avg: "$strsVal" },
        avgDsrtsVal: { $avg: "$dsrtsVal" },
        avgLveCntrVal: { $avg: "$lveCntrVal" },
        avgAtntvVal: { $avg: "$atntvVal" },
        avgCrtsVal: { $avg: "$crtsVal" },
        avgBillExpVal: { $avg: "$bilExpVal" },
        count: { $sum: 1 }
      },
  }
  ]
}

module.exports = {
  deleteManyGsi, getSumOfGsiData, updateGsiAnalysisData, getGsiAnalysisData, createGsiAnalysisData, custUsrsGsiListQry, setCustsGsiData, getCustsGsiOExpCount, setGsiUpData, custGsiViewQry, getGsiAvgCount, getCustsGsiAvgCountByMnth
};

const updateGsiAnlsData = (resData, data) => {
  const upObj = {
    oExpCnt: resData.count,
    oExpVal: resData.oExpVal,
    cleanCnt: resData.count,
    cleanVal: resData.cleanVal,
    cmfrtCnt: resData.count,
    cmfrtVal: resData.cmfrtVal,
    bExpCnt: resData.count,
    bExpVal: resData.bExpVal,
    bvrgsCnt: resData.count,
    bvrgsVal: resData.bvrgsVal,
    buffetCnt: resData.count,
    buffetVal: resData.buffetVal,
    strsCnt: resData.count,
    strsVal: resData.strsVal,
    dsrtsCnt: resData.count,
    dsrtsVal: resData.dsrtsVal,
    lveCntr: resData.count,
    lveCntrVal: resData.lveCntrVal,
    atntvCnt: resData.count,
    atntvVal: resData.atntvVal,
    crtsCnt: resData.count,
    crtsVal: resData.crtsVal,
    bilExpCnt: resData.count,
    bilExpVal: resData.bilExpVal
  }
  return {upObj, query: {_id: data._id}};
}

const createGsiAnlsData = (resData) => {
  const yDay = moment().subtract(1, 'days');
  const year = yDay.format('YYYY');
  const month = yDay.format('MM');
  const dType = year + 'M' + month;
  const data = resData._id;
  return {
    _id: uuidv4(),

    branch: data.branch,
    bCode: data.bCode,
    bName: data.bName,

    captain: data.captain,
    cEmail: data.cEmail,
    cName: data.cName,

    dType,
    oExpCnt: resData.count,
    oExpVal: resData.oExpVal,
    cleanCnt: resData.count,
    cleanVal: resData.cleanVal,
    cmfrtCnt: resData.count,
    cmfrtVal: resData.cmfrtVal,
    bExpCnt: resData.count,
    bExpVal: resData.bExpVal,
    bvrgsCnt: resData.count,
    bvrgsVal: resData.bvrgsVal,
    buffetCnt: resData.count,
    buffetVal: resData.buffetVal,
    strsCnt: resData.count,
    strsVal: resData.strsVal,
    dsrtsCnt: resData.count,
    dsrtsVal: resData.dsrtsVal,
    lveCntrCnt: resData.count,
    lveCntrVal: resData.lveCntrVal,
    atntvCnt: resData.count,
    atntvVal: resData.atntvVal,
    crtsCnt: resData.count,
    crtsVal: resData.crtsVal,
    bilExpCnt: resData.count,
    bilExpVal: resData.bilExpVal
  }
}

const getDateQry = (reqBody) => {
  var todayDate = moment().format('YYYY-MM-DD');
  var yesterdayDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
  switch(reqBody?.sDay) {
    case 'Today':
      return {sDtStr: todayDate};
    case 'Yesterday':
      return {sDtStr: yesterdayDate};
    case 'Calendar':
      return reqBody.startDate ? {sDtStr: reqBody.startDate} : {sDtStr: { $gt: todayDate }};
    default:
      return {sDtStr: { $gt: todayDate }};  
  }
}

const setGsiData = (reqBody, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const orgId = tData.ut === 'VRU' ? reqBody.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? reqBody.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? reqBody.oName : tData.on; 
  return {
    _id: uuidv4(),

    eUser: reqBody.eUser || '',
    cRefUID: reqBody.cRefUID || '',
    cMyPrimary: reqBody.cMyPrimary || '',
    orgId, oCode, oName,
    entId: reqBody.entId,
    eName: reqBody.eName,
    eCode: reqBody.eCode,
    branch: reqBody.branch,
    bCode: reqBody.bCode,
    bName: reqBody.bName,

    captain: tData.ur == 'Captain' ? tData.iss : reqBody.captain,
    cEmail: reqBody.cEmail || '',
    cName: reqBody.cName,
    tNum: reqBody.tNum,
    sDtStr: reqBody.sDtStr,

    gName: reqBody.gName,
    gMob: reqBody.gMob,
    gEmID: reqBody.gEmID || '',
    occasion: reqBody.occasion || '',

    dineSlot: reqBody.dineSlot,
    hdyk: reqBody.hdyk,

    oExp: reqBody.oExp,
    oExpVal: reqBody.oExpVal,
    clean: reqBody.clean,
    cleanVal: reqBody.cleanVal,
    cmfrt: reqBody.cmfrt,
    cmfrtVal: reqBody.cmfrtVal,
    bExp: reqBody.bExp,
    bExpVal: reqBody.bExpVal,
    bvrgs: reqBody.bvrgs,
    bvrgsVal: reqBody.bvrgsVal,
    buffet: reqBody.buffet,
    buffetVal: reqBody.buffetVal,
    strs: reqBody.strs,
    strsVal: reqBody.strsVal,
    dsrts: reqBody.dsrts,
    dsrtsVal: reqBody.dsrtsVal,
    lveCntr: reqBody.lveCntr,
    lveCntrVal: reqBody.lveCntrVal,
    atntv: reqBody.atntv,
    atntvVal: reqBody.atntvVal,
    crts: reqBody.crts,
    crtsVal: reqBody.crtsVal,
    bilExp: reqBody.bilExp,
    bilExpVal: reqBody.bilExpVal,
    comments: reqBody.comments || '',
    
    cuType: tData.ut || userType,
    cUser: tData.iss,
    cuName: tData.un,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,

    uuType: tData.ut ||  userType,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum,
  }
}

const setGsiUpdateData = (reqBody, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    eUser: reqBody.eUser || '',
    cRefUID: reqBody.cRefUID || '',
    cMyPrimary: reqBody.cMyPrimary || '',

    captain: tData.ur == 'Captain' ? tData.iss : reqBody.captain,
    cEmail: reqBody.cEmail,
    cName: reqBody.cName,
    tNum: reqBody.tNum,
    sDtStr: reqBody.sDtStr,

    gName: reqBody.gName,
    gMob: reqBody.gMob,
    gEmID: reqBody.gEmID || '',
    occasion: reqBody.occasion || '',

    dineSlot: reqBody.dineSlot,
    hdyk: reqBody.hdyk,

    oExp: reqBody.oExp,
    oExpVal: reqBody.oExpVal,
    clean: reqBody.clean,
    cleanVal: reqBody.cleanVal,
    cmfrt: reqBody.cmfrt,
    cmfrtVal: reqBody.cmfrtVal,
    bExp: reqBody.bExp,
    bExpVal: reqBody.bExpVal,
    bvrgs: reqBody.bvrgs,
    bvrgsVal: reqBody.bvrgsVal,
    buffet: reqBody.buffet,
    buffetVal: reqBody.buffetVal,
    strs: reqBody.strs,
    strsVal: reqBody.strsVal,
    dsrts: reqBody.dsrts,
    dsrtsVal: reqBody.dsrtsVal,
    lveCntr: reqBody.lveCntr,
    lveCntrVal: reqBody.lveCntrVal,
    atntv: reqBody.atntv,
    atntvVal: reqBody.atntvVal,
    crts: reqBody.crts,
    crtsVal: reqBody.crtsVal,
    bilExp: reqBody.bilExp,
    bilExpVal: reqBody.bilExpVal,
    comments: reqBody.comments || '',

    uuType: userType,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum,
  }
}
