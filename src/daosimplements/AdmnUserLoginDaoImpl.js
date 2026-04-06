/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');
const CommonSrvc = require('../services/CommonSrvc');
var moment = require('moment');
const AdUserSsns = require('../schemas/AdUserSsns');
const AdUserSsnsClsd = require('../schemas/AdUserSsnsClsd');
const uObj = { ut: 'VRU', un: 'Superadmin', iss: 'VRUAUID10001'}

const setLoginQuery = (reqBody) => {
  return {delFlag: false, $or: [{ refUID: reqBody.userID }, { myPrimary: reqBody.userID }]};
}

const setLoginSession = (usrObj, uaObj) => {
  const ssnObj = setAdUserSession(usrObj, uaObj);
  const adus = new AdUserSsns(ssnObj);
  const adusClsd = new AdUserSsnsClsd(ssnObj);
  return { adus, adusClsd };
}
const setAdUserSsnQuery = (tData) => {
  return { _id: tData?.atn, adUser: tData?.iss, delFlag: false };
}
const setUsrData = (userObj) => {
  return getUsrData(userObj);
}

const postAdminUserProfileView  = (tData) => {
  return { delFlag: false, _id: tData.iss };
}

const postAdminUserProfileUpdate  = (reqBody, tokenData) => {
  const query = { delFlag: false, _id: reqBody.id}
  const updateObj = updateData(reqBody, tokenData);
  return { query, updateObj}
}

