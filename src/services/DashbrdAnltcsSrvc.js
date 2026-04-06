/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Dec 2025
 */

const DashbrdAnltcsDaoImpl = require('../daosimplements/DashbrdAnltcsDaoImpl');
const DashbrdAnltcsDao = require('../daos/DashbrdAnltcsDao');
const logger = require('../lib/logger');
const SetRes = require('../SetRes');

const getDashbrdAnltcsList = (reqBody, tokenData, callback) => {
  const obj = DashbrdAnltcsDaoImpl.getListQry(reqBody, tokenData);
  const mRq = { ...reqBody, dateType: 'Monthly' };
  const mnlyQry = DashbrdAnltcsDaoImpl.getAnalyticsByRange(mRq, tokenData);
  const yRq = { ...reqBody, dateType: 'Yearly' };
  const yrlyQry = DashbrdAnltcsDaoImpl.getAnalyticsByRange(yRq, tokenData);
  Promise.all([
    new Promise(resolve => DashbrdAnltcsDao.getDashbrdAnltcsList(obj.qry, resolve)),
    new Promise(resolve => DashbrdAnltcsDao.getDashbrdMnthAnltcsList(mnlyQry, resolve)),
    new Promise(resolve => DashbrdAnltcsDao.getDashbrdYrAnltcsList(yrlyQry, resolve)),
    new Promise(resolve => DashbrdAnltcsDao.getDashbrdAnltcsList(obj.dlyQry, resolve)),
  ]).then(([dlyDt, mntlyDt, yrlyDt, dlyTlData]) => {
    const dailyData = dlyDt.status == '200' ? dlyDt.resData.result : [];
    const monthlyData = mntlyDt.status == '200' ? mntlyDt.resData.result : [];
    const yearlyData = yrlyDt.status == '200' ? yrlyDt.resData.result : [];
    const dailyTotalData = dlyTlData.status == '200' ? dlyTlData.resData.result : [];
    const resData = { dailyData, monthlyData, yearlyData, dailyTotalData }
    const result = SetRes.successRes(resData);
    callback(result);
  }).catch(error => {
    logger.error('Error getting dashboard analytics list: ' + error);
    if (callback) callback(SetRes.unKnownErr({ msg: 'Failed to get dashboard analytics list' }));
  })
};

const getDashbrdAnltcsView = (recordId, callback) => {
  const qry = DashbrdAnltcsDaoImpl.getViewQry(recordId);
  DashbrdAnltcsDao.getDashbrdAnltcsView(qry, callback);
};

const upsertAnltcsFrmBkg = (bData, tData, type, oldData = null) => {
  if (type == 'update' && oldData && (oldData.bDt !== bData.bDt || oldData.rFor !== bData.rFor)) {
    handleBookingDateChange(bData, oldData, tData);
  }
  bData['rDtStr'] = bData.bDt; bData['slot'] = bData.rFor;
  const dailyQry = DashbrdAnltcsDaoImpl.getQry(bData, 'day');
  const monthQry = DashbrdAnltcsDaoImpl.getQry(bData, 'month');
  const yearQry = DashbrdAnltcsDaoImpl.getQry(bData, 'year');
  if (type == 'create' || type == 'update') {
    const dlyUpObj = DashbrdAnltcsDaoImpl.getBkgCrtUpdObj(bData, tData, oldData, 'day', type);
    const mntUpObj = DashbrdAnltcsDaoImpl.getBkgCrtUpdObj(bData, tData, oldData, 'month', type);
    const yrUpObj = DashbrdAnltcsDaoImpl.getBkgCrtUpdObj(bData, tData, oldData, 'year', type);
    const data = { dailyQry, monthQry, yearQry, dlyUpObj, mntUpObj, yrUpObj, bData }
    upFunc(data, () => { });
  } else {
    const dlyUpObj = DashbrdAnltcsDaoImpl.getBkgStsChgUpdObj(bData, tData, oldData);
    const data = { dailyQry, monthQry, yearQry, dlyUpObj, mntUpObj: dlyUpObj, yrUpObj: dlyUpObj, bData };
    upFunc(data, () => { });
  }
};

const upsertAnltcsFrmPrvtDng = (bData, tData, type, oldData = null) => {
  if (type == 'update' && oldData && (oldData.bDt !== bData.bDt || oldData.bookingFor !== bData.bookingFor)) {
    handlePrvtDngDateChange(bData, oldData, tData);
  }
  bData['rDtStr'] = bData.bDt; bData['slot'] = bData.bookingFor;
  const dailyQry = DashbrdAnltcsDaoImpl.getQry(bData, 'day');
  const monthQry = DashbrdAnltcsDaoImpl.getQry(bData, 'month');
  const yearQry = DashbrdAnltcsDaoImpl.getQry(bData, 'year');
  if (type == 'create' || type == 'update') {
    const dlyUpObj = DashbrdAnltcsDaoImpl.getPrvtDngCrtUpdObj(bData, tData, oldData, 'day', type);
    const mntUpObj = DashbrdAnltcsDaoImpl.getPrvtDngCrtUpdObj(bData, tData, oldData, 'month', type);
    const yrUpObj = DashbrdAnltcsDaoImpl.getPrvtDngCrtUpdObj(bData, tData, oldData, 'year', type);
    const data = { dailyQry, monthQry, yearQry, dlyUpObj, mntUpObj, yrUpObj, bData }
    upFunc(data, () => { });
  } else {
    const dlyUpObj = DashbrdAnltcsDaoImpl.getPrvtDngStsChgUpdObj(bData, tData, oldData);
    const data = { dailyQry, monthQry, yearQry, dlyUpObj, mntUpObj: dlyUpObj, yrUpObj: dlyUpObj, bData };
    upFunc(data, () => { });
  }
};

