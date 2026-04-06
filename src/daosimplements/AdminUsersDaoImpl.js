/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');
var fs = require('fs');
var { v4: uuidv4 } = require('uuid');
const CommonSrvc = require('../services/CommonSrvc');

const getAdminUsersList = (reqBody, tData) => {
  // const accessQuery = (tData.ut !== 'VRU' ? (tData.ur === 'Admin' ? [] : [{uType: {$ne: tData.ut}}, {uRole: {$ne: 'Admin'}}]) : (tData.ur === 'Superadmin' ? [] : [{uType: {$ne: tData.ut}}]));
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const restObj = tData.ut == 'Entity' ? {entId: tData.ent} : (reqBody.resId ? {entId: reqBody.resId} : {});
  const branchObj = tData.ut == 'Branch' ? {entId: tData.ent, branch: tData.bid} : (reqBody.brcId ? {branch: reqBody.brcId} : {});
  const rlObj = reqBody?.urCode?.length ? {urCode: {$in: reqBody.urCode}} : {};
  const searchStr = reqBody.searchStr || '';

  const query = {
    delFlag: false,
    _id: {$nin: [tData.iss]},
    urSeq: {$gt: tData.urs},

    ...orgObj,
    ...restObj,
    ...branchObj,
    ...rlObj,
    $and: [
      {
        $or: [
          {'name': {$regex: searchStr, $options: 'i'}},
          {'mobCcNum': {$regex: searchStr, $options: 'i'}},
          {'emID': {$regex: searchStr, $options: 'i'}},
          {'refUID': {$regex: searchStr, $options: 'i'}},
        ],
      },
      // ...accessQuery,
    ],
  };

  const opQuery = {delFlag: false, ...orgObj, uType: {$in: tData.ut !== 'VRU' ? ['Entity', 'Branch'] : ['Board', 'Entity', 'Branch']}}; // Organization Plan Query to get the users count based on plan
  const sort = reqBody.sortBy || {cDtNum: -1};
  return {query, sort, opQuery};
}

const setUserData = (reqBody, file, tData, callback) => {
  const currentUTC = CommonSrvc.currUTCObj();
  setProfileImageData(file, currentUTC, (piObj) => {
    const userObj = setAdminUserData(reqBody, tData, piObj, currentUTC);
    callback(userObj);
  });
}

const editAdminUserData = (reqBody, _id, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : {};
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} : {};
  const branchObj = tData.ut == 'Branch' ? {branch: tData.bid} : {}; 
  
  const query = { _id, delFlag: false, ...orgObj, ...entObj,  ...branchObj };
  const updateObj = setAdminUserUpdateData(reqBody, tData);
  return { query, updateObj };
}

const getAdminUserView = (recordId, reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} : {};
  const branchObj = tData.ut == 'Branch' ? {branch: tData.bid} : {};

  return { _id: recordId, delFlag: false, ...orgObj, ...entObj,  ...branchObj };
}

const editAdminUserStatusData = (reqBody, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  const query = { _id: reqBody.recordId, delFlag: false, ...orgObj, ...entObj, ...branchObj };
  const updateObj = {
    uStatus: reqBody.status,

    uuType: tData.ur,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTmNum,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
  return { query, updateObj };
}

const editAdminUserPwsdChange = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.orgId ? { orgId: reqBody.orgId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  const query = { _id: reqBody.recordId, delFlag: false, ...orgObj, ...entObj, ...branchObj };
  const updateObj = editAdminUserPassWorddChange(reqBody, tData);
  return { query, updateObj };
}

const getAdminUsersAgentList = () => {
  return { delFlag: false, uRole: 'Call Agent' };
}

const getAdminUserCallAgentData = (agentId) => {
  return { delFlag: false, uRole: 'Call Agent', 'agentInfo.id': agentId, refUID: {$nin: ['callagent']}};
}

const totalListQuery = (reqBody, tData) => {
  const userType = reqBody?.uType?.length ? {uType: {$in: reqBody.uType}} : {uType: {$nin: ['VRU']}};
  const userRole = reqBody?.uRole?.length ? {uRole: {$in: reqBody.uRole}} : {uRole: {$ne: 'Superadmin'}};
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.oId ? { orgId: reqBody.oId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};
  const query = { delFlag: false, ...orgObj, ...entObj, ...branchObj, uStatus: 'Active', ...userRole, ...userType };
  const project = { uRole: 1, urCode: 1, urSeq: 1, name: 1, refUID: 1, sName: 1, myPrimary: 1, mobCcNum: 1, emID: 1, uType: 1 };
  return { query, project };
}

const updateOrgPlan = (oPlan, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    oPlan,

    uuType: tData.ur,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTmNum,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }
}

