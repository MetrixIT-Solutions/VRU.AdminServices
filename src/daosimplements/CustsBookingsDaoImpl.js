/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */
var moment = require('moment');
var { v4: uuidv4 } = require('uuid');

const userType = 'VRU';

const CommonSrvc = require('../services/CommonSrvc');

const userTableQry = (reqBody, data, tData) => {
  const {searchStr, type, bookingDay, startDate, branch, rFor, orgId, entId} = data;
  const srchStr = searchStr ? searchStr : '';
  const bStatus = (type == 'Confirmed' || type == 'Seated' || type == 'Waiting') ? { bStatus: type !== 'Upcoming' ? type : 'Confirmed' } : {};
  const bDt = bookingDay === 'Today' ? { bDt: { $gte: reqBody?.todayDate, $lte: reqBody?.todayDate } } : bookingDay === 'Tomorrow' ? { bDt: { $gte: reqBody?.tomorrowDate, $lte: reqBody?.tomorrowDate } } : bookingDay == 'Calendar' && startDate ? { bDt: { $gte: startDate, $lte: startDate } } : {};
  const diningType = rFor ? {rFor} : {};
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (orgId ? {orgId} : {});
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} : (entId ? { entId } : {});
  const qry = {
    delFlag: false,
    ...bDt,
    ...bStatus,
    ...branch,
    ...diningType,
    ...orgObj,
    ...entObj,
    $or: [
      { 'name': { $regex: srchStr, $options: 'i' } },
      { 'mobCcNum': { $regex: srchStr, $options: 'i' } },
      { 'emID': { $regex: srchStr, $options: 'i' } },
      { 'bookingId': { $regex: srchStr, $options: 'i' } }
    ]
  };
  const sortQuery = type == 'Upcoming' ? { cDtStr: -1 } : { bDtStr: 1 };
  return { qry, sortQuery };
}

const custBkngTble = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  return { delFlag: false, _id: reqBody.id, ...orgObj, ...entObj, ...branchObj};
}

const bkngStatusUpdate = (reqBody, tData) => {
  const currentDt = CommonSrvc.currUTCObj();
  return {
    bStatus: reqBody.status,
    uuType: 'Admin',
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentDt.currUTCDtTm,
    uDtStr: currentDt.currUTCDtTmStr,
    uDtNum: currentDt.currUTCDtTmNum
  };
}

const setTableData = (data, tData, status) => {
  return getTableData(data, tData, status);
}

const custTbDshbrdLnchQry = (reqBody, tData, bStatus) => {
  const branch = reqBody.branch ? {branch: reqBody.branch} : tData.bid ? {branch: tData.bid} : {}
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} : (reqBody.entId ? {entId: reqBody.entId} : {});
  let dateFilter = TbByDateType(reqBody);
  return [
    { $match: { delFlag: false, ...orgObj,  ...entObj, bDt: { $gte: dateFilter.startDate, $lte: dateFilter.endDate }, ...branch } },
     { $group: { _id: bStatus ? {rFor: '$rFor', bStatus: '$bStatus'} : '$rFor', count: { $sum: 1 }, veg: { $sum: '$vegCount' }, nonVeg: { $sum: '$nonVegCount' }, kids: { $sum: '$kidsCount' } } }
  ];
}

const custTableBkngByTodayQry = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});

  let startDay = moment.utc().startOf('day').format('YYYY-MM-DD HH:mm:ss');
  return matchQuery('Today Bookings', startDay, orgObj, tData)
}

const custTableBkngByWeekQry = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  let startDay = moment.utc().startOf('week').format('YYYY-MM-DD HH:mm:ss');
  return matchQuery('Week Bookings', startDay, orgObj, tData)
}
const custTableBkngByMonthQry = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  let startDay = moment.utc().startOf('month').format('YYYY-MM-DD HH:mm:ss');
  return matchQuery('Month Bookings', startDay, orgObj, tData);
}

const createBooking = (reqBody, tData) => {
  const data = createTableData(reqBody, tData);
  return data
}

const createUser = (reqBody, tData) => {
  const data = createUserData(reqBody, tData);
  return data
}

const postCustUserInfoCreate = (resObj) => {
  const data = createUserInfo(resObj);
  return data
}