const handlePrvtDngDateChange = (bData, oldData, tData) => {
  const processAnalytics = (data, date, inc) => {
    const obj = { ...data, rDtStr: date, slot: data.bookingFor };
    const dlyUpObj = DashbrdAnltcsDaoImpl.getPrvtDngDtChgUpdObj(obj, tData, 'day', inc);
    const mntUpObj = DashbrdAnltcsDaoImpl.getPrvtDngDtChgUpdObj(obj, tData, 'month', inc);
    const yrUpObj = DashbrdAnltcsDaoImpl.getPrvtDngDtChgUpdObj(obj, tData, 'year', inc);
    const dailyQry = DashbrdAnltcsDaoImpl.getQry(obj, 'day');
    const monthQry = DashbrdAnltcsDaoImpl.getQry(obj, 'month');
    const yearQry = DashbrdAnltcsDaoImpl.getQry(obj, 'year');
    upFunc({ dailyQry, monthQry, yearQry, dlyUpObj, mntUpObj, yrUpObj, bData: obj }, () => { });
  };
  processAnalytics(oldData, oldData.bDt, -1);
  processAnalytics(bData, bData.bDt, 1);
};

const upsertAnltcsFrmFdbk = (fdBckData, tData, callback) => {
  const fData = Object.assign({}, fdBckData.toObject());
  fData.rDtStr = fData.cDtStr;
  fData.slot = 'Lunch';
  const dailyQry = DashbrdAnltcsDaoImpl.getQry(fData, 'day');
  const monthQry = DashbrdAnltcsDaoImpl.getQry(fData, 'month');
  const yearQry = DashbrdAnltcsDaoImpl.getQry(fData, 'year');
  DashbrdAnltcsDao.getDashbrdAnltcsView(dailyQry, (dayRes) => {
    const dayOld = dayRes.status == '200' ? dayRes.resData.result : null;
    const dlyUpObj = DashbrdAnltcsDaoImpl.getFdbkCrtUpdObj(fData, tData, 'day', dayOld);
    DashbrdAnltcsDao.getDashbrdMnthlyAnltcsView(monthQry, (mntRes) => {
      const monthOld = mntRes.status == '200' ? mntRes.resData.result : null;
      const mntUpObj = DashbrdAnltcsDaoImpl.getFdbkCrtUpdObj(fData, tData, 'month', monthOld);
      DashbrdAnltcsDao.getDashbrdYrlyAnltcsView(yearQry, (yrRes) => {
        const yearOld = yrRes.status == '200' ? yrRes.resData.result : null;
        const yrUpObj = DashbrdAnltcsDaoImpl.getFdbkCrtUpdObj(fData, tData, 'year', yearOld);
        const data = { dailyQry, monthQry, yearQry, dlyUpObj, mntUpObj, yrUpObj };
        upFunc(data, callback)
      });
    });
  });
};

const upsertAnltcsFrmGsi = (gData, tData, type, oldData = null, callback) => {
  if (type == 'update' && oldData && ((oldData.sDtStr !== gData.sDtStr) || oldData.slot !== gData.slot)) {
    handleGsiDateChange(gData, oldData, tData);
  }
  gData['rDtStr'] = gData.sDtStr;
  gData['slot'] = gData.dineSlot.includes('Lunch') ? 'Lunch' : 'Dinner';
  const dailyQry = DashbrdAnltcsDaoImpl.getQry(gData, 'day');
  const monthQry = DashbrdAnltcsDaoImpl.getQry(gData, 'month');
  const yearQry = DashbrdAnltcsDaoImpl.getQry(gData, 'year');
  const dlyUpObj = DashbrdAnltcsDaoImpl.getGsiCrtUpdObj(gData, tData, 'day', type, oldData);
  const mntUpObj = DashbrdAnltcsDaoImpl.getGsiCrtUpdObj(gData, tData, 'month', type, oldData);
  const yrUpObj = DashbrdAnltcsDaoImpl.getGsiCrtUpdObj(gData, tData, 'year', type, oldData);
  const data = { dailyQry, monthQry, yearQry, dlyUpObj, mntUpObj, yrUpObj }
  upFunc(data, callback);
}

