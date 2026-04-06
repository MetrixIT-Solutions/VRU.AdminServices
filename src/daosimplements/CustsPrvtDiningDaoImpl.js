
/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');
const commonSrvc = require('../services/CommonSrvc');
const userType = 'VRU';
var moment = require('moment');

const createPrivateDining = (reqBody, tData) => {
  const obj = privateDiningCreate(reqBody, tData);
  return obj;
};

const getPrivateDiningList = (tData, reqBody) => {
  const srchStr = reqBody.searchStr ? reqBody.searchStr : '';
  const branch = tData.ut == 'Branch' ?  tData.bid ? {branch: tData.bid} : {} : reqBody.branch ? {branch: reqBody.branch} : {};
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entityId ? { entId: reqBody.entityId } : {});  
  return {
    delFlag: false,
    bStatus: reqBody.status,
    ...branch,
    ...orgObj,
    ...entObj,
    $or: [
      { 'name': { $regex: srchStr, $options: 'i' } },
      { 'mobNum': { $regex: srchStr, $options: 'i' } },
      { 'emID': { $regex: srchStr, $options: 'i' } },
      { 'bookingId': { $regex: srchStr, $options: 'i' } }
    ]
  };
}

const privateDiningView = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  return { delFlag: false, _id: reqBody.id, ...orgObj, ...entObj, ...branchObj};
}

const privateDiningStatusUpdate = (reqBody, tData) => {
  const currentUTC = commonSrvc.currUTCObj();
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  const query = { delFlag: false, _id: reqBody.id, ...orgObj, ...entObj, ...branchObj };
  const updateObj = {
    bStatus: reqBody.status,
    uuType: 'Admin',
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }
  return { query, updateObj };
};

const postCustPrivateDiningCountByTime = (reqBody, tData, status) => {
  let dateFilter = prvtDinningByDate(reqBody);
  const branch = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch ? {branch: reqBody.branch} : {});
  const bStatus = status == 'Confirmed' ? {bStatus: 'Confirmed'} : status == 'Cancelled' ? {bStatus: 'Cancelled'} : status == 'Closed' ?  {bStatus: 'Closed'}: {};
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} :  (reqBody.entId ? {entId: reqBody.entId}: {});
return [
    {$match: { delFlag: false, ...orgObj, ...entObj, bDt: { $gte: dateFilter.date, $lte: dateFilter.date}, ...branch, ...bStatus }},
    {$group: { _id: '$bookingFor', count:{ $sum: 1}}},
  ];
}

const custPrivateDiningByTodayQry = (reqBody, tData) => {
  let startDay = moment.utc().startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  return  matchQuery('Today Bookings', startDay, orgObj, tData , reqBody)
}

const custPrivateDiningByWeekQry = (reqBody, tData) => {
  let startDay = moment.utc().startOf('week').format('YYYY-MM-DD HH:mm:ss');
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  return  matchQuery('Week Bookings', startDay, orgObj, tData, reqBody)
}

const custPrivateDiningByMonthQry = (reqBody, tData) => {
  let startDay = moment.utc().startOf('month').format('YYYY-MM-DD HH:mm:ss');
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  return  matchQuery('Month Bookings', startDay, orgObj, tData, reqBody);
}

const updatePrivateDining = (reqBody, tData) => {
 const data = updateData(reqBody, tData);
 return data;
}

const privateDiningLcsList = (pdId) => {  
  return { pdId, delFlag: false};
}

const privateDiningLcsCreate = (data, tData) => {
  const currentUTC = commonSrvc.currUTCObj();
  let obj = {
    ...data,
    _id: uuidv4(),
    pdId: data._id,

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
  }
  return obj;
}