const updateUserInfoBkngsCount = (obj) => {
  const data = obj.bStatus == 'Confirmed' ? { bCount: +1, cnfrmdbCount: +1 } : { bCount: +1, clsdbCount: +1 }
  const query = { delFlag: false, myPrimary: obj.orgId + '__' + obj.mobileNum }
  const updateObj = {
    ...data
  }
  return { query, updateObj }
}

const usrInfoQry = (reqBody) => {
  return { user: reqBody.user }
}

const setUserInfoObj = (oldStatus, status) => {
  const olStsCnt = oldStatus == 'Confirmed' ? { cnfrmdbCount: -1 } : oldStatus == 'Completed' ? { clsdbCount: -1 } : oldStatus == 'Cancelled' ? { cncldbCount: -1 } : oldStatus == 'No Show' ? { abCount: -1 } : {};
  const sts = status == 'Confirmed' ? { cnfrmdbCount: 1 } : status == 'Completed' ? { clsdbCount: 1 } : status == 'Cancelled' ? { cncldbCount: 1 } : status == 'No Show' ? { abCount: 1 } : {};
  return {
    ...olStsCnt,
    ...sts
  }
}

const postCustTableBookingView = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  return { delFlag: false, _id: reqBody.id, ...orgObj, ...entObj, ...branchObj }
}

const postCustTableBookingUpdate = (reqBody, tokenData) => {
  const data = tableBookingUpdate(reqBody, tokenData);
  return data
}

const getTotalCount = (data, tData) => {
  const {bookingDay, startDate, statusValue, branch, orgId, entId} = data;
  var today = new Date();
  var todayDate = moment(today).format('YYYY-MM-DD');
  var tomorrow = today.setDate(today.getDate() + 1);
  var tomorrowDate = moment(tomorrow).format('YYYY-MM-DD');
  const bDt = bookingDay === 'Today' ? { bDt: { $gte: todayDate, $lte: todayDate } } : bookingDay === 'Tomorrow' ? { bDt: { $gte: tomorrowDate, $lte: tomorrowDate } } : bookingDay == 'Calendar' && startDate ? { bDt: { $gte: startDate, $lte: startDate } } : {};
  const status = (statusValue == 'Confirmed' || statusValue == 'Seated' || statusValue == 'Waiting' || statusValue == 'Upcoming' ? true : false);
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (orgId ? {orgId} : {});
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} :  (entId ? {entId} : {});

  if (status) {
    return [
      { $match: { delFlag: false, ...orgObj, ...entObj, ...bDt, ...branch } },
      { $group: { _id: '$bStatus', veg: { $sum: '$vegCount' }, nonVeg: { $sum: '$nonVegCount' }, kids: { $sum: '$kidsCount' } } },
    ];
  } else {
    return [
      { $match: { delFlag: false, ...orgObj, ...entObj, ...bDt, ...branch } },
      { $group: { _id: bookingDay, veg: { $sum: '$vegCount' }, nonVeg: { $sum: '$nonVegCount' }, kids: { $sum: '$kidsCount' } } },
    ];
  }
} 

const getDineTypeCount = (bookingDay, startDate, branch, orgId, entId, tData) => {
  var today = new Date();
  var todayDate = moment(today).format('YYYY-MM-DD');
  var tomorrow = today.setDate(today.getDate() + 1);
  var tomorrowDate = moment(tomorrow).format('YYYY-MM-DD');
  const bDt = bookingDay === 'Today' ? { bDt: { $gte: todayDate, $lte: todayDate } } : bookingDay === 'Tomorrow' ? { bDt: { $gte: tomorrowDate, $lte: tomorrowDate } } : bookingDay == 'Calendar' && startDate ? { bDt: { $gte: startDate, $lte: startDate } } : {};
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (orgId ? {orgId} : {});
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} :  (entId ? {entId} : {});

  return [
    { $match: { delFlag: false, ...bDt, ...orgObj, ...entObj, ...branch } },
    { $group: { _id: '$rFor', veg: { $sum: '$vegCount' }, nonVeg: { $sum: '$nonVegCount' }, kids: { $sum: '$kidsCount' } } },
  ];
} 