const upsertAnltcsFrmFranchise = (fData, tData, type, oldData = null) => {
  fData['rDtStr'] = fData.cDtStr
  fData['slot'] = 'Lunch';
  const dailyQry = DashbrdAnltcsDaoImpl.getQry(fData, 'day');
  const monthQry = DashbrdAnltcsDaoImpl.getQry(fData, 'month');
  const yearQry = DashbrdAnltcsDaoImpl.getQry(fData, 'year');
  if (type === 'create') {
    const dlyUpObj = DashbrdAnltcsDaoImpl.getFrnchsUpdObj(fData, tData, 'day');
    const mntUpObj = DashbrdAnltcsDaoImpl.getFrnchsUpdObj(fData, tData, 'month');
    const yrUpObj = DashbrdAnltcsDaoImpl.getFrnchsUpdObj(fData, tData, 'year');
    const data = { dailyQry, monthQry, yearQry, dlyUpObj, mntUpObj, yrUpObj }
    upFunc(data, () => { });
  } else {
    const dlyUpObj = DashbrdAnltcsDaoImpl.getFrnchsStsChgUpdObj(fData.fStatus, oldData.fStatus, tData);
    const mntUpObj = DashbrdAnltcsDaoImpl.getFrnchsStsChgUpdObj(fData.fStatus, oldData.fStatus, tData);
    const yrUpObj = DashbrdAnltcsDaoImpl.getFrnchsStsChgUpdObj(fData.fStatus, oldData.fStatus, tData);
    const data = { dailyQry, monthQry, yearQry, dlyUpObj, mntUpObj, yrUpObj }
    upFunc(data, () => { });
  }
}

// --- EXPORTS ---
module.exports = {
  getDashbrdAnltcsList, getDashbrdAnltcsView, upsertAnltcsFrmBkg, upsertAnltcsFrmPrvtDng,
  upsertAnltcsFrmFdbk, upsertAnltcsFrmGsi, upsertAnltcsFrmFranchise
};

const upFunc = (data, callback) => {
  const { dlyUpObj, mntUpObj, yrUpObj, dailyQry, monthQry, yearQry } = data;
  const options = DashbrdAnltcsDaoImpl.getUpdOpts();
  Promise.all([
    DashbrdAnltcsDao.updateDashbrdAnltcs(dailyQry, dlyUpObj.obj, options, () => { }),
    DashbrdAnltcsDao.updateDashbrdAnltcsClsd(dailyQry, dlyUpObj.obj, options, () => { }),
    DashbrdAnltcsDao.updateDashbrdMnthAnltcs(monthQry, mntUpObj.obj, options, () => { }),
    DashbrdAnltcsDao.updateDashbrdYrAnltcs(yearQry, yrUpObj.obj, options, () => { }),
  ]).then(() => {
    if (callback) callback(SetRes.successRes({ msg: 'Dashboard analytics updated successfully' }));
  }).catch(error => {
    logger.error('Error updating dashboard analytics: ' + error);
    if (callback) callback(SetRes.unKnownErr({ msg: 'Failed to update dashboard analytics' }));
  });
}

const handleBookingDateChange = (bData, oldData, tData) => {
  const processAnalytics = (data, date, inc) => {
    const obj = { ...data, rDtStr: date, slot: data.rFor };
    const dlyUpObj = DashbrdAnltcsDaoImpl.getBkgDtChgUpdObj(obj, tData, 'day', inc);
    const mntUpObj = DashbrdAnltcsDaoImpl.getBkgDtChgUpdObj(obj, tData, 'month', inc);
    const yrUpObj = DashbrdAnltcsDaoImpl.getBkgDtChgUpdObj(obj, tData, 'year', inc);
    const dailyQry = DashbrdAnltcsDaoImpl.getQry(obj, 'day');
    const monthQry = DashbrdAnltcsDaoImpl.getQry(obj, 'month');
    const yearQry = DashbrdAnltcsDaoImpl.getQry(obj, 'year');
    const dt = { dailyQry, monthQry, yearQry, dlyUpObj, mntUpObj, yrUpObj, bData: obj }
    upFunc(dt, () => { });
  };
  processAnalytics(oldData, oldData.bDt, -1);
  processAnalytics(bData, bData.bDt, 1);
};


const handleGsiDateChange = (gData, oldData, tData) => {
  const processGsiAnalytics = (data, date, inc) => {
    const obj = { ...data, rDtStr: date, slot: data.dineSlot.includes('Lunch') ? 'Lunch' : 'Dinner' };
    const dlyUpObj = DashbrdAnltcsDaoImpl.getGsiDtChgUpdObj(obj, tData, 'day', inc);
    const mntUpObj = DashbrdAnltcsDaoImpl.getGsiDtChgUpdObj(obj, tData, 'month', inc);
    const yrUpObj = DashbrdAnltcsDaoImpl.getGsiDtChgUpdObj(obj, tData, 'year', inc);
    const dailyQry = DashbrdAnltcsDaoImpl.getQry(obj, 'day');
    const monthQry = DashbrdAnltcsDaoImpl.getQry(obj, 'month');
    const yearQry = DashbrdAnltcsDaoImpl.getQry(obj, 'year');
    upFunc({ dailyQry, monthQry, yearQry, dlyUpObj, mntUpObj, yrUpObj, bData: obj }, () => { });
  };
  processGsiAnalytics(oldData, oldData.sDtStr, -1);
  processGsiAnalytics(gData, gData.sDtStr, 1);
};
