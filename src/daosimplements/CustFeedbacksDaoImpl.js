/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const { v4: uuidv4 } = require('uuid');
const config = require('config');

const CommonSrvc = require('../services/CommonSrvc');

const userfdbkQry = (reqBody, tData) => {
  let dateTimeObj = CommonSrvc.getDateTimeObjByDateType(reqBody);
  let dateFilterQuery = dateTypeFilterQuery(dateTimeObj);
  const branch = tData.ut == 'Branch' ? {branch: tData?.bid || 'NA'} : {};
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} : (reqBody.entityId ? {entId: reqBody.entityId} : {});
  const branchObj = tData.ut == 'Branch' ? {branch: tData.bid} : (reqBody.branch ? {branch: reqBody.branch} : {});
 
  return { delFlag: false, ...orgObj, ...entObj, ...branchObj, ...dateFilterQuery, ...branch, $or: [
    { 'name': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'mobCcNum': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'emID': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'ratingStr': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'feedback': { $regex: reqBody.searchStr, $options: 'i' } }
  ]};
}

const userfdbkCreateQry = (reqBody, tData) => {
  return setFdbkCreateData(reqBody, tData);
}

module.exports = {
  userfdbkQry, userfdbkCreateQry
};

const dateTypeFilterQuery = (dateTimeObj)  => {
  if (dateTimeObj.dateType == 'Today') {
    return { 'cDtStr': { $gte: dateTimeObj.startTime } };
  } else if (dateTimeObj.dateType == 'default') {
    return {};
  } else {
    return { 'cDtStr': { $gte: dateTimeObj.startTime, $lte: dateTimeObj.endTime } };
  }
}

const setFdbkCreateData = (reqBody, tData) => {
  const currentDt = CommonSrvc.currUTCObj();
  const orgId = tData.ut === 'VRU' ? reqBody.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? reqBody.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? reqBody.oName : tData.on;

  return {
    _id: uuidv4(),
    idSeq: {
      seq: 'IND' + currentDt.currUTCDayOfYear + currentDt.currUTCMonth + currentDt.currUTCDay,
      countryCode: 'IND',
      year: currentDt.currUTCYear,
      month: currentDt.currUTCMonth,
      day: currentDt.currUTCDay
    },

    orgId, oCode, oName,
    entId: reqBody.entId,
    eName: reqBody.eName,
    eCode: reqBody.eCode,
    branch: reqBody.branch || '',
    bCode: reqBody.bCode || '',
    bName: reqBody.bName || '',

    user: reqBody.user || '',
    refUID: reqBody.refUID || '',
    booking: reqBody.booking || '',
    bookingId: reqBody.bookingId || '',

    name: reqBody.name,
    mobCc: reqBody.mobCc,
    mobNum: reqBody.mobNum,
    mobCcNum: `${reqBody.mobCc}${reqBody.mobNum}`,
    emID: reqBody.emID || '',

    rating: reqBody.rating,
    fRating: reqBody.fRating || 0,
    sRating: reqBody.sRating || 0,
    aRating: reqBody.aRating || 0,
    pRating: reqBody.pRating || 0,
    ratingStr: reqBody.rating.toString(),
    feedback: reqBody.feedback || '',

    dob: reqBody.dob || null,
    dobStr: reqBody.dobStr || '',
    anvsrDt: reqBody.anvsrDt || null,
    anvsrDtStr: reqBody.anvsrDtStr || '',
    fgDt: reqBody.fgDt || null,
    fgDtStr: reqBody.fgDtStr || '',
    opDt: reqBody.opDt || null,
    opDtStr: reqBody.opDtStr || '',
    ccDt: reqBody.ccDt || null,
    ccDtStr: reqBody.ccDtStr || '',

    qa: reqBody.qa,

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
};