const userGetQuery = (reqBody) => {
  return {delFlag: false, $or: [{ refUID: reqBody.usrID }, { myPrimary: reqBody.usrID }]};
}
const passwordUpdateData = (pswdObj, tData, setPass) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const flag =  setPass ? {mpVerifyFlag: true} : {};

  return {
    ...flag,
    otp: '',
    otpLav: '',
    logPswd: pswdObj.strHash,
    logPswdLav: pswdObj.salt,

    uuType: tData.ut || uObj.ut,
    uUser: tData.iss || uObj.iss,
    uuName: tData.un || uObj.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const userOtpGetQuery = (tData) => {
  return {_id: tData.iss, delFlag: false};
}

const setOtpUserData = (otpObj, tData, currentUTC) => {
  return {
    otp: otpObj.strHash,
    otpLav: otpObj.salt,
    uuType: tData.ut || 'VRU',
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const userPswrdGetQuery = (tData) => ({ delFlag: false, uStatus: 'Active', _id: tData.iss });
const setDelUsrSsnQuery = (tData) => ({_id: tData?.atn});
const setSessionData = (data, devInfo, atoken) => {
  return setSsnData(data, devInfo, atoken);
}
const getSsnData = (_id, type) => {
  const time = type == 'get' ? { cDtStr: { $gte: moment().subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss') }} : {};
  return { delFlag: false, _id, ...time}
}

const getSsnDataByOrgCode = (oCode) => {
  return { delFlag: false, oCode}
};

const getSsnDataByUserID = (adUser) => {
  return { delFlag: false, adUser}
}

module.exports = {
  setLoginQuery, setLoginSession, setAdUserSsnQuery, setUsrData, postAdminUserProfileView, postAdminUserProfileUpdate, userGetQuery, passwordUpdateData,  userOtpGetQuery, setOtpUserData, userPswrdGetQuery, setDelUsrSsnQuery, setSessionData, getSsnData, getSsnDataByOrgCode, getSsnDataByUserID
};

const setAdUserSession = (usrObj, uaObj) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    _id: uuidv4(),
    orgId: usrObj.orgId,
    oCode: usrObj.oCode,
    oName: usrObj.oName,
    entId: usrObj.entId,
    eName: usrObj.eName,
    eCode: usrObj.eCode,
    branch: usrObj.branch,
    bCode: usrObj.bCode,

    adUser: usrObj._id,
    aduName: usrObj.name,
    aduMobCcNum: usrObj.mobCcNum,
    aduEmID: usrObj.emID,
    aduRefUID: usrObj.refUID,
    aduPrimary: usrObj.myPrimary, // Admin User Primary(Email)

    at: 'Web App',
    dt: uaObj.deviceType, // Device Type: Desktop, Mobile, Tab
    dos: uaObj.osName, // Device OS
    dosv: uaObj.osVersion, // Device OS Version
    dvndr: uaObj.mobileVendor, // Device Vendor(For Mobile / Tab)
    dmodel: uaObj.mobileModel, // Device Model(For Mobile / Tab)
    ipa: uaObj.ip, // IP Address
    ipv: uaObj.ipv, // IP Version
    bn: uaObj.browserName, // Browser Name
    bv: uaObj.fullBrowserVersion, // Browser Version
    ua: uaObj.ua, // USer Agent
    uaObj,

    cDtStr: currentUTC.currUTCDtTmStr, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
    uDtStr: currentUTC.currUTCDtTmStr // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
  };
}

const getUsrData = (resObj) => {
  return {
    id: resObj._id,
    idSeq: resObj.idSeq,
    name: resObj.name,
    sName: resObj.sName,
    mobCc: resObj.mobCc,
    mobNum: resObj.mobNum,
    mobCcNum: resObj.mobCcNum,
    emID: resObj.emID,
    refUID: resObj.refUID,
    myPrimary: resObj.myPrimary,
    mpType: resObj.mpType,
    mpVerifyFlag: resObj.mpVerifyFlag,
    altMobCc: resObj.altMobCc,
    altMobNum: resObj.altMobNum,
    altMobCcNum: resObj.altMobCcNum,
    altEmID: resObj.altEmID,
    dob: resObj.dob,
    dobStr: resObj.dobStr,
    gender: resObj.gender,
    branch: resObj.branch,
    bCode: resObj.bCode,
    bName: resObj.bName,
    orgId: resObj.orgId,
    oCode: resObj.oCode,
    oName: resObj.oName,
    oPlan: resObj.oPlan,
    entId: resObj.entId,
    eName: resObj.eName,
    eCode: resObj.eCode ,

    uStatus: resObj.uStatus,
    uType: resObj.uType,
    uRole: resObj.uRole,
    urCode: resObj.urCode,
    urSeq: resObj.urSeq,
    pIcon: resObj.pIcon,
    piActualName: resObj.piActualName,
    piPath: resObj.piPath,
    agentInfo: resObj.agentInfo && resObj.agentInfo.id ? resObj.agentInfo : {}
  };
}

const updateData = (reqBody, tokenData) => {
  const dobStr =  reqBody.dob ? reqBody.dob.toString() : '';
  const currentUTC = CommonSrvc.currUTCObj();
  return {
      idSeq: {
        seq: reqBody.countryCode + '-' + reqBody.stateCode + '-' + currentUTC.currUTCYear + currentUTC.currUTCMonth + currentUTC.currUTCDay,
        countryCode: reqBody.countryCode || '',
        stateCode: reqBody.stateCode || '',
        distCode: reqBody.districtCode || '',
        zip: reqBody.pincode || '',
        aLocality: reqBody.mandal || '',
        area: reqBody.village || '',
        year: currentUTC.currUTCYear,
        month: currentUTC.currUTCMonth,
        day: currentUTC.currUTCDay
      },
  
      name: reqBody.fullName,
      sName: reqBody.shortName,
      mobCc: reqBody.mobCc,
      mobNum: reqBody.mobNumber,
      mobCcNum: reqBody.mobCcNum,
      emID: reqBody.emailId || '',
      myPrimary: reqBody.mobCcNum,
      altMobCc: reqBody.altMobCc || '',
      altMobNum: reqBody.altMobileNumber || '',
      altMobCcNum: reqBody.altMobCcNum || '',
      altEmID: reqBody.alternateEmail || '',
      dob: reqBody.dob || '',
      dobStr,
      gender: reqBody.gender || '',
  
      houseNum: reqBody.houseNumber,
      refUID: reqBody.userID,
      area: reqBody.area,
      zip: reqBody.pincode,
      state: reqBody.state,
      stateCode:  reqBody.stateCode,
      district: reqBody.district,
      mandal: reqBody.mandal,
  
      uuType: tokenData.ur,
      uUser: tokenData.iss,
      uuName: tokenData.un,
      uDtTm: currentUTC.currUTCDtTmNum,
      uDtStr: currentUTC.currUTCDtTmStr,
      uDtNum: currentUTC.currUTCDtTmNum
    }
}
const setSsnData = (data, devInfo, atoken) => {
  return {
    _id: uuidv4(),
    orgId: data.orgId,
    oCode: data.oCode,
    oName: data.oName,
    entId: data.entId || null,
    eName: data.eName || '',
    eCode: data.eCode || '',
    branch: data.branch || null,
    bName: data.bName || '',
    bCode: data.bCode || '',
    adUser: data._id,
    aduName: data.name,
    aduMobCcNum: data.mobCcNum,
    aduEmID: data.emID || '',
    aduRefUID: data.refUID,
    aduPrimary: data.myPrimary,
    at: 'Token',
    dt: devInfo.deviceType || 'Desktop',
    dos: devInfo.osName || '',
    dosv: devInfo.osVersion || '',
    dvndr: devInfo.mobileVendor || '',
    dmodel: devInfo.mobileModel || '',
    duId: devInfo.duId || '',
    ma: devInfo.ma || '',
    ipa: devInfo.ip,
    ipv: devInfo.ipVersion || 'IPv4',
    bn: devInfo.browserName || '',
    bv: devInfo.browserVersion || '',
    ua: devInfo.ua,
    uaObj: { atoken, ...devInfo } || {},
    delFlag: data.delFlag || false,
    cDtStr: data.cDtStr,
    uDtStr: data.uDtStr
  };
};