const postCustTableBookingsCountByCalendar = (reqBody, tData) => {
  const bDt = reqBody.status == 'Completed' || reqBody.status == 'No Show' || reqBody.status == 'Cancelled' ? { bDt: { $lte: reqBody.endDate } } : { bDt: { $gte: reqBody.startDate, $lte: reqBody.endDate } };
  const status = reqBody.status == 'Confirmed' || reqBody.status == 'Seated' || reqBody.status == 'Waiting' ? {bStatus: reqBody.status} : {};
  const branch = tData.ut == 'Board' || tData.ut == 'VRU' ? reqBody.branch ? {branch: reqBody.branch} : {} : tData.bid ? {branch: tData.bid} : {};
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} :  (reqBody.entityId ? {entId: reqBody.entityId} : {});

  return [
    { $match: { delFlag: false, ...bDt, ...orgObj, ...entObj, ...status, ...branch} },
    { $group: { _id: '$bDt', veg: { $sum: '$vegCount' }, nonVeg: { $sum: '$nonVegCount' }, kids: { $sum: '$kidsCount' } } },
  ];
}

const closedBkTables = () => {
  return { delFlag: false, bStatus: 'Seated' }
}

const confimedBooking = () => {
  const dt = moment().subtract(2, 'days').format()
  const query = { bStatus: 'Confirmed', cDtStr: { $lte: dt } }
  return query;
}

const removeBookingIdTable = (id) => {
  const query = { _id: { $in: id }, delFlag: false }
  return query;
}


const updateBktableStatus = (id, data, bStatus) => {
  const currentDt = CommonSrvc.currUTCObj();

  const query = { _id: { $in: id }, delFlag: false }

  const updateObj = {
    bStatus,
    uuType: data.uuType,
    uUser: data.uUser,
    uuName: data.uuName,
    uDtTm: currentDt.currUTCDtTm,
    uDtStr: currentDt.currUTCDtTmStr,
    uDtNum: currentDt.currUTCDtTmNum
  }
  return { query, updateObj };
}

const createExcelBooking = (reqBody, tData) => {
  const data = createExcelTableData(reqBody, tData);
  return data
}

const getUserData = (reqBody) => {
  const query = { mobNum: reqBody.MobileNumber }
  return query;
  }


const oebUpdateQuery = (reqBody, tData) => {
  const query = { delFlag: false, refUID: reqBody.refUID };
  const currentUTC = CommonSrvc.currUTCObj();
  const updateData = {
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
  const pushObj = {};
  if (reqBody.oeId) {
    pushObj.oeIds = reqBody.oeId;
  }
  if (reqBody?.oebInfo?.branch) {
    pushObj.oebIds = reqBody.oebInfo?.branch;
  }
  if (reqBody?.oebInfo?.branch) {
    pushObj.oebInfo = { _id: uuidv4(), ...reqBody.oebInfo };
  }
  const updateQuery = Object.keys(pushObj).length > 0 && reqBody?.oebInfo?.branch ? {$set: updateData, $push: pushObj} : null;
  return { query, updateQuery };
};

const getLfcsData = (bId) => {
  return { delFlag: false, bId}
}

const createCustTableBookingLcs = (data, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    ...data,
    _id: uuidv4(),
    bId: data._id,
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

const getBkngsTotalList = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.orgId ? { orgId: reqBody.orgId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entityId?.length ? { entId: { $in: reqBody.entityId } } : {});
  const branch = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch?.length ? { branch: { $in: reqBody.branch } } : {});
  const slot = reqBody.slot ? { rFor: reqBody.slot } : {};
  let dateFilter = TbByDateType(reqBody);
  const project = {
    vegCount: 1, nonVegCount: 1, kidsCount: 1, bStatus: 1, infantsCount: 1, rFor: 1, bookingId: 1,
    orgId: 1, oName: 1, oCode: 1, entId: 1, eName: 1, eCode: 1, branch: 1, bCode: 1, bName: 1
  }
  const query = { delFlag: false, ...orgObj, ...entObj, ...branch, ...slot, bDt: { $gte: dateFilter.startDate, $lte: dateFilter.endDate } };
  return { query, project };
};

