/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsCallLogsDaoImpl = require('../daosimplements/CustsCallLogsDaoImpl');
const CustsCallLogs = require('../schemas/CustsCallLogs');
const CustsCallLogsClsd = require('../schemas/CustsCallLogsClsd');
const CustsCallLogsDao = require('../daos/CustsCallLogsDao');
const SetRes = require('../SetRes');
const async = require('async');

const postCustsCallLogCreate = (reqBody, tData, callback) => {
  if (tData.ut !== 'VRU' || (tData.ut === 'VRU' && reqBody.orgId && reqBody.oCode && reqBody.oName)) {
    const adData = { aUser: tData.iss, aRefUID: tData.uid, aName: tData.un };
    const obj = CustsCallLogsDaoImpl.postCustsCallLogCreate(reqBody, adData, tData, '');
    const createData = new CustsCallLogs(obj);
    CustsCallLogsDao.commonCreateFunc(createData, callback);
  } else {
    const rf = SetRes.msdReqFields();
    callback(rf);
  }
}

const postAdminCustCallLogList = (reqBody, tokenData, callback) => {
  if((tokenData.ur === 'Call Agent') || (tokenData.ut === 'Board' && (tokenData.ur === 'Admin' || tokenData.ur === 'Director') || (tokenData.ut === 'VRU') || (tokenData.ut === 'Entity' && (tokenData.ur === 'Admin')))) {
    const obj = CustsCallLogsDaoImpl.getAdminCustCallLogsList(reqBody, tokenData);
    CustsCallLogsDao.getAdminCustCallLogsList(reqBody.actPgNum, reqBody.rLimit, obj, callback);
  } else {
    const ad = SetRes.accessDenied({});
    callback(ad);
  }
}

const getAdminCustCallLog = (recordId, tData, callback) => {
  const obj = CustsCallLogsDaoImpl.AdminCustCallLogView(recordId, tData);
  CustsCallLogsDao.getAdminCustCallLogData(obj, callback);
}

const setCallLogsClosed = () => {
  const qry = CustsCallLogsDaoImpl.callLogsClsdQry();
  CustsCallLogsDao.custCallLogsList(qry, {}, resObj => {
    setCallLogsClosedData(resObj.resData.result, 0, res => {});
  });
}

const postAdminCustCallLogCountByStatus = (reqBody, tData, callback) => {
  async.parallel([
    (cb) => {
      const query1 = CustsCallLogsDaoImpl.adminCustCallLogsAllCount(reqBody, tData, 'All');
      CustsCallLogsDao.postAdminCustCallLogCountByStatus(query1, (resObj) => {
        cb(null, resObj.resData.result);
      });
    },
    (cb) => {
      const query1 = CustsCallLogsDaoImpl.adminCustCallLogsClosedCount(reqBody, tData, 'Closed')
      CustsCallLogsDao.postAdminCustCallLogCountByStatus(query1, (resObj1) => {
        cb(null, resObj1.resData.result);
      });
    },
    (cb) => {
      const query1 = CustsCallLogsDaoImpl.adminCustCallLogsCallbackCount(reqBody, tData, 'Callback')
      CustsCallLogsDao.postAdminCustCallLogCountByStatus(query1, (resObj2) => {
        cb(null, resObj2.resData.result);
      });
    },
    (cb) => {
      const query1 = CustsCallLogsDaoImpl.adminCustCallLogsNotAnsweredCount(reqBody, tData, 'Not Answered')
      CustsCallLogsDao.postAdminCustCallLogCountByStatus(query1, (resObj3) => {
        cb(null, resObj3.resData.result);
      });
    },
    (cb) => {
      const query1 = CustsCallLogsDaoImpl.adminCustCallLogsOthersCount(reqBody, tData, 'Other')
      CustsCallLogsDao.postAdminCustCallLogCountByStatus(query1, (resObj4) => {
        cb(null, resObj4.resData.result);
      });
    },(cb) => {
      const query1 = CustsCallLogsDaoImpl.adminCustCallLogsMissedCallCount(reqBody, tData, 'Missed Call')
      CustsCallLogsDao.postAdminCustCallLogCountByStatus(query1, (resObj5) => {
        cb(null, resObj5.resData.result);
      });
    }
  ],(err, result) => {
   if(err){
    logger.error('There was an Error in daos/DashboardDAO.js at postAdminCustCallLogCountByStatus:' + err);
   }
   const allCallLogsCount = result[0].length > 0 ? result[0][0] : {_id: 'All', count: 0};
   const closedCallLogsCount = result[1].length > 0 ? result[1][0] : {_id: 'Closed', count: 0};
   const callbackCallLogsCount = result[2].length > 0 ? result[2][0] : {_id: 'Callback', count: 0};
   const notAnsweredCallLogsCount = result[3].length > 0 ? result[3][0] : {_id: 'Not Answered', count: 0};
   const othersCallLogsCount = result[4].length > 0 ? result[4][0] : {_id: 'Other', count: 0};
   const missedCallCallLogsCount = result[5].length > 0 ? result[5][0] : {_id: 'Missed Call', count: 0};
   const responseObj = [allCallLogsCount, closedCallLogsCount, callbackCallLogsCount, notAnsweredCallLogsCount,
                      othersCallLogsCount, missedCallCallLogsCount]
   const result1 = SetRes.successRes(responseObj);
  callback(result1);

  });
}


module.exports = {
  postCustsCallLogCreate, postAdminCustCallLogList, getAdminCustCallLog,
  setCallLogsClosed, postAdminCustCallLogCountByStatus
};

const setCallLogsClosedData = (resData, i, callback) => {
  if (i < resData.length) {
    const data = resData[i];
    const qry = CustsCallLogsDaoImpl.dltClLogsQry(data._id);
    CustsCallLogsDao.deleteCallLogs(qry, resObj => {
      if (resObj.status == '200') {
        const clsData = CustsCallLogsDaoImpl.setCLClsdData(resObj.resData.result);
        const crtObj = new CustsCallLogsClsd(clsData);
        CustsCallLogsDao.commonCreateFunc(crtObj, res => {
        });
        setCallLogsClosedData(resData, i+1, callback);
      } else {
        setCallLogsClosedData(resData, i+1, callback);
      }
    })
  } else {
    callback('success');
  }
}