/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');
const commonSrvc = require('../services/CommonSrvc');
var moment = require('moment');

const uD = { iss: 'VRUAUID10001', cuName: 'VRU', uType: 'Customer' }

const getCustsBranchesList = (reqBody) => {
  return { delFlag: false, bStatus: 'Active', oCode: reqBody.oCode, eCode: reqBody.eCode }
};

const createCateringSrvc = (reqBody, bData) => {
  return setCateringCreate(reqBody, bData);
};

const createCustsContact = (reqBody, bData) => {
  return custsContactCreate(reqBody, bData);
};

const getCustsOffersList = (reqBody) => {
  const date = moment.utc().format('YYYY-MM-DD');
  return { delFlag: false, oStatus: 'Active', sDtStr: { $lte: date }, $or: [{ eDtStr: { $gte: date } }, { eDtStr: { $in: ['', null] } }], oCode: { $in: [reqBody.oCode, '', null] }, eCode: { $in: [reqBody.eCode, '', null] }, bCode: { $in: [reqBody.bCode, '', null] } };
}

const createPrivateDining = (reqBody, bData, uRes) => {
  const uData = uRes?._id ? uRes : { }
  return privateDiningCreate(reqBody, bData, uData);
};

const getBranchQuery = (body) => ({ delFlag: false, oCode: body.oCode, eCode: body.eCode, bCode: body.bCode });
const createTableBkg = (reqBody, bData, tData) => {
  return createTableData(reqBody, bData, tData);
};

const updateUserInfoBkngsCount = (reqBody, tokenData) => {
  const query = { delFlag: false, myPrimary: reqBody.orgId + '__' + reqBody.mobileNum }
  const updateObj = {
    bCount: +1, cnfrmdbCount: +1
  }
  return { query, updateObj }
}

const getCustsTableBlckDates = (reqBody) => {
  var today = new Date();
  var todayDate = moment(today).format('YYYY-MM-DD');
  return { delFlag: false, blckdStatus: 'Active', oCode: reqBody.oCode, eCode: reqBody.eCode, bCode: reqBody.bCode, blckdFor: reqBody.bkFor, blckdDt: { $gte: todayDate } }
};


const findUserWithMobNum = (reqBody) => {
  const mp = reqBody?.orgId ? reqBody.orgId + '__' + reqBody.mobileNum : reqBody.userID;
  return { delFlag: false, myPrimary: mp};
}

const postCustUserSignupCreate = (reqBody, otpObj, bData) => {
  const obj = createUser(reqBody, bData, otpObj);
  return obj;
}

const postCustUserInfoCreate = (resObj, bData) => {
  const obj = createUserInfo(resObj, bData);
  return obj;
}