const getPrivateDiningTotalList = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.orgId ? { orgId: reqBody.orgId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entityId?.length ? { entId: { $in: reqBody.entityId } } : {});
  const branch = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch?.length ? { branch: { $in: reqBody.branch } } : {});
  const slot = reqBody.slot ? { bookingFor: reqBody.slot } : {};
  let dateFilter = TbByDateType(reqBody);
  const project = {
    vegCount: 1, nonVegCount: 1, kidsCount: 1, bStatus: 1, infantsCount: 1, bookingFor: 1, bookingId: 1,
    orgId: 1, oName: 1, oCode: 1, entId: 1, eName: 1, eCode: 1, branch: 1, bCode: 1, bName: 1
  }
  const query = { delFlag: false, ...orgObj, ...entObj, ...branch, ...slot, bDt: { $gte: dateFilter.startDate, $lte: dateFilter.endDate } };
  return { query, project };
};

module.exports = {
  createPrivateDining, getPrivateDiningList, privateDiningView, privateDiningStatusUpdate, 
  postCustPrivateDiningCountByTime, custPrivateDiningByTodayQry, custPrivateDiningByWeekQry,
  custPrivateDiningByMonthQry, updatePrivateDining, privateDiningLcsList, privateDiningLcsCreate, getPrivateDiningTotalList
};

const privateDiningCreate = (reqBody, tData) => {
  const currentUTC = commonSrvc.currUTCObj();
  const number = reqBody.mobileNum.slice(6, 10);
  const date = new Date();
  const bookingT = reqBody.bTm;
  const convertTime12to24 = (time12h) => moment(time12h, 'hh:mm A').format('HH:mm');
  const dateTm = convertTime12to24(bookingT);
  const booking = reqBody.bDt;
  const bDtStr = booking + ' ' + dateTm;
  const time = (date.getHours() * 60)+date.getMinutes()+date.getSeconds();
  const currentDay = currentUTC.currUTCDayOfYear.toString();
  const day = (currentDay.length == 1 ? '00' + currentDay : currentDay.length == 2 ? '0' + currentDay : currentDay);
  const orgId = tData.ut === 'VRU' ? reqBody.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? reqBody.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? reqBody.oName : tData.on; 

  return {
    _id: uuidv4(),
    idSeq: {
      seq: 'IND' + 'TG' + 'HYD' + currentUTC.currUTCYear + currentUTC.currUTCMonth + currentUTC.currUTCDayOfYear,
      countryCode: 'IND',
      stateCode: 'TG',
      distCode: 'HYD',
      year: currentUTC.currUTCYear,
      month: currentUTC.currUTCMonth,
      day: currentUTC.currUTCDayOfYear
    },
    orgId, oCode, oName,
    entId: reqBody.entId,
    eCode:reqBody.eCode,
    eName: reqBody.eName,
    bookingId: (currentUTC.currUTCYear - 2022) + day + '-' + time + '-' + number,
    name: reqBody.name,
    mobCc: '+91',
    mobNum: reqBody.mobileNum,
    mobCcNum: reqBody.userID,
    emID: reqBody.emID || '',
    bookInfo: reqBody.bookInfo || '',
    bookingFor: reqBody.bookingFor,
    occassion: reqBody.oType,
    oType: reqBody.oType || '',

    vegCount: reqBody.vegCount || 0,
    nonVegCount: reqBody.nonVegCount || 0,
    kidsCount: reqBody.kidsCount || 0,
    tDinersCount: reqBody.guestCount || '',

    vegAmt: reqBody.vegPerPp || 0,
    nonVegAmt: reqBody.nonVegPerPp || 0,
    kidAmt: reqBody.kidsPerPp || 0,
    tDineAmt: reqBody.diningPrice || '',

    user: '',
    refUID: '',
    bStatus: 'Confirmed',

    branch: reqBody.branch,
    bCode: reqBody.bCode,
    bName: reqBody.bName, 

    bDt: reqBody.bDt,
    bTm: reqBody.bTm,
    bDtTm: new Date(bDtStr), bDtStr,
    country: 'India',
    countryCode: 'IND',
    state: 'Telangana',
    stateCode: 'TG',
    city: 'Hyderabad',
    cityCode: 'HYD',
    location: 'Kondapur',
    plusCode: { plusCode: 'F989+33 Hyderabad, Telangana' },
    geocoordinates: {
      type: 'Point',
      coordinates: [78.36768080, 17.46519563]
    },

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

const matchQuery = (id, date, orgObj, tData, reqBody) => {
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} : (reqBody.entityId ? {entId: tData.entityId}: {});
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch ? {branch: reqBody.branch} : {});

  return [
    {$match: { delFlag: false, ...orgObj, ...entObj, ...branchObj, cDtStr: {$gte: date }}},
    {$group: { _id: id, count:{ $sum: 1}}}
  ];
}

