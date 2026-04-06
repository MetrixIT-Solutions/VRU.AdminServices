/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');

const CommonSrvc = require('../services/CommonSrvc');
const uObj = { ut: 'VRU', un: 'Superadmin', iss: 'VRUAUID10001'}

const custCntQry = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.orgId ? { orgId: reqBody.orgId } : {});
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} : (reqBody.entityId ? {entId: reqBody.entityId} : {});
  const branchObj = tData.ut == 'Branch' ? {branch: tData.bid} : (reqBody.branch ? {branch: reqBody.branch} : {});

  return { delFlag: false, ...orgObj, ...entObj, ...branchObj, $or: [
    { 'cName': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'cMobCcNum': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'cEmID': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'cMsg': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'cCmnts': { $regex: reqBody.searchStr, $options: 'i' } },
    { 'cStatus': { $regex: reqBody.searchStr, $options: 'i' } }
  ]};
}

const custCntViewQry = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.oId ? {orgId: reqBody.oId} : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : {};
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : {};

  return { delFlag: false, _id: reqBody.id, ...orgObj, ...entObj, ...branchObj };
}

const setCustCntStsUpdate = (reqBody, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    cStatus: reqBody.status,
    cNotes: reqBody.notes,
    cCmnts: reqBody.cmnts,
    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }
}

const createCustsContact = (reqBody, resD) => {
  const obj = custsContactCreate(reqBody, resD);
  return obj;
};

const custContactLfcsListQry = (cId) => {
  return {cId, delFlag: false};
}

module.exports = {
  custCntQry, custCntViewQry, setCustCntStsUpdate, createCustsContact, custContactLfcsListQry
};

const custsContactCreate = (reqBody, resD) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const ctObj = reqBody?.cType ? { cType: reqBody.cType } : {};

  return {
    _id: uuidv4(),
    orgId: resD.orgId,
    oCode: resD.oCode,
    oName: resD.oName,
    entId: resD._id,
    eName: resD.eName,
    eCode: resD.eCode,
    branch: reqBody.branch ? reqBody.branch : '',
    bCode: reqBody.branchCode ? reqBody.branchCode : '',

    cName: reqBody.name,
    cMobCc: '+91',
    cMobNum: reqBody.mobileNum,
    cMobCcNum: reqBody.userID,
    cEmID: reqBody.emID,
    cMsg: reqBody.message,
    cStatus: 'Requested',
    ...ctObj,

    delFlag: false,
    cuType: uObj.ut,
    cUser: uObj.iss,
    cuName: uObj.un,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: uObj.ut,
    uUser: uObj.iss,
    uuName: uObj.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  };
}
