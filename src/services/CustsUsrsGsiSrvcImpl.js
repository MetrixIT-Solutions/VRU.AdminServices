
/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const async = require('async');

const CustsUsrsGsiDaosImpl = require('../daosimplements/CustsUsrsGsiDaoImpl');
const CustsUsrsGsiDaos = require('../daos/CustsUsrsGsiDaos');
const SetRes = require('../SetRes');
const CustsUsersGSIAns = require('../schemas/CustsUsersGSIAns');

const createGsiAnlysData = (i, resData) => {
  if(i < resData.length) {
    const data = resData[i];
    const obj1 = CustsUsrsGsiDaosImpl.getGsiAnalysisData(data);
    CustsUsrsGsiDaos.getGsiAnalysisData(obj1, (resObj) => {
      if(resObj.status == '200') {
        const qObj = CustsUsrsGsiDaosImpl.updateGsiAnalysisData(data, resObj.resData.result);
        CustsUsrsGsiDaos.updateGsiAnalysisData(qObj.query, qObj.upObj, (resObj2) => {
          createGsiAnlysData(i + 1, resData);
        });
      } else {
        const obj2 = CustsUsrsGsiDaosImpl.createGsiAnalysisData(data);
        const crtObj = new CustsUsersGSIAns(obj2);
        CustsUsrsGsiDaos.createData(crtObj, (resObj3) => {
          createGsiAnlysData(i + 1, resData);
        });
      }
    });
  }
}

const getCustsGsiList = (reqBody, tData, callback) => {
  const qry = CustsUsrsGsiDaosImpl.custUsrsGsiListQry(reqBody, tData);
  if (reqBody.export) {
    CustsUsrsGsiDaos.getCustsGsiTotalList(qry, callback);
  } else {
  async.parallel([
    (cb) => {
      CustsUsrsGsiDaos.getCustsGsiList(qry, reqBody, (resObj) => {
        cb(null, resObj.resData.result);
      });
    },
    (cb) => {
      const obj = CustsUsrsGsiDaosImpl.getGsiAvgCount(reqBody, tData);
      CustsUsrsGsiDaos.getCustsGsiListByAgg(obj, (resObj1) => {
        cb(null, resObj1.resData.result);
      });
    },
  ], (err, result) => {
    if (err) {
      logger.error('There was an Error in srvc/CustsUsrsGsiSrvcImpl.js at getCustsGsiList:' + err);
    } else if(result[0]?.custsGsiListCount){
      let resData = {custsGsiListCount: result[0].custsGsiListCount, custsGsiList: result[0].custsGsiList, avgGsiCounts: result[1]};
      const data = SetRes.successRes(resData);
      callback(data);
    } else {
      const data = SetRes.noData({custsGsiListCount: 0, custsGsiList: [], avgGsiCounts: []});
      callback(data);
    }

  });
  }
}

module.exports = {
  createGsiAnlysData, getCustsGsiList
}