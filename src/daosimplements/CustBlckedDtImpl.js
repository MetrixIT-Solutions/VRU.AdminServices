/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');
const CommonSrvc = require('../services/CommonSrvc');
var moment = require('moment');

const tableBolckedCreate = (reqBody, tokenData) => {
  const blockedTable = setBlockedTableData(reqBody, tokenData);
  return blockedTable;
}

const tableBolckedList = (reqBody, tData) => {
  const searchStr = reqBody.searchStr || '';
  const pd = moment().format('YYYY-MM-DD');
  const dt = reqBody.key == 'Active' ? {blckdDt:  {$gte: pd}} : {blckdDt:  {$lt: pd}};
  const status = reqBody.status ? {blckdStatus: reqBody.status} : {};
  const branch = tData.ut == 'Branch' ? {branch: tData.bid} : (reqBody.branchId ? {branch: reqBody.branchId} : {});
  const orgObj = tData.ut !== 'VRU' ? {orgId: tData.oid} : (reqBody.orgId ? {orgId: reqBody.orgId} : {});
  const entObj = tData.ut == 'Entity' ? {entId: tData.ent} : (reqBody.entityId ? {entId: reqBody.entityId} : {});
  const blckdFor = reqBody.blockFor ? { blckdFor: reqBody.blockFor } : {};
  const selectBranch = reqBody.selectedBranch ? {bCode: reqBody.selectedBranch} : {};
  const query = { delFlag: false, ...dt, ...branch, ...status, ...orgObj, ...entObj, ...selectBranch, ...blckdFor,
    $or: [
      { 'blckdDt': { $regex: searchStr, $options: 'i' } },
      { 'blckdSlotType': { $regex: searchStr, $options: 'i' } },
      { 'bCode': { $regex: searchStr, $options: 'i' } },
      { 'blckdStatus': { $regex: searchStr, $options: 'i' } },
    ],
  }
  const sort = reqBody.sortBy || { cDtNum: -1 };
  return { query, sort }
}

const editTableBlckedStatusData = (reqBody, tokenData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const pd = moment().format('YYYY-MM-DD');
  const dt =  reqBody.key == 'Active' ? {blckdDt:  {$gte: pd}} : null ;
  const orgObj = tokenData.ut !== 'VRU' ? {orgId: tokenData.oid} : (reqBody.oId ? {orgId: reqBody.oId} : {});
  const entObj = tokenData.ut == 'Entity' ? { entId: tokenData.ent } : {};
  const branchObj = tokenData.ut == 'Branch' ? { branch: tokenData.bid } : {};

  const query = { _id: reqBody.recordId, delFlag: false, ...dt, ...orgObj, ...entObj, ...branchObj };
  const updateObj = {
    blckdStatus: reqBody.status,

    uuType: tokenData.ut,
    uUser: tokenData.iss,
    uuName: tokenData.un,
    uDtTm: currentUTC.currUTCDtTmNum,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }
  return { query, updateObj };
}

module.exports = {
  tableBolckedCreate, tableBolckedList, editTableBlckedStatusData
}

const setBlockedTableData = (reqBody, tokenData) => {
  const blckdDt = reqBody.blockDate;
  const currentUTC = CommonSrvc.currUTCObj();
  const orgId = tokenData.ut === 'VRU' ? reqBody.orgId : tokenData.oid;
  const oCode = tokenData.ut === 'VRU' ? reqBody.oCode : tokenData.oc;
  const oName = tokenData.ut === 'VRU' ? reqBody.oName : tokenData.on; 
  return {
    _id: uuidv4(),
    orgId, oCode, oName,
    entId: reqBody.entId,
    eCode:reqBody.eCode,
    eName: reqBody.eName,
    branch: reqBody.branch || '',
    bName: reqBody.branchName || '',
    bCode: reqBody.branchCode || '',

    blckdFor: reqBody.blockFor,
    blckdDt,
    blckdDtStr: blckdDt + currentUTC.currUTCTmStr,
    blckdSlotType: reqBody.slotType,
    blckdStatus: reqBody.status,

    cuType: tokenData.ut,
    cUser: tokenData.iss,
    cuName: tokenData.un,
    cDtTm: currentUTC.currUTCDtTmNum,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: tokenData.ur,
    uUser: tokenData.iss,
    uuName: tokenData.un,
    uDtTm: currentUTC.currUTCDtTmNum,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }
}

// branch: 'Barbeque Holic',
// blockDate: '2023-08-02',
// slotType: 'Lunch',
// status: 'Active'