const updateCustomerData = (reqBody, otpObj) => {
  const currentUTC = commonSrvc.currUTCObj();
  const otp = otpObj.strHash ? { otp: otpObj.strHash, otpLav: otpObj.salt } : {}
  return {
    name: reqBody.name,
    ...otp,

    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const setOtpVrfRes = () => {
  const currentUTC = commonSrvc.currUTCObj();
  return {
    otp: '', otpLav: '', uStatus: 'Active',

    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const setUserResData = (userObj) => {
  return setUserData(userObj);
}

const setFeedbackDataWithUserData = (reqBody, res, bData) => {
  const obj = getFeedbackData(reqBody, bData);
  const data = setWithUserObj(res);
  return { ...obj, ...data };
}

const setFeedbackDataWithOutUserData = (reqBody, bData) => {
  const obj = getFeedbackData(reqBody, bData);
  const data = setWOUserObj(reqBody);
  return { ...obj, ...data };
}

const setFrnchDataWithUserData = (reqBody, res, bData) => {
  const obj = getFrnchData(reqBody, bData);
  const data = setWithUserObj(res);
  return { ...obj, ...data };
}

const setFrnchDataWithOutUserData = (reqBody, bData) => {
  const obj = getFrnchData(reqBody, bData);
  const data = setWOUserObj(reqBody);
  return { ...obj, ...data };
}

const getRestaurantInformation = (reqBody) => {
  return { delFlag: false, oCode: reqBody?.oCode, eCode: reqBody?.eCode, bCode: reqBody?.bCode, day: reqBody.day }
};

const getSplcDaysPricingList = (reqBody) => {
  const date = moment.utc().format('YYYY-MM-DD');
  const dt = moment.utc().add(1, 'month').format('YYYY-MM-DD');
  return { delFlag: false, oCode: reqBody.oCode, eCode: reqBody.eCode, sdStDt: { $gte: date }, sdEtDt: { $lt: dt }, bCode: reqBody.bCode, dType: 'SpecialDay' }
};

module.exports = {
  getCustsBranchesList, createCateringSrvc, createCustsContact, getCustsOffersList, createPrivateDining, createTableBkg,
  updateUserInfoBkngsCount, getBranchQuery, createTableBkg, updateUserInfoBkngsCount, getCustsTableBlckDates, findUserWithMobNum, postCustUserSignupCreate,
  postCustUserInfoCreate, updateCustomerData, setOtpVrfRes, setUserResData, setFeedbackDataWithUserData,
  setFeedbackDataWithOutUserData, setFrnchDataWithUserData, setFrnchDataWithOutUserData, getRestaurantInformation, getSplcDaysPricingList
};

const setCateringCreate = (reqBody, bData) => {
  const currentUTC = commonSrvc.currUTCObj();
  const number = reqBody.mobileNum.slice(6, 10);
  const date = new Date();
  const eDtStr = reqBody.eDt;
  const time = (date.getHours() * 60) + date.getMinutes() + date.getSeconds();
  const currentDay = currentUTC.currUTCDayOfYear.toString();
  const day = (currentDay.length == 1 ? '00' + currentDay : currentDay.length == 2 ? '0' + currentDay : currentDay);
  const esLogs = {
    _id: currentUTC.currUTCDtTmStr,
    cuType: uD.uType,
    cUser: uD.iss,
    cuName: uD.cuName,
    status: reqBody.eStatus || 'Requested',
    notes: ''
  };
  const _id = uuidv4();
  return {
    _id,

    orgId: bData.orgId,
    oCode: bData.oCode,
    oName: bData.oName,
    entId: bData.entId,
    eName: bData.eName,
    eCode: bData.eCode,
    branch: bData._id,
    bCode: bData.bCode,
    bName: bData.bName,

    user: reqBody.user,
    refUID: reqBody.refUID,

    eStatus: 'Requested',
    eventId: (currentUTC.currUTCYear - 2022) + day + '-' + time + '-' + number,

    name: reqBody.name?.trim(),
    mobCc: '+91',
    mobNum: reqBody.mobileNum,
    mobCcNum: '+91' + reqBody.mobileNum,

    emID: reqBody.emID?.trim() || '',
    numPersons: reqBody.numPersons || '',
    serviceFor: reqBody.serviceFor?.trim(),
    eDt: reqBody.eDt,
    eDtStr,
    eLocation: reqBody.eLocation?.trim(),
    eInfo: reqBody.eInfo?.trim() || '',
    occassion: reqBody.occassion || '',
    esLogs,

    delFlag: false,

    cuType: uD.uType,
    cUser: 'NA',
    cuName: reqBody.name,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,

    uuType: uD.uType,
    uUser: 'NA',
    uuName: reqBody.name,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const custsContactCreate = (reqBody, bData) => {
  const currentUTC = commonSrvc.currUTCObj();
  const _id = uuidv4();
  return {
    _id,

    orgId: bData.orgId,
    oCode: bData.oCode,
    oName: bData.oName,
    entId: bData.entId,
    eName: bData.eName,
    eCode: bData.eCode,
    branch: bData._id,
    bCode: bData.bCode,
    bName: bData.bName,

    cName: reqBody.name,
    cMobCc: '+91',
    cMobNum: reqBody.mobileNum,
    cMobCcNum: reqBody.userID,
    cEmID: reqBody.emID,
    cMsg: reqBody.message,
    cStatus: 'New',

    cuType: uD.uType,
    cUser: 'NA',
    cuName: reqBody.name,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,

    uuType: uD.uType,
    uUser: 'NA',
    uuName: reqBody.name,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const privateDiningCreate = (reqBody, bData, uRes) => {
  const currentUTC = commonSrvc.currUTCObj();
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
  return {
    _id: uuidv4(),
    idSeq: {
      seq: 'IND' + 'TG' + 'HYD' + currentUTC.currUTCYear + currentUTC.currUTCMonth + currentUTC.currUTCDay,
      countryCode: 'IND',
      stateCode: 'TG',
      distCode: 'HYD',
      year: currentUTC.currUTCYear,
      month: currentUTC.currUTCMonth,
      day: currentUTC.currUTCDay
    },
    bookingId: (currentUTC.currUTCYear - 2022) + day + '-' + time + '-' + number,

    orgId: bData.orgId,
    oCode: bData.oCode,
    oName: bData.oName,
    entId: bData.entId,
    eName: bData.eName,
    eCode: bData.eCode,
    branch: bData._id,
    bCode: bData.bCode,
    bName: bData.bName,

    name: reqBody.name,
    mobCc: '+91',
    mobNum: reqBody.mobileNum,
    mobCcNum: reqBody.userID,
    emID: reqBody.emID || '',
    bookInfo: reqBody.bookInfo || '',
    bookingFor: reqBody.bookingFor,
    occassion: reqBody.oType,
    oType: reqBody.oType,

    vegCount: reqBody.vegCount || 0,
    nonVegCount: reqBody.nonVegCount || 0,
    kidsCount: reqBody.kidsCount || 0,
    tDinersCount: reqBody.tDinersCount || 0,

    user: uRes._id || '',
    refUID: uRes.refUID || '',
    bStatus: 'Confirmed',

    bDt: reqBody.bDt,
    bTm: reqBody.bTm,
    bDtTm: new Date(bDtStr), bDtStr,
    country: 'India',
    countryCode: 'IND',
    state: 'Telangana',
    stateCode: 'TG',
    city: 'Hyderabad',
    cityCode: 'HYD',
    location: reqBody.brLocation,
    plusCode: reqBody.plusCode,
    geocoordinates: reqBody.geocoordinates,

    cuType: uD.uType,
    cUser: uRes._id || 'NA',
    cuName: uRes.name || reqBody.name,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,

    uuType: uD.uType,
    uUser:  uRes._id || 'NA',
    uuName: uRes.name || reqBody.name,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const createTableData = (reqBody, bData, tData) => {
  const currentUTC = commonSrvc.currUTCObj();
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
  return {
    _id: uuidv4(),
    idSeq: {
      seq: 'IND' + currentUTC.currUTCYear + currentUTC.currUTCMonth + currentUTC.currUTCDay,
      countryCode: 'IND',
      year: currentUTC.currUTCYear,
      month: currentUTC.currUTCMonth,
      day: currentUTC.currUTCDay
    },
    bookingId: (currentUTC.currUTCYear - 2022) + day + '-' + time + '-' + number,
    name: reqBody.name,
    mobCc: '+91',
    mobNum: reqBody.mobileNum,
    mobCcNum: reqBody.userID,
    emID: reqBody.emID || '',
    bookInfo: reqBody.bookInfo || '',
    occassion: reqBody.oType || '',
    oType: reqBody.oType,
    bookType: reqBody.bookType,
    rFor: reqBody.rFor,

    orgId: bData.orgId,
    oCode: bData.oCode,
    oName: bData.oName,
    entId: bData.entId,
    eName: bData.eName,
    eCode: bData.eCode,
    branch: bData._id,
    bCode: bData.bCode,
    bName: bData.bName,

    user: tData.iss,
    refUID: tData.uid,
    bStatus: 'Confirmed',

    vegCount: reqBody.vegCount || 0,
    vegAmt: reqBody.vegAmt || 0,
    nonVegCount: reqBody.nonVegCount || 0,
    nonVegAmt: reqBody.nonVegAmt || 0,
    kidsCount: reqBody.kidsCount || 0,
    kidAmt: reqBody.kidsAmt || 0,
    infantsCount: reqBody.infantsCount || 0,
    infantAmt: reqBody.infantAmt || 0,
    netAmt: reqBody.netAmt,
    gst: reqBody.gst || 0,
    gstAmt: reqBody.gstAmt || 0,
    serTax: reqBody.serTax || 0,
    totalAmt: reqBody.totalAmt,
    actNetAmt: reqBody.actNetAmt,
    actGst: reqBody.actGst || 0,
    actGstAmt: reqBody.actGstAmt || 0,
    actSerTax: reqBody.actSerTax || 0,
    actTotalAmt: reqBody.actTotalAmt || 0,
    actTotalNetAmt: reqBody.actTotalNetAmt,
    netTotalAmt: reqBody.netTotalAmt,

    offer: reqBody.offer || '',
    coupon: reqBody.coupon || '',
    dp: reqBody.dp || 0,
    dAmount: (reqBody.totalAmt - reqBody.actNetAmt) || reqBody.dAmount,

    bDt: reqBody.bDt,
    bTm: reqBody.bTm,
    bDtTm: new Date(bDtStr), bDtStr,
    country: 'India',
    countryCode: 'IND',
    state: 'Telangana',
    stateCode: 'TG',
    city: 'Hyderabad',
    cityCode: 'HYD',
    location: reqBody.blName,
    plusCode: reqBody.plusCode,
    geocoordinates: reqBody.geocoordinates,

    cuType: uD.uType,
    cUser: tData.iss,
    cuName: tData.un,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,

    uuType: uD.uType,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const createUser = (reqBody, bData, otpObj) => {
  const currentUTC = commonSrvc.currUTCObj();
  const refUID = generateRefuid(reqBody);
  const sName = reqBody.name.split(' ');
  const _id = uuidv4();
  return {
    _id,
    idSeq: {
      seq: 'IND' + currentUTC.currUTCYear + currentUTC.currUTCMonth + currentUTC.currUTCDayOfYear,
      countryCode: 'IND',
      year: currentUTC.currUTCYear,
      month: currentUTC.currUTCMonth,
      day: currentUTC.currUTCDay
    },

    orgId: bData.orgId,
    oCode: bData.oCode,
    oName: bData.oName,
    oeIds: [bData.entId],
    oebIds: [bData.branch],
    oebInfo: [{
      _id:  uuidv4(),
      entId: bData.entId || '', 
      eName: bData.eName || '',
      eCode: bData.eCode || '',
      branch: bData.branch || '',
      bCode: bData.bCode || '',
      bName: bData.bName || '',
    }],

    name: reqBody.name,
    sName: sName[0],
    mobCc: '+91',
    mobNum: reqBody.mobileNum,
    mobCcNum: reqBody.userID,
    emID: reqBody.emailId || '',
    refUID,
    myPrimary: bData.orgId + '__' + reqBody.mobileNum,
    mpType: 'Mobile',
    mpVerifyFlag: false,
    altMobCc: '',
    altMobNum: '',
    altMobCcNum: '',
    altEmID: '',
    dob: '',
    dobStr: '',
    gender: '',

    uStatus: 'Active',
    mPin: '',
    mPinLav: '',
    logPswd: '',
    logPswdLav: '',
    otp: otpObj.strHash || '',
    otpLav: otpObj.salt || '',
    mdTokens: [],
    wdTokens: [],

    pIcon: '',
    piActualName: '',
    piPath: '',

    cuType: uD.uType,
    cUser: 'NA',
    cuName: reqBody.name,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: uD.uType,
    uUser: 'NA',
    uuName: reqBody.name,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const generateRefuid = (reqBody) => {
  const name = reqBody.name.toUpperCase().replace(/\s/g, '');
  const date = new Date();
  const time = ((date.getHours() * 60) + date.getMinutes());
  const rdmStr = commonSrvc.randomStrGen(name, 3);
  const rdmStr2 = commonSrvc.randomStrGen(reqBody.mobileNum, 4);
  const code = rdmStr2 + rdmStr + time;
  return code;
}

const createUserInfo = (resObj, bData) => {
  const currentUTC = commonSrvc.currUTCObj();
  return {
    _id: resObj._id,

    orgId: bData.orgId,
    oCode: bData.oCode,
    oName: bData.oName,
    entId: bData.entId,
    eName: bData.eName,
    eCode: bData.eCode,
    branch: bData._id,
    bCode: bData.bCode,
    bName: bData.bName,

    user: resObj._id,
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

const setUserData = (userObj) => {
  return {
    id: userObj._id,
    idSeq: userObj.idSeq,

    orgId: userObj.orgId,
    oCode: userObj.oCode,
    oName: userObj.oName,
    entId: userObj.entId,
    eName: userObj.eName,
    eCode: userObj.eCode,
    branch: userObj.branch,
    bCode: userObj.bCode,
    bName: userObj.bName,

    name: userObj.name,
    sName: userObj.sName,
    mobCc: userObj.mobCc,
    mobNum: userObj.mobNum,
    mobCcNum: userObj.mobCcNum,
    emID: userObj.emID,
    refUID: userObj.refUID,
    myPrimary: userObj.myPrimary,
    mpType: userObj.mpType,
    mpVerifyFlag: userObj.mpVerifyFlag,
    altMobCc: userObj.altMobCc,
    altMobNum: userObj.altMobNum,
    altMobCcNum: userObj.altMobCcNum,
    altEmID: userObj.altEmID,
    dob: userObj.dob,
    dobStr: userObj.dobStr,
    gender: userObj.gender,

    uStatus: userObj.uStatus,
    mdTokens: userObj.mdTokens,
    wdTokens: userObj.wdTokens,

    pIcon: userObj.pIcon,
    piActualName: userObj.piActualName,
    piPath: userObj.piPath
  };
}

const getFeedbackData = (reqBody, bData) => {
  const rating = reqBody.rating;
  const currentUTC = commonSrvc.currUTCObj();
  return {
    idSeq: {
      seq: 'IND' + 'TG' + 'HYD' + currentUTC.currUTCYear + currentUTC.currUTCMonth + currentUTC.currUTCDay,
      countryCode: 'IND',
      stateCode: 'TG',
      distCode: 'HYD',
      year: currentUTC.currUTCYear,
      month: currentUTC.currUTCMonth,
      day: currentUTC.currUTCDay
    },

    orgId: bData.orgId,
    oCode: bData.oCode,
    oName: bData.oName,
    entId: bData.entId,
    eName: bData.eName,
    eCode: bData.eCode,
    branch: bData._id,
    bCode: bData.bCode,
    bName: bData.bName,

    name: reqBody.name,
    mobCc: '+91',
    mobNum: reqBody.mobileNum,
    mobCcNum: `+91${reqBody.mobileNum}`,
    emID: reqBody.emID || '',

    booking: reqBody.booking || '',
    bookingId: reqBody.bookingId || '',
    rating,
    fRating: reqBody.fRating || 0,
    sRating: reqBody.sRating || 0,
    aRating: reqBody.aRating || 0,
    mobCc: '+91',
    ratingStr: rating.toString(),
    feedback: reqBody.feedback || '',
    dob: reqBody.dob || '',
    dobStr: reqBody.dobStr || '',
    fgDt: reqBody.fgDt || '',
    fgDtStr: reqBody.fgDtStr || '',
    opDt: reqBody.opDt || '',
    opDtStr: reqBody.opDtStr || '',
    ccDt: reqBody.ccDt || '',
    ccDtStr: reqBody.ccDtStr || '',
    qa: reqBody.qa || [],
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum,
  }
}

const setWOUserObj = (reqBody) => {
  const _id = uuidv4();
  return {
    _id,
    user: '',
    refUID: '',
    name: reqBody.name,
    mobNum: reqBody.mobileNum,
    mobCcNum: reqBody.userID,
    cuType: uD.uType,
    cUser: 'NA',
    cuName: reqBody.name,
    uuType: uD.uType,
    uUser: 'NA',
    uuName: reqBody.name,
  }
}

const setWithUserObj = (res) => {
  return {
    _id: uuidv4(),
    user: res._id,
    refUID: res.refUID,
    name: res.name,
    mobNum: res.mobNum,
    mobCcNum: res.mobCcNum,
    cuType: res.cuType,
    cUser: res.cUser,
    cuName: res.cuName,
    uuType: res.uuType,
    uUser: res.uUser,
    uuName: res.uuName,
  };
}

const getFrnchData = (reqBody, bData) => {
  const currentUTC = commonSrvc.currUTCObj();
  const name = reqBody.name.replace(/\s+/g, '').toUpperCase();
  const str = commonSrvc.randomStrGen(reqBody.mobileNum + name, 4);
  const fReqID = `FRNCHS-${str}-${currentUTC.currUTCStr}`;
  return {
    idSeq: {
      seq: 'IND' + reqBody.fStateCode + currentUTC.currUTCYear + currentUTC.currUTCMonth + currentUTC.currUTCDay,
      countryCode: 'IND',
      stateCode: reqBody.fStateCode,
      distCode: reqBody.fCityCode || '',
      year: currentUTC.currUTCYear,
      month: currentUTC.currUTCMonth,
      day: currentUTC.currUTCDay
    },

    orgId: bData.orgId,
    oCode: bData.oCode,
    oName: bData.oName,
    entId: bData.entId,
    eName: bData.eName,
    eCode: bData.eCode,
    branch: bData._id,
    bCode: bData.bCode,
    bName: bData.bName,

    name: reqBody.name,
    emID: reqBody.emID || '',
    mobCc: reqBody.mobCcNum,
    mobNum: reqBody.mobileNum,
    mobCcNum: `${reqBody.mobCcNum}${reqBody.mobNum}`,
    fReqID,
    fRegion: reqBody.fRegion,
    fType: reqBody.fType || '',
    location: reqBody.location,
    fState: reqBody.fState,
    fStateCode: reqBody.fStateCode,
    fCity: reqBody.fCity,
    fCityCode: reqBody.fCityCode || '',
    fArea: reqBody.fArea,
    fPincode: reqBody.fPincode,
    fStatus: 'Requested',

    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum,
  }
}