module.exports = {
  userTableQry, custBkngTble, bkngStatusUpdate, setTableData, custTbDshbrdLnchQry,
  custTableBkngByTodayQry, custTableBkngByWeekQry,
  custTableBkngByMonthQry, createBooking, createUser, postCustUserInfoCreate,
  updateUserInfoBkngsCount, usrInfoQry, setUserInfoObj, postCustTableBookingView,
  postCustTableBookingUpdate, getTotalCount, getDineTypeCount, postCustTableBookingsCountByCalendar, closedBkTables,
  confimedBooking, removeBookingIdTable, updateBktableStatus, createExcelBooking, getUserData, oebUpdateQuery, getLfcsData,
  createCustTableBookingLcs, getBkngsTotalList
};

const getTableData = (data, tData, status) => {
  const currentDt = CommonSrvc.currUTCObj();
  const bStatus = status ? { bStatus: status } : {};
  return {
    _id: data._id,
    idSeq: data.idSeq,
    orgId: data.orgId,
    oName: data.oName,
    oCode: data.oCode,
    entId: data.entId,
    eName: data.eName,
    eCode: data.eCode,
    user: data.user,
    refUID: data.refUID,
    bookingId: data.bookingId,
    name: data.name,
    altCntPerson: data.altCntPerson,
    mobCc: data.mobCc,
    mobNum: data.mobNum,
    mobCcNum: data.mobCcNum,
    altMobCc: data.altMobCc, 
    altMobNum: data.altMobNum,
    altMobCcNum: data.altMobCcNum,
    emID: data.emID,
    bookInfo: data.bookInfo,
    occassion: data.occassion,
    oType: data.oType,
    bookType: data.bookType,
    branch: data.branch,
    bCode: data.bCode,
    bName: data.bName,
    vegCount: data.vegCount,
    vegAmt: data.vegAmt,
    nonVegCount: data.nonVegCount,
    nonVegAmt: data.nonVegAmt,
    kidsCount: data.kidsCount,
    kidAmt: data.kidAmt,
    infantsCount: data.infantsCount,
    infantAmt: data.infantAmt,
    
    totalAmt: data.totalAmt,
    dAmount: data.dAmount,
    netAmt: data.netAmt,
    gst: data.gst,
    gstAmt: data.gstAmt,
    serTax: data.serTax,
    serTaxAmt: data.serTaxAmt,
    netTotalAmt: data.netTotalAmt,

    actGst: data.actGst,
    actGstAmt: data.actGstAmt,
    actSerTax: data.actSerTax,
    actSerTaxAmt: data.actSerTaxAmt,
    actTotalNetAmt: data.actTotalNetAmt,
    totalSaving: data.totalSaving,

    bDtTm: data.bDtTm,
    bDt: data.bDt,
    bTm: data.bTm,
    bDtStr: data.bDtStr,
    ...bStatus,
    dp: data.dp,
    rFor: data.rFor ? data.rFor : '',
    country: data.country,
    countryCode: data.countryCode,
    state: data.state,
    stateCode: data.stateCode,
    city: data.city,
    cityCode: data.cityCode,
    location: data.location,
    plusCode: data.plusCode,
    geocoordinates: data.geocoordinates,
    cuType: data.cuType,
    cUser: data.cUser,
    cuName: data.cuName,
    cDtTm: data.cDtTm,
    cDtStr: data.cDtStr,
    cDtNum: data.cDtNum,
    uuType: 'Admin',
    uUser: tData.iss ? tData.iss : data.uUser,
    uuName: tData.un ? tData.un : data.uuName,
    uDtTm: currentDt.currUTCDtTm,
    uDtStr: currentDt.currUTCDtTmStr,
    uDtNum: currentDt.currUTCDtTmNum
  };
}

const matchQuery = (id, date, orgObj, tData) => {
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} :  {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  return [
    { $match: { delFlag: false, ...orgObj, ...entObj, ...branchObj, cDtStr: { $gte: date } } },
    { $group: { _id: id, count: { $sum: 1 } } }
  ];
}

