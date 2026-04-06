/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsUsersGSI = require('../schemas/CustsUsersGSI');
const CustsUsersGSIClsd = require('../schemas/CustsUsersGSIClsd');
const CustsUsrsGsiDaosImpl = require('../daosimplements/CustsUsrsGsiDaoImpl');
const CustsUsrsGsiDaos = require('../daos/CustsUsrsGsiDaos');
const CustsUsrsGsiSrvcImpl = require('./CustsUsrsGsiSrvcImpl');
const DashbrdAnltcsSrvc = require('./DashbrdAnltcsSrvc');

const deleteGsiData = () => {
  const dtObj = CustsUsrsGsiDaosImpl.deleteManyGsi();
  CustsUsrsGsiDaos.deleteManyGsiData(dtObj, (resObj1) => { });
}

const createGsiAnalysisData = () => {
  const query = CustsUsrsGsiDaosImpl.getSumOfGsiData();
  CustsUsrsGsiDaos.getCustsGsiListByAgg(query, (resObj1) => {
    if (resObj1.status == '200') {
      CustsUsrsGsiSrvcImpl.createGsiAnlysData(0, resObj1.resData.result);
    }
  });
}

const getCustsGsiList = (reqBody, tData, callback) => {
  CustsUsrsGsiSrvcImpl.getCustsGsiList(reqBody, tData, callback);
}

const postCustsGsiCreate = (reqBody, tData, callback) => {
  const crtObj = CustsUsrsGsiDaosImpl.setCustsGsiData(reqBody, tData);
  const data = new CustsUsersGSI(crtObj);
  CustsUsrsGsiDaos.createData(data, (resObj) => {
      callback(resObj);
    if (resObj.status == '200') {
      const data1 = new CustsUsersGSIClsd(crtObj);
      CustsUsrsGsiDaos.createData(data1, (resObj1) => {});
      DashbrdAnltcsSrvc.upsertAnltcsFrmGsi(crtObj, tData, 'create', null, (resObj) => {});
    }
  });
}

const getCustsGsiOExpCount = (reqBody, tData, callback) => {
  const obj = CustsUsrsGsiDaosImpl.getCustsGsiOExpCount(reqBody, tData);
  CustsUsrsGsiDaos.getCustsGsiListByAgg(obj, callback);
}

const custsGsiUpdate = (reqBody, tData, callback) => {
  const qry = CustsUsrsGsiDaosImpl.custGsiViewQry(reqBody.id);
  CustsUsrsGsiDaos.getCustsGsiView(qry, (res) => {
    if (res.status == '200') {
      const oldData = Object.assign({}, res.resData.result.toObject());
      const updObj = CustsUsrsGsiDaosImpl.setGsiUpData(reqBody, tData);
      CustsUsrsGsiDaos.custsGsiUpdate(qry, updObj, (resObj) => {
        callback(resObj);
        if (resObj.status == '200') {
          const data = Object.assign({}, resObj.resData.result.toObject())
          CustsUsrsGsiDaos.updateCustsGsiClsd(qry, updObj, (resObj1) => {});
          data['slot'] = data?.dineSlot.includes('Lunch') ? 'Lunch' : 'Dinner';
          oldData['slot'] = oldData?.dineSlot.includes('Lunch') ? 'Lunch' : 'Dinner';
          DashbrdAnltcsSrvc.upsertAnltcsFrmGsi(data, tData, 'update', oldData, (resObj) => {});
        }
      });
    } else {
      callback(res);
    }
  });
}

const getCustsGsiView = (id, callback) => {
  const qry = CustsUsrsGsiDaosImpl.custGsiViewQry(id);
  CustsUsrsGsiDaos.getCustsGsiView(qry, callback);
}

const getCustsGsiAvgCountByMnth = (reqBody, tData, callback) => {
  const qry = CustsUsrsGsiDaosImpl.getCustsGsiAvgCountByMnth(reqBody, tData);
  CustsUsrsGsiDaos.getCustsGsiListByAgg(qry, callback);
}

module.exports = {
  deleteGsiData, createGsiAnalysisData, getCustsGsiList, postCustsGsiCreate, getCustsGsiOExpCount, custsGsiUpdate, getCustsGsiView, getCustsGsiAvgCountByMnth
};