const getAdminUsersCountByOrgId = (orgId) => {
  return {orgId, uType: {$in: ['Entity', 'Branch']}, delFlag: false};
}
const getAdminUsersCountExcptBoard = (tData) => {
  return {orgId: tData.oid, uType: {$in: ['Entity', 'Branch']}, delFlag: false};
}

const updateOEBStatus = (type, _id, status, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  let obj = {}, upObj = {};
  if (type === 'org') {
    obj = { orgId: _id }; upObj = { oStatus: status };
  } else if (type === 'ent') {
    obj = { entId: _id }; upObj = { eStatus: status };
  } else if (type === 'branch') {
    obj = { branch: _id }; upObj = { bStatus: status };
  }
  obj.delFlag = false;
  const up = {
    uuType: tData.ur,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTmNum,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
  upObj = { ...upObj, ...up };
  return { obj, upObj };
};

module.exports = {
  getAdminUsersList, setUserData, editAdminUserData, getAdminUserView, editAdminUserStatusData,
  editAdminUserPwsdChange, getAdminUsersAgentList, getAdminUserCallAgentData, totalListQuery, updateOrgPlan,
  getAdminUsersCountByOrgId, getAdminUsersCountExcptBoard, updateOEBStatus
};

const setProfileImageData = (file, currentUTC, cb) => {
  if (file) {
    const piActualName = file.originalname;
    const fileArr = file.destination ? file.destination.split('profiles/') : [];
    const uid = fileArr.length > 1 ? fileArr[1] : uuidv4();

    const fileExt = file.filename.split('.');
    const pIcon = currentUTC.currUTCDtTmNum + '.' + fileExt[fileExt.length - 1];
    const fileLoc = file.destination + '/' + pIcon;
    fs.rename(file.destination + '/' + file.filename, fileLoc, () => {
      cb({ uid, pIcon, piActualName, piPath: config.apiDomain + fileLoc });
    });
  } else {
    const uid = uuidv4();
    cb({ uid, pIcon: null, piActualName: null, piPath: null });
  }
}

const setAdminUserData = (reqBody, tData, piObj, currentUTC) => {
  const dobstr = reqBody.dob.toString();

  const logPswdLav = reqBody?.password ? CommonSrvc.genSalt(32) : '';
  const logPswdObj = logPswdLav ? CommonSrvc.encryptStr(reqBody.password, logPswdLav) : { salt: '', strHash: '' };
  const passObj = logPswdObj.strHash ? {
    logPswd: logPswdObj.strHash,
    logPswdLav: logPswdObj.salt
  } : {};
  const orgId = tData.ut === 'VRU' ? reqBody.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? reqBody.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? reqBody.oName : tData.on;
  const oPlan = tData.ut === 'VRU' ? reqBody.oPlan : tData.op;
  const entId = reqBody.entId ? reqBody.entId : '';
  const eCode = reqBody.eCode ? reqBody.eCode : '';
  const eName = reqBody.eName ? reqBody.eName : '';
  return {
    _id: piObj.uid,
    idSeq: {
      seq: 'IND'+ reqBody.stateCode + currentUTC.currUTCYear + currentUTC.currUTCMonth + currentUTC.currUTCDay,
      countryCode: reqBody.countryCode || '',
      stateCode: reqBody.stateCode || '',
      distCode: reqBody.districtCode || '',
      zip: reqBody.zipCode || '',
      aLocality: reqBody.mandal || '',
      area: reqBody.area || '',
      year: currentUTC.currUTCYear,
      month: currentUTC.currUTCMonth,
      day: currentUTC.currUTCDay
    },
    orgId, oCode, oName, oPlan,
    entId, eCode, eName,
    branch: reqBody.branch || '',
    bCode: reqBody.branchCode || '',
    bName: reqBody.bName || '',

    name: reqBody.fullName,
    sName: reqBody.shortName,
    mobCc: reqBody.mobCc,
    mobNum: reqBody.mobNmumber,
    mobCcNum: reqBody.mobCcNum,
    emID: reqBody.emailId || '',
    refUID: reqBody.userId,
    myPrimary: reqBody.emailId,
    mpType: 'Email',
    // mpVerifyFlag: reqBody.primaryVerified,
    altMobCc: reqBody.altMobCc || '',
    altMobNum: reqBody.altMobileNumber || '',
    altMobCcNum: reqBody.altMobCcNum || '',
    altEmID: reqBody.alternateEmail || '',
    dob: reqBody.dob || '',
    dobStr: dobstr,
    gender: reqBody.gender || '',

    houseNum: reqBody.houseNumber,
    area: reqBody.area,
    zip: reqBody.pincode,
    state: reqBody.state,
    stateCode:  reqBody.stateCode,
    district: reqBody.district,
    mandal: reqBody.mandal,

    uStatus: reqBody.status,
    uType: reqBody.userType,
    uRole: reqBody.userRole,
    urCode: reqBody.urCode,
    urSeq: reqBody?.urSeq || 81,
    // uStayi: reqBody.designation || '',
    ...passObj,

    agentInfo : {
      id: reqBody.agentId || '',
      extension: reqBody.extension || '',
      password:reqBody.agentPassword || ''
    },
    otp: reqBody.otp || '',
    otpLav: reqBody.otpLav || '',
    mdTokens: reqBody.mdTokens || '',
    wdTokens: reqBody.wdTokens || '',

    pIcon: piObj.pIcon,
    piActualName: piObj.piActualName,
    piPath: piObj.piPath,

    cuType: tData.ur,
    cUser: tData.iss,
    cuName: tData.un,
    cDtTm: currentUTC.currUTCDtTmNum,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: tData.ur,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTmNum,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const setAdminUserUpdateData = (reqBody, tData) => {
  const logPswdLav = reqBody.password ? CommonSrvc.genSalt(32) : '';
  const logPswdObj = logPswdLav ? CommonSrvc.encryptStr(reqBody.password, logPswdLav) : { salt: '', strHash: '' };
  const orgId = tData.ut === 'VRU' ? reqBody.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? reqBody.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? reqBody.oName : tData.on; 
  const entId = reqBody.entId ? reqBody.entId : '';
  const eCode = reqBody.eCode ? reqBody.eCode : '';
  const eName = reqBody.eName ? reqBody.eName : '';

  const passObj = logPswdObj.salt ? {
    logPswd: logPswdObj.strHash,
    logPswdLav: logPswdObj.salt
  } : {};

  const dobStr = reqBody.dob.toString();
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    orgId, oCode, oName,
    entId, eCode, eName,
    branch: reqBody.branch,
    bCode: reqBody.branchCode,
    bName: reqBody.bName,
    name: reqBody.fullName,
    sName: reqBody.shortName,
    mobCc: reqBody.mobCc,
    mobNum: reqBody.mobNmumber,
    mobCcNum: reqBody.mobCcNum,
    emID: reqBody.emailId,
    refUID: reqBody.userId,
    myPrimary: reqBody.emailId,
    altMobCc: reqBody.altMobCc || '',
    altMobNum: reqBody.altMobileNumber || '',
    altMobCcNum: reqBody.altMobCcNum || '',
    altEmID: reqBody.alternateEmail || '',
    dob: reqBody.dob || '',
    dobStr,
    gender: reqBody.gender || '',

    uStatus: reqBody.status,
    uType: reqBody.userType,
    uRole: reqBody.userRole,
    urCode: reqBody.urCode,
    urSeq: reqBody?.urSeq || 81,
    ...passObj,

    houseNum: reqBody.houseNumber,
    area: reqBody.area,
    zip: reqBody.pincode,
    state: reqBody.state,
    stateCode:  reqBody.stateCode,
    district: reqBody.district,
    mandal: reqBody.mandal,

    agentInfo : {
      id: reqBody.agentId,
      extension: reqBody.extension,
      password:reqBody.agentPassword || ''
    },

    uuType: tData.ur,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTmNum,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}

const editAdminUserPassWorddChange = (reqBody, tData) => {
  const logPswdLav = reqBody.password ? CommonSrvc.genSalt(32) : '';
  const logPswdObj = logPswdLav ? CommonSrvc.encryptStr(reqBody.password, logPswdLav) : { salt: '', strHash: '' };
  const passObj = logPswdObj.salt ? {
    logPswd: logPswdObj.strHash,
    logPswdLav: logPswdObj.salt
  } : {};
  const currentUTC = CommonSrvc.currUTCObj();
  return {

    ...passObj,

    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.pn,
    uDtTm: currentUTC.currUTCDtTmNum,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }
}