const createTableData = (reqBody, tokenData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const number = reqBody.mobileNum.slice(6, 10);
  const date = new Date();
  const bookingT = reqBody.bTm;
  const convertTime12to24 = (time12h) => moment(time12h, 'hh:mm A').format('HH:mm');
  const dateTm = convertTime12to24(bookingT);
  const booking = reqBody.bDt;
  const bDtStr = booking + ' ' + dateTm;
  const time = (date.getHours() * 60) + date.getMinutes() + date.getSeconds();
  const currentDay = currentUTC.currUTCDayOfYear.toString();
  const day = (currentDay.length == 1 ? '00' + currentDay : currentDay.length == 2 ? '0' + currentDay : currentDay);
  const orgId = tokenData.ut === 'VRU' ? reqBody.orgId : tokenData.oid;
  const oCode = tokenData.ut === 'VRU' ? reqBody.oCode : tokenData.oc;
  const oName = tokenData.ut === 'VRU' ? reqBody.oName : tokenData.on; 

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
    eName: reqBody.eName,
    eCode: reqBody.eCode,
    bookingId: (currentUTC.currUTCYear - 2022) + day + '-' + time + '-' + number,
    name: reqBody.name,
    altCntPerson: reqBody.altCntctPrsn ? reqBody.altCntctPrsn : '',
    mobCc: '+91',
    mobNum: reqBody.mobileNum,
    mobCcNum: reqBody.userID,
    altMobCc:  reqBody.altMobNum ? '+91' : '',
    altMobNum: reqBody.altMobNum ? reqBody.altMobNum : '',
    altMobCcNum: reqBody.altMobCcNum ? reqBody.altMobCcNum : '',
    emID: reqBody.emID || '',
    bookInfo: reqBody.bookInfo || '',
    occassion: reqBody.oType || '',
    oType: reqBody.oType || '',
    bookType: reqBody.bookType,

    branch: reqBody.branch || '',
    bCode: reqBody.bCode || '',
    bName: reqBody.bName || '',

    user: reqBody.user,
    refUID: reqBody.refUID,
    bStatus: reqBody.bStatus,

    vegCount: reqBody.vegCount || 0,
    vegAmt: reqBody.vegAmt || 0,
    nonVegCount: reqBody.nonVegCount || 0,
    nonVegAmt: reqBody.nonVegAmt || 0,
    kidsCount: reqBody.kidsCount || 0,
    kidAmt: reqBody.kidsAmt || 0,
    infantsCount: reqBody.infantsCount || 0,
    infantAmt: reqBody.infantAmt || 0,

    totalAmt: reqBody.totalAmt,
    dAmount: reqBody.dAmount || 0,
    netAmt: reqBody.netAmt,
    gst: reqBody.gst || 0,
    gstAmt: reqBody.gstAmt || 0,
    serTax: reqBody.serTax || 0,
    serTaxAmt: reqBody.serTaxAmt || 0,
    netTotalAmt: reqBody.netTotalAmt || 0,

    actGst: reqBody.actGst || 0,
    actGstAmt: reqBody.actGstAmt || 0,
    actSerTax: reqBody.actSerTax || 0,
    actSerTaxAmt: reqBody.actSerTaxAmt || 0,
    actTotalNetAmt: reqBody.actTotalNetAmt || 0,
    totalSaving: reqBody.totalSaving || 0,

    dp: reqBody.dp || 0,
    rFor: reqBody.rFor,

    bDt: reqBody.bDt,
    bTm: reqBody.bTm,
    bDtTm: new Date(bDtStr), bDtStr,
    country: 'India',
    countryCode: 'IND',
    state: 'Telangana',
    stateCode: 'TG',
    city: 'Hyderabad',
    cityCode: 'HYD',
    location: 'BBQH - Kondapur',
    plusCode: { plusCode: 'F989+33 Hyderabad, Telangana' },
    geocoordinates: {
      type: 'Point',
      coordinates: [78.36768080, 17.46519563]
    },

    cuType: tokenData.ut || userType,
    cUser: tokenData.iss,
    cuName: tokenData.un,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: tokenData.ut || userType,
    uUser: tokenData.iss,
    uuName: tokenData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}


