/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var moment = require('moment');

const SamparkApiCall = require('./SamparkApiCall');
const SetRes = require('../SetRes');
const SamparkSrvcImpl = require('./SamparkSrvcImpl');
const CustsCallLogsDaoImpl = require('../daosimplements/CustsCallLogsDaoImpl');
const CustsCallLogsDao = require('../daos/CustsCallLogsDao');
const entitiesJson = require('../../assets/dbdata/swit_admin_entsSrvcIds.json');

const uName = 'Barbeque Holic';
const uID = 'BBQHAUID100001';
const refUID = '9133921922';

const postCronjobForMissedCallsApi = () => {
  const query = CustsCallLogsDaoImpl.getLastMissedCallData();
  const sort = { cDtStr: -1 };
  const tData = {iss: uID, uid: refUID, un: uName};
  CustsCallLogsDao.getAdminCustCallLogsList(1, 1, { query, sort }, (resObj) => {
    if (resObj.status == '200') {
      const data = resObj.resData.result.adminCustCallLogsList[0];
      const startDay = moment(data.cDtStr).add(1, 'seconds').format('YYYY-MM-DD HH:mm:ss');
      const endDay = moment.utc().add(330, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      const reqBody = { startDay, endDay };
      getCustsMissedCallsData(reqBody, tData, (resObj) => { });
    } else {
      getCustsMissedCallsData({}, tData, (resObj) => { });
    }
  });
}

const postAdminUserAgentCall = (reqBody, ipv4, callback) => {
  SamparkApiCall.postAdminUserAgentCall(reqBody, ipv4, (resObj) => {
    const resData = SetRes.successRes(resObj)
    callback(resData);
  });
}

const postAdminUserAgentCallClose = (reqBody, ipv4, callback) => {
  SamparkApiCall.postAdminUserAgentCallClose(reqBody, ipv4, (resObj) => {
      const resData = SetRes.successRes(resObj)
      callback(resData)
  });
}

const postAdminUserAgentCallHangup = (reqBody, ipv4, callback) => {
  SamparkApiCall.postAdminUserAgentCallHangup(reqBody, ipv4, (resObj) => {
      const resData = SetRes.successRes(resObj)
      callback(resData)
});
}

const postAdminUserAgentBreakStart = (reqBody, ipv4, callback) => {
  SamparkApiCall.postAdminUserAgentBreakStart(reqBody, ipv4, (resObj) => {
      const resData = SetRes.successRes(resObj)
      callback(resData)
});
}

const postAdminUserAgentBreakEnd = (reqBody, ipv4, callback) => {
  SamparkApiCall.postAdminUserAgentBreakEnd(reqBody, ipv4, (resObj) => {
      const resData = SetRes.successRes(resObj)
      callback(resData)
});
}

const postAdminUserAgentCallHoldStart = (reqBody, ipv4, callback) => {
  SamparkApiCall.postAdminUserAgentCallHoldStart(reqBody, ipv4, (resObj) => {
      const resData = SetRes.successRes(resObj)
      callback(resData)
});
}

const postAdminUserAgentCallHoldStop = (reqBody, ipv4, callback) => {
  SamparkApiCall.postAdminUserAgentCallHoldStop(reqBody, ipv4, (resObj) => {
      const resData = SetRes.successRes(resObj)
      callback(resData)
});
}

const postAdminUserAgentCallRedial = (reqBody, ipv4, callback) => {
  SamparkApiCall.postAdminUserAgentCallRedial(reqBody, ipv4, (resObj) => {
      const resData = SetRes.successRes(resObj)
      callback(resData)
  });
}

const postAdminUserAgentInfo = (reqBody, ipv4, callback) => {
  SamparkApiCall.getUserAgentInfo(reqBody, ipv4, (resObj) => {
      const resData = SetRes.successRes(resObj.data)
      callback(resData);
  });
}

const postCustsMissedCallsApi = (tData, callback) => {
  const query = CustsCallLogsDaoImpl.getLastMissedCallData();
  const sort = { cDtStr: -1 };
  CustsCallLogsDao.getAdminCustCallLogsList(1, 1, { query, sort }, (resObj) => {
    if (resObj.status == '200') {
      const data = resObj.resData.result.adminCustCallLogsList[0];
      const startDay = moment(data.cDtStr).add(1, 'seconds').format('YYYY-MM-DD HH:mm:ss');
      const endDay = moment.utc().add(330, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      const reqBody = { startDay, endDay };
      getCustsMissedCallsData(reqBody, tData, callback);
    } else {
      getCustsMissedCallsData({}, tData, callback);
    }
  });
}

module.exports = {
  postCronjobForMissedCallsApi, postAdminUserAgentCall, postAdminUserAgentCallClose, postAdminUserAgentCallHangup,
  postAdminUserAgentBreakStart, postAdminUserAgentBreakEnd, postAdminUserAgentCallHoldStart,
  postAdminUserAgentCallHoldStop, postAdminUserAgentCallRedial, postAdminUserAgentInfo, postCustsMissedCallsApi
};

const getCustsMissedCallsData = (reqBody, tData, callback) => {
  const startDay = reqBody.startDay ? reqBody.startDay : moment.utc().add(330, 'minutes').startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const endDay = reqBody.endDay ? reqBody.endDay : moment.utc().add(330, 'minutes').endOf('day').format('YYYY-MM-DD HH:mm:ss');
  createMissedCalls(startDay, endDay, tData, 0, (resObj) => {
    callback(resObj);
  })
}

const createMissedCalls = (startDay, endDay, tData, i, callback) => {
  if(i < entitiesJson.length){
    const entData = entitiesJson[i];
    SamparkApiCall.postCustsMissedCallsApi(startDay, endDay, entData.serviceId, (resObj) => {
      if(resObj.data && resObj.data.count > 0){
        SamparkSrvcImpl.createMissedCalls(resObj.data.data, entData.eCode, tData, (resObj) => {
          createMissedCalls(startDay, endDay, tData, i+1, callback);
        });
      } else {
        createMissedCalls(startDay, endDay, tData, i+1, callback);
      }
    });
  } else {
    const resData = SetRes.successRes('Success');
    callback(resData);
  }
}