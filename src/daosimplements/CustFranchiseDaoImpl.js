/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');
var moment = require('moment');

const CommonSrvc = require('../services/CommonSrvc');

const userfrnchQry = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} :  (reqBody.entityId ? {entId: reqBody.entityId} : {});

  return { delFlag: false, ...orgObj, ...entObj, fStatus: reqBody.status, $or: [
    { 'name': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'mobCcNum': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'emID': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'fReqID': { $regex: reqBody.searchStr, $options: 'i' } }
  ]};
}

const userfrnchViewQry = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.oId ? {orgId: reqBody.oId} : {});
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} :  {};

  return { delFlag: false, _id: reqBody.id, ...orgObj, ...entObj };
}

const frnchStsUpdObj = (reqBody, tData) => {
  const currentDt = CommonSrvc.currUTCObj();
  return {
    notes: reqBody.notes,
    fStatus: reqBody.status,
    uuType: 'Admin',
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentDt.currUTCDtTm,
    uDtStr: currentDt.currUTCDtTmStr,
    uDtNum: currentDt.currUTCDtTmNum
  };
}

const postAdminUserfrnchCountByStatus = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} : (reqBody.entId ? {entId: reqBody.entId} : {}); {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch ? {branch: reqBody.branch} : {}); {};
  let dateFilter = TbByDateType(reqBody);
  return [
    {$match: { delFlag: false, ...orgObj, ...entObj, ...branchObj, cDtStr: { $gte: dateFilter.startDate, $lte: dateFilter.endDate }}},
    {$group: { _id: '$fStatus', count:{ $sum: 1}}},
  ];
}

const setFrnchCreateObj = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid, oCode: tData.oc, oName: tData.on} : {orgId: reqBody.orgId, oCode: reqBody.oCode, oName: reqBody.oName};
  const entObj = (tData.ut == 'Entity') ? {entId: tData.ent, eName: tData.en, eCode: tData.ec} : {entId: reqBody.entId, eName: reqBody.eName, eCode: reqBody.eCode};
  const newFrnchObj = setCustFrnchsDataObj(reqBody, tData);
  return { ...orgObj, ...entObj, ...newFrnchObj};
}

module.exports = {
  userfrnchQry, userfrnchViewQry, frnchStsUpdObj, postAdminUserfrnchCountByStatus, setFrnchCreateObj
};

const setCustFrnchsDataObj = (reqBody, tData) => {
  const currentDt = CommonSrvc.currUTCObj();
  const name = reqBody.name.replace(/\s+/g, '').toUpperCase();
  const str = CommonSrvc.randomStrGen(reqBody.mobNum + name, 4);
  const fReqID = `FRNCHS-${str}-${currentDt.currUTCStr}`;

  return {
    _id: uuidv4(),
    idSeq: {
      seq: 'IND' + currentDt.currUTCDayOfYear + currentDt.currUTCMonth + currentDt.currUTCDay, // Country, State and Dist Code and Year(2022) Moth(10) Day(10)
      countryCode: 'IND',
      year: currentDt.currUTCYear,
      month: currentDt.currUTCMonth,
      day: currentDt.currUTCDay
    },
    fReqID,
    name: reqBody.name,
    mobCc: reqBody.mobCc,
    mobNum: reqBody.mobNum,
    mobCcNum: `${reqBody.mobCc}${reqBody.mobNum}`,
    emID: reqBody.emID ? reqBody.emID : '',
    fState: reqBody.fState,
    fStateCode: reqBody.fStateCode,
    fCity: reqBody.fCity,
    fArea: reqBody.fArea,
    fPincode: reqBody.fPincode,
    fStatus: 'Requested',
    notes: reqBody.notes ? reqBody.notes : '',

    delFlag: false,
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
  };
}


const TbByDateType = (reqBody) => {
  var today = new Date();
  if (reqBody.dateType == 'Today') {
    const endDate = moment(today).format('YYYY-MM-DD 23:59:59')
    const startDate = moment(today).format('YYYY-MM-DD 00:00:00');
    return {endDate, startDate}
  } else if (reqBody.dateType == 'Tomorrow') {
    var tomorrow = today.setDate(today.getDate() + 1);
    const endDate = moment(tomorrow).format('YYYY-MM-DD 23:59:59')
    const startDate = moment(tomorrow).format('YYYY-MM-DD 00:00:00')
    return {endDate, startDate}
  } else if (reqBody.dateType == 'Calendar') {
    const endDate = moment(reqBody.startDate).format('YYYY-MM-DD 23:59:59')
    const startDate = moment(reqBody.startDate).format('YYYY-MM-DD 00:00:00');
    return {endDate, startDate}
  }
}