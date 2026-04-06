/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const custsTableBlckdDts = require('../schemas/CustsTableBlckdDts');
const CustBlckedDtImpl = require('../daosimplements/CustBlckedDtImpl');
const custsTableBlckdDtsDao = require('../daos/CustsTableBlckdDtsDao');
const SetRes = require('../SetRes');

const tableBolckedCreate = (reqBody, tokenData, callback) => {
  if(tokenData.ut !== 'VRU' || (tokenData.ut === 'VRU' && reqBody.orgId && reqBody.oCode && reqBody.oName)) {
    const obj = CustBlckedDtImpl.tableBolckedCreate(reqBody, tokenData);
    const custBlackedTable = new custsTableBlckdDts(obj);
    custsTableBlckdDtsDao.tableBolckedCreate(custBlackedTable, callback);
  } else {
    const rf = SetRes.msdReqFields();
    callback(rf);
  }
}

const tableBolckedList = (reqBody, tData, callback) => {
  const obj = CustBlckedDtImpl.tableBolckedList(reqBody, tData);
  custsTableBlckdDtsDao.tableBolckedList(reqBody.actPgNum, reqBody.rLimit, obj, callback);
}

const tableBolckedStatusUpdate = (reqBody, tokenData, callback) => {
	const obj = CustBlckedDtImpl.editTableBlckedStatusData(reqBody, tokenData);
	custsTableBlckdDtsDao.tableBolckedStatusUpdate(obj.query, obj.updateObj, callback);
}

module.exports = {
  tableBolckedCreate, tableBolckedList, tableBolckedStatusUpdate
}