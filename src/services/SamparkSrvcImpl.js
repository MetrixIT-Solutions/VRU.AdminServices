/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var moment = require('moment');

const AdminUsersDao = require('../daos/AdminUsersDao');
const AdminUsersDaoImpl = require('../daosimplements/AdminUsersDaoImpl');
const CustUsersDaoImpl = require('../daosimplements/CustUsersDaoImpl');
const CustUsersDao = require('../daos/CustUsersDao');
const CustsCallLogsDaoImpl = require('../daosimplements/CustsCallLogsDaoImpl');
const CustsCallLogs = require('../schemas/CustsCallLogs');
const CustsCallLogsDao = require('../daos/CustsCallLogsDao');
const AdminEntisDao = require('../daos/AdminEntisDao ');
const AdminEntiDaoImpl = require('../daosimplements/AdminEntiDaoImpl');


const createMissedCalls = (resData, entCode, tData, callback) => {
  const query = AdminEntiDaoImpl.postEntiViewByEntCode(entCode);
  AdminEntisDao.postAdminEntisView(query, (resObj) => {
    resObj.status == '200' && createCallAgentMissedCall(resData, resObj.resData.result, tData, 0, (resObj) => {})
    callback(resObj);
  })
}

module.exports = {
  createMissedCalls
};

const getCustomerData = (data, tData, entData, adData, callback) => {
  const date = data.c_start_time;
  const msdClDtmStr = date.slice(0, date.length - 2);
  const msdClDtmNum = moment(msdClDtmStr).valueOf();
  const msdClDtTm = new Date(msdClDtmStr);
  const callData = { callCategory: 'Inbound', callType: 'Incoming', callFor: 'Incoming', callStatus: 'Missed Call', callogs: 'Missed Call', cNum: 'SMPRKMSD_' + data.c_number, msdClDtmStr, msdClDtmNum, msdClDtTm, ...entData };
  const reqBody = { mobNum: data.c_src };
  const query = CustUsersDaoImpl.userViewQry(reqBody, tData);
  CustUsersDao.postCustuserView(query, (resObj) => {
    const customerData = resObj.status == '200' ? resObj.resData.result : {mobCc: '+91', mobNum: data.c_src, mobCcNum: '+91'+ data.c_src};
    const body = { customerData, ...callData };
    const createData = CustsCallLogsDaoImpl.postCustsCallLogCreate(body, adData, tData, 'missedcall');
    const createObj = new CustsCallLogs(createData);
    CustsCallLogsDao.commonCreateFunc(createObj, (resObj2) => {
      callback(resObj2);
    });
  });
}

const createCallAgentMissedCall = (resData, entRes, tData, i, callback) => {
  const entData =  {orgId: entRes.orgId, oName: entRes.oName, oCode: entRes.oCode, entId: entRes._id, eName: entRes.eName, eCode: entRes.eCode}
  if (i < resData.length) {
    const data = resData[i];
    if (data.c_agent_id) {
      const query = AdminUsersDaoImpl.getAdminUserCallAgentData(data.c_agent_id);
      AdminUsersDao.getAdminUserData(query, (resObj) => {
        if (resObj.status == '200') {
          const adData = {aUser: resObj.resData.result._id, aRefUID: resObj.resData.result.refUID, aName: resObj.resData.result.name}
          getCustomerData(data, tData, entData, adData, (resObj1) => {
            createCallAgentMissedCall(resData, entRes, tData, i+1, callback);
            callback(resObj1)
          });
        } else {
          callAgentMissedCallCreate(data, tData, entData, (resObj2) => {
            createCallAgentMissedCall(resData, entRes, tData, i+1, callback);
            callback(resObj2)
          });
        }
      });
    } else {
      callAgentMissedCallCreate(data, tData, entData, (resObj3) => {
        createCallAgentMissedCall(resData, entRes, tData, i+1, callback);
        callback(resObj3)
      });
    }
  } else {
    callback('No Data')
  }
}

const callAgentMissedCallCreate = (data, tData, entData, callback) => {
  const query = { delFlag: false, refUID: 'callagent' };
  AdminUsersDao.getAdminUserData(query, (resObj) => {
    const adData = resObj.status == '200' ? {aUser: resObj.resData.result._id, aRefUID: resObj.resData.result.refUID, aName: resObj.resData.result.name} : {aUser: tData.iss, aRefUID: tData.uid, aName: tData.un};
    getCustomerData(data, tData, entData, adData, (resObj1) => {
      callback(resObj1);
    });
  });
}
