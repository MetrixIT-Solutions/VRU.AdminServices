/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

var { v4: uuidv4 } = require('uuid');

const CommonSrvc = require('../services/CommonSrvc');
const userRolesAcs = require('../schemas/AdUserRolesAccess');

const usrRlsAcsListQry = (reqBody, tData) => {
  const searchStr = reqBody.searchStr || '';
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.orgId ? { orgId: reqBody.orgId } : {});
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} : (reqBody.entityId ? {entId: reqBody.entityId} : {});
  const branchObj = tData.ut == 'Branch' ? {branch: tData.bid} : (reqBody.branch ? {branch: reqBody.branch} : {});

  const query = {
    delFlag: false,
    ...orgObj,
    ...entObj,
    ...branchObj,
    $or: [
      { 'rName': { $regex: searchStr, $options: 'i' } },
      { 'rType': { $regex: searchStr, $options: 'i' } },
      { 'uName': { $regex: searchStr, $options: 'i' } },
      { 'uPrimary': { $regex: searchStr, $options: 'i' } },
    ]
  };

  const sort = { rType: -1, raSeq: 1, cDtStr: -1 };

  return { query, sort };
}

const rolesAcsData = (reqBody, tokenData) => {
  const schemaData = setRacsData(reqBody, tokenData);
  const roleData = new userRolesAcs(schemaData);
  return roleData;
}

const getQueryData = (_id, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : {};
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};
  
  return { _id, delFlag: false, ...orgObj, ...entObj, ...branchObj };
}

const updateData = (reqBody, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    raSeq: reqBody.raSeq,

    // org: reqBody.org || '',
    // orgName: reqBody.orgName || '',
    // orgCode: reqBody.orgCode || '',
    // orgs: reqBody.orgs || [],
    // orgNames: reqBody.orgNames || [],
    // obId: reqBody.obId || '',
    // obName: reqBody.obName || '',
    // obCode: reqBody.obCode || '',
    // obIds: reqBody.obIds || [],
    // team: reqBody.team || '',
    // tName: reqBody.tName || '',
    // tCode: reqBody.tCode || '',
    // teams: reqBody.tCode || [],

    access: reqBody.access,

    uuType: tData.ur,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr
  };
}

const setRlAcsQuery = (tData) => ({ orgId: tData.oid, rType: tData.ut, rName: tData.ur, delFlag: false });

module.exports = {
  usrRlsAcsListQry, rolesAcsData, getQueryData, updateData, setRlAcsQuery
};

const setRacsData = (reqBody, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const uid = uuidv4();
  const orgId = tData.ut === 'VRU' ? reqBody.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? reqBody.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? reqBody.oName : tData.on;

  return {
    _id: uid,
    orgId, oCode, oName,
    entId: reqBody.entId || '',
    eCode: reqBody.eCode || '',
    eName: reqBody.eName || '',
    branch: reqBody.branch || '',
    bCode: reqBody.bCode || '',

    raSeq: reqBody.raSeq,

    role: reqBody.role,
    rType: reqBody.rType,
    rName: reqBody.rName,
    rCode: reqBody.rCode,

    user: reqBody.user || '',
    uName: reqBody.uName || '',
    urefUID: reqBody.urefUID || '',
    uPrimary: reqBody.uPrimary || '',

    access: reqBody.access,

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