const updateData = (reqBody, tData) => {
  const currentUTC = commonSrvc.currUTCObj();
  const bookingT = reqBody.bTm;
  const convertTime12to24 = (time12h) => moment(time12h, 'hh:mm A').format('HH:mm');
  const dateTm = convertTime12to24(bookingT);
  const booking = reqBody.bDt;
  const bDtStr = booking + ' ' + dateTm;
  const orgId = tData.ut === 'VRU' ? reqBody.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? reqBody.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? reqBody.oName : tData.on; 
  return {
    orgId, oCode, oName,
    entId: reqBody.entId,
    eCode:reqBody.eCode,
    eName: reqBody.eName,

    name: reqBody.name,
    mobNum: reqBody.mobileNum,
    mobCcNum: reqBody.userID,
    emID: reqBody.emID || '',
    bookInfo: reqBody.bookInfo || '',
    bookingFor: reqBody.bookingFor,
    occassion: reqBody.oType,
    oType: reqBody.oType || '',

    vegCount: reqBody.vegCount || 0,
    nonVegCount: reqBody.nonVegCount || 0,
    kidsCount: reqBody.kidsCount || 0,
    tDinersCount: reqBody.guestCount || '',

    vegAmt: reqBody.vegPerPp || 0,
    nonVegAmt: reqBody.nonVegPerPp || 0,
    kidAmt: reqBody.kidsPerPp || 0,
    tDineAmt: reqBody.diningPrice || '',

    branch: reqBody.branch,
    bCode: reqBody.bCode,
    bName: reqBody.bName, 

    bDt: reqBody.bDt,
    bTm: reqBody.bTm,
    bDtTm: new Date(bDtStr), bDtStr,

    uuType: tData.ut || userType,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }

}

const prvtDinningByDate = (reqBody) => {
  var today = new Date();
  if (reqBody.dateType == 'Today') {
    const date =  moment(today).format('YYYY-MM-DD');
    return {date}
  } else if (reqBody.dateType == 'Tomorrow') {
    var tomorrow = today.setDate(today.getDate() + 1);
    const date = moment(tomorrow).format('YYYY-MM-DD');
    return {date}
  } else if (reqBody.dateType == 'Calendar') {
    const date = reqBody.startDate;
    return {date}
  }
}

const TbByDateType = (reqBody) => {
  var today = new Date();
  if (reqBody.dateType == 'Today') {
    const endDate = moment(today).format('YYYY-MM-DD')
    const startDate = moment(today).format('YYYY-MM-DD');
    return {endDate, startDate}
  } else if (reqBody.dateType == 'Tomorrow') {
    var tomorrow = today.setDate(today.getDate() + 1);
    const endDate = moment(tomorrow).format('YYYY-MM-DD')
    const startDate = moment(tomorrow).format('YYYY-MM-DD')
    return {endDate, startDate}
  } else if (reqBody.dateType == 'Calendar') {
    const endDate = moment(reqBody.startDate).format('YYYY-MM-DD')
    const startDate = moment(reqBody.startDate).format('YYYY-MM-DD');
    return {endDate, startDate}
  } else if (reqBody.dateType == 'Custom Dates') {
    const endDate = moment(reqBody.endDate).format('YYYY-MM-DD')
    const startDate = moment(reqBody.startDate).format('YYYY-MM-DD');
    return {endDate, startDate}
  }
}