const createUserData = (reqBody, tokenData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const refUID = generateRefuid(reqBody);
  const sName = reqBody.name.split(' ');
  const _id = uuidv4();
  const orgId = tokenData.ut === 'VRU' ? reqBody.orgId : tokenData.oid;
  const oCode = tokenData.ut === 'VRU' ? reqBody.oCode : tokenData.oc;
  const oName = tokenData.ut === 'VRU' ? reqBody.oName : tokenData.on;

  return {
    _id,
    idSeq: {
      seq: 'IND' + currentUTC.currUTCYear + currentUTC.currUTCMonth + currentUTC.currUTCDayOfYear,
      countryCode: 'IND',
      year: currentUTC.currUTCYear,
      month: currentUTC.currUTCMonth,
      day: currentUTC.currUTCDayOfYear
    },

    orgId, oCode, oName,
    oeIds: [reqBody.entId],
    oebIds: [reqBody.branch],
    oebInfo: [{
      _id:  uuidv4(),
      entId: reqBody.entId || '', 
      eName: reqBody.eName || '',
      eCode: reqBody.eCode || '',
      branch: reqBody.branch || '',
      bCode: reqBody.bCode || '',
      bName: reqBody.bName || '',
    }],

    name: reqBody.name,
    sName: sName[0],
    mobCc: '+91',
    mobNum: reqBody.mobileNum,
    mobCcNum: reqBody.userID,
    emID: reqBody.emailId || '',
    name: reqBody.name,
    sName: sName[0],
    refUID,
    myPrimary: orgId + '__' + reqBody.mobileNum,
    mpType: 'Mobile',
    mpVerifyFlag: false,
    dob: '',
    dobStr: '',

    uStatus: 'Active',

    cuType: 'Customer',
    cUser: _id,
    cuName: reqBody.name,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: 'Customer',
    uUser: _id,
    uuName: reqBody.name,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const generateRefuid = (reqBody) => {
  const name = reqBody.name.replace(/\s+/g, '').toUpperCase();
  const date = new Date();
  const time = ((date.getHours()) * (60)) + (date.getMinutes());
  const rdmStr = CommonSrvc.randomStrGen(name, 3);
  const rdmStr2 = CommonSrvc.randomStrGen(reqBody.mobileNum, 4);
  const yr = CommonSrvc.currUTCObj().currUTCYear - 2024
  const code = yr + rdmStr2 + rdmStr + time;
  return code;
}


const createUserInfo = (resObj) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    _id: resObj._id,

    user: resObj._id,
    orgId: resObj.orgId,
    oName: resObj.oName,
    oCode: resObj.oCode,
    refUID: resObj.refUID,
    myPrimary: resObj.myPrimary,
    uStatus: 'Active',

    cuType: resObj.cuType,
    cUser: resObj.cUser,
    cuName: resObj.cuName,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: resObj.uuType,
    uUser: resObj.uUser,
    uuName: resObj.uuName,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }
}

const tableBookingUpdate = (reqBody, tokenData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const bookingT = reqBody.bTm;
  const convertTime12to24 = (time12h) => moment(time12h, 'hh:mm A').format('HH:mm');
  const dateTm = convertTime12to24(bookingT);
  const booking = reqBody.bDt;
  const bDtStr = booking + ' ' + dateTm;
  const orgId = tokenData.ut === 'VRU' ? reqBody.orgId : tokenData.oid;
  const oCode = tokenData.ut === 'VRU' ? reqBody.oCode : tokenData.oc;
  const oName = tokenData.ut === 'VRU' ? reqBody.oName : tokenData.on;
  return {
    orgId, oCode, oName,
    entId: reqBody.entId,
    eName: reqBody.eName,
    eCode: reqBody.eCode,
    name: reqBody.name,
    mobNum: reqBody.mobileNum,
    mobCcNum: reqBody.userID,
    emID: reqBody.emID,
    bookInfo: reqBody.bookInfo,
    occassion: reqBody.oType,
    oType: reqBody.oType || '',
    bookType: reqBody.bookType,

    branch: reqBody.branch,
    bCode: reqBody.bCode,
    bName: reqBody.bName,

    vegCount: reqBody.vegCount,
    vegAmt: reqBody.vegAmt,
    nonVegCount: reqBody.nonVegCount,
    nonVegAmt: reqBody.nonVegAmt,
    kidsCount: reqBody.kidsCount,
    kidAmt: reqBody.kidsAmt,
    infantsCount: reqBody.infantsCount,
    infantAmt: reqBody.infantAmt,

    totalAmt: reqBody.totalAmt,
    dAmount: reqBody.dAmount,
    netAmt: reqBody.netAmt,
    gst: reqBody.gst,
    gstAmt: reqBody.gstAmt,
    serTax: reqBody.serTax,
    serTaxAmt: reqBody.serTaxAmt,
    netTotalAmt: reqBody.netTotalAmt,

    actGst: reqBody.actGst,
    actGstAmt: reqBody.actGstAmt,
    actSerTax: reqBody.actSerTax,
    actSerTaxAmt: reqBody.actSerTaxAmt,
    actTotalNetAmt: reqBody.actTotalNetAmt,
    totalSaving: reqBody.totalSaving,

    bDt: reqBody.bDt,
    bTm: reqBody.bTm,
    bDtTm: new Date(bDtStr), bDtStr,
    rFor : reqBody.rFor,

    dp: reqBody.dp,
    dAmount: reqBody.dAmount,

    uUser: tokenData.iss,
    uuName: tokenData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }
}

