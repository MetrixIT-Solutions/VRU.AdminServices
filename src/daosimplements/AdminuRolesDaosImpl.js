/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

var { v4: uuidv4 } = require('uuid');
var moment = require('moment');

const CommonSrvc = require('../services/CommonSrvc');
const userRoles = require('../schemas/AdUserRoles');

const adminUsrRlsList = (reqBody, tData) => {
  const searchStr = reqBody.searchStr || '';
  const rsObj = reqBody?.status == 'Active' ? { rStatus: 'Active' } : {};
  const rType = reqBody.userType ? { rType: reqBody.userType } : {};
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.orgId ? { orgId: reqBody.orgId } : {});
  const entObj = (reqBody.entityId ? { entId: reqBody.entityId } : {});
  const branchObj = (reqBody.branch ? { branch: reqBody.branch } : {});
  // const rsq =  reqBody.userType ? ((tData.ur !== 'Superadmin' && tData.ut !== 'App' && tData.ut !== 'Tech') ? {rSeq: {$gt: tData.urs}} : {}) : {};

  const query = {
    delFlag: false,
    // ...rsq,
    ...rsObj,
    ...orgObj,
    ...rType,
    ...entObj,
    ...branchObj,
    $or: [
      { 'rName': { $regex: searchStr, $options: 'i' } },
      { 'rCode': { $regex: searchStr, $options: 'i' } },
      { 'rStatus': { $regex: searchStr, $options: 'i' } }
    ]
  };

  const sort = { rSeq: 1, cDtStr: -1 };

  return { query, sort };
}

const crtRolesData = (reqBody, tokenData) => {
  const schemaData = setData(reqBody, tokenData);
  const roleData = new userRoles(schemaData);
  return roleData;
}

const getQueryData = (_id, tData) => {
  const id = _id ? {_id}: {};
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : {};
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  return { ...id, delFlag: false, ...orgObj, ...entObj, ...branchObj };
}

const updateData = (reqBody, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    rName: reqBody.roleName,
    rCode: reqBody.roleCode,
    rSeq: reqBody.roleSeq,
    rType: reqBody.rType,
    uuType: tData.ur,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr
  };
}

const statusUpdateData = (reqBody, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    rStatus: reqBody.roleStatus,

    uuType: tData.ur,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr
  };
}

const rlsDeleteData = (_id, reqBody, tData) => {
  const query = { _id };

  const currentUTC = CommonSrvc.currUTCObj();
  const dtime = moment.utc().format('YYYYMMDDHHmmss');
  const updateData = {
    rName: reqBody.rName + '_DEL_' + dtime,
    rCode: reqBody.rCode + '_DEL_' + dtime,
    delFlag: true,

    uuType: tData.ur,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
  };

  return { query, updateData };
}

module.exports = {
  adminUsrRlsList, crtRolesData, getQueryData, updateData, statusUpdateData, rlsDeleteData
};

const setData = (reqBody, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const uid = uuidv4();
  const orgId = tData.ut === 'VRU' ? reqBody.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? reqBody.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? reqBody.oName : tData.on;

  return {
    _id: uid,

    orgId, oCode, oName,

    rType: reqBody.rType,
    rName: reqBody.roleName,
    rCode: reqBody.roleCode,
    rSeq: reqBody.roleSeq,
    rStatus: reqBody.roleStatus,

    cuType: tData.ur,
    cUser: tData.iss,
    cuName: tData.un,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    uuType: tData.ur,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr
  };
}