const createExcelTableData = (reqBody, tokenData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const mob = '+91'+ reqBody.MobileNumber;
  const number = mob.slice(6,10);
  const date = new Date();
  const bookingT = reqBody.BookingTime;
  const convertTime12to24 = (time12h) => moment(time12h, 'hh:mm A').format('HH:mm');
  const dateTm = convertTime12to24(bookingT);
  const booking = reqBody.BookingDate;
  const bDtStr = booking + ' ' + dateTm;
  const time = (date.getHours() * 60) + date.getMinutes() + date.getSeconds();
  const currentDay = currentUTC.currUTCDayOfYear.toString();
  const day = (currentDay.length == 1 ? '00' + currentDay : currentDay.length == 2 ? '0' + currentDay : currentDay);
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
    bookingId: (currentUTC.currUTCYear - 2022) + day + '-' + time + '-' + number,
    name: reqBody.Name,
    mobCc: '+91',
    mobNum: reqBody.MobileNumber,
    mobCcNum: '+91'+reqBody.MobileNumber,
    emID: reqBody.Email || '',
    bookInfo: reqBody.Message || '',
    occassion: reqBody.OccationType || '',
    oType: reqBody.OccationType,
    bookType: reqBody.BookingType,

    branch: reqBody._id || '',
    bCode: reqBody.bCode || '',

    user: tokenData.iss,
    refUID: tokenData.iss || '',
    bStatus: reqBody.BookingStatus,

    vegCount: reqBody.VegCount || 0,
    vegAmt: reqBody.vegAmount || 0,
    nonVegCount: reqBody.NonVegCount || 0,
    nonVegAmt: reqBody.NonVegAmount || 0,
    kidsCount: reqBody.KidsCount || 0,
    kidAmt: reqBody.KidsAmt || 0,
    infantsCount: reqBody.infantsCount || 0,
    infantAmt: reqBody.infantAmt || 0,
    netAmt: reqBody.NetAmount,
    gst: reqBody.gst || 0,
    gstAmt: reqBody.gstAmt || 0,
    serTax: reqBody.serTax || 0,
    totalAmt: reqBody.TotalAmount,
    actNetAmt: reqBody.TotalAmount,
    actGst: reqBody.actGst || 0,
    actGstAmt: reqBody.actGstAmt || 0,
    actSerTax: reqBody.actSerTax || 0,
    actTotalAmt: reqBody.ActTotalAmount || 0,

    dp: reqBody.DiscountPersont || 0,
    dAmount: reqBody.DiscountAmount || 0,

    bDt: reqBody.BookingDate,
    bTm: reqBody.BookingTime,
    bDtTm: new Date(bDtStr), bDtStr,
    country: 'India',
    countryCode: 'IND',
    state: 'Telangana',
    stateCode: 'TG',
    city: 'Hyderabad',
    cityCode: 'HYD',
    location: 'BBQH - Kondapur',
    plusCode: { plusCode: 'F989+33 Hyderabad, Telangana' },
    geocoordinates: {
      type: 'Point',
      coordinates: [78.36768080, 17.46519563]
    },

    cuType: tokenData.ut || userType,
    cUser: tokenData.iss,
    cuName: tokenData.un,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: tokenData.ut || userType,
    uUser: tokenData.iss,
    uuName: tokenData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
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