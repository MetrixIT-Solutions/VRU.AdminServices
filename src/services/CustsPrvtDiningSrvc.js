/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const async = require('async');
const CustsPrivateDining = require('../schemas/CustsPrivateDining');
const CustsPrivateDiningLcs = require('../schemas/CustsPrivateDiningLcs');
const CustsPrvtDiningDaoImpl = require('../daosimplements/CustsPrvtDiningDaoImpl');
const CustsPrvtDiningDao = require('../daos/CustsPrvtDiningDao');
const Mail = require('../../config/mail');
const config = require('config');
const SetRes = require('../SetRes');
const DashbrdAnltcsSrvc = require('./DashbrdAnltcsSrvc');
const BranchDao = require('../daos/BranchDao');
const BranchDaoImpl = require('../daosimplements/BranchDaoImpl');

//----------------------BEGIN Private Dining Apis----------------------//

const createPrivateDining = (reqBody, tData, callback) => {
  if(tData.ut !== 'VRU' || (tData.ut === 'VRU' && reqBody.orgId && reqBody.oCode && reqBody.oName)) {
    const obj = CustsPrvtDiningDaoImpl.createPrivateDining(reqBody, tData);
    const createObj = new CustsPrivateDining(obj);
    CustsPrvtDiningDao.commonCreateFunc(createObj, (resObj) => {
        callback(resObj)
      if (resObj.status == '200') {
        const data = Object.assign({}, resObj.resData.result.toObject())
        const lcsData = CustsPrvtDiningDaoImpl.privateDiningLcsCreate(data, tData);
        const lcsObj = new CustsPrivateDiningLcs(lcsData);
        CustsPrvtDiningDao.commonCreateFunc(lcsObj, () => { });
        if (resObj.status == '200') {
          const branchId = resObj.resData.result.branch;
          const getQuery = BranchDaoImpl.getBranchDatabyId(branchId);
          BranchDao.getAdminBranchList(getQuery, (resObj3) => {
            if (resObj3.status == '200') {
              sendBranchMails(resObj.resData.result, resObj3.resData.result.emID);
            }
          });
        }
        DashbrdAnltcsSrvc.upsertAnltcsFrmPrvtDng(data, tData, 'create');
      } 
    });
  } else {
    const rf = SetRes.msdReqFields();
    callback(rf);
  }
}

const getPrivateDiningList = (reqBody, tData, callback) => {
  const query = CustsPrvtDiningDaoImpl.getPrivateDiningList(tData, reqBody);
  CustsPrvtDiningDao.getPrivateDiningList(query, reqBody, callback);
}

const privateDiningView = (reqBody, tData, callback) => {
  const query = CustsPrvtDiningDaoImpl.privateDiningView(reqBody, tData);
  CustsPrvtDiningDao.privateDiningView(query, callback);
}

const privateDiningStatusUpdate = (reqBody, tData, callback) => {
  const obj = CustsPrvtDiningDaoImpl.privateDiningStatusUpdate(reqBody, tData);
  CustsPrvtDiningDao.privateDiningView(obj.query, (resObj1) => {
    if (resObj1.status == '200') {
      const oldData = Object.assign({}, resObj1.resData.result.toObject());
      CustsPrvtDiningDao.privateDiningUpdate(obj.query, obj.updateObj, (resObj) => {
          callback(resObj);
        if (resObj.status == '200') {
          const data = Object.assign({}, resObj.resData.result.toObject())
          const lcsData = CustsPrvtDiningDaoImpl.privateDiningLcsCreate(data, tData);
          const lcsObj = new CustsPrivateDiningLcs(lcsData);
          CustsPrvtDiningDao.commonCreateFunc(lcsObj, () => { });
          data['bStatus'] = reqBody.status;
          DashbrdAnltcsSrvc.upsertAnltcsFrmPrvtDng(data, tData, 'status', oldData);
        }
      });
    } else {
      callback(resObj1);
    }
  });
}

const postCustPrivateDiningCountByTime = (reqBody, tData, callback) => {
  async.parallel([
    (cb) => {
      const query = CustsPrvtDiningDaoImpl.postCustPrivateDiningCountByTime(reqBody, tData, 'Confirmed');
      CustsPrvtDiningDao.privateDiningCommonAggregateFunc(query, resObj => {
        cb(null, resObj.resData.result);
      });
    },
    (cb) => {
      const query1 = CustsPrvtDiningDaoImpl.postCustPrivateDiningCountByTime(reqBody, tData, 'Cancelled');
      CustsPrvtDiningDao.privateDiningCommonAggregateFunc(query1, resObj1 => {
        cb(null, resObj1.resData.result);
      });
    },(cb) => {
      const query2 = CustsPrvtDiningDaoImpl.postCustPrivateDiningCountByTime(reqBody, tData, 'Closed');
      CustsPrvtDiningDao.privateDiningCommonAggregateFunc(query2, resObj1 => {
        cb(null, resObj1.resData.result);
      });
    },
  ], (err, result) => {
    if (err) {
      logger.error('There was an Error in daos/CustsPrvtDinningDao.js at postCustPrivateDiningCountByTime:' + err);
    }
    const cnfrmCount = result[0].length > 0 ? result[0] : [{ _id: 'Lunch', count: 0 }, { _id: 'Dinner', count: 0 } ];
    const cnclCount = result[1].length > 0 ? result[1] : [{ _id: 'Lunch', count: 0 }, { _id: 'Dinner', count: 0 }];
    const closedCount = result[2].length > 0 ? result[2] : [{ _id: 'Lunch', count: 0 }, { _id: 'Dinner', count: 0 }];
    const resultObj = {cnfrmCount, cnclCount, closedCount};
    const sr = SetRes.successRes(resultObj);
    callback(sr);
  });
}

const postCustPrivateDiningCountByDate = (callback) => {
  async.parallel([
    (cb) => {
      const qry = CustsPrvtDiningDaoImpl.custPrivateDiningByTodayQry(reqBody, tData);
      CustsPrvtDiningDao.privateDiningCommonAggregateFunc(qry, resObj => {
        cb(null, resObj.resData.result);
      });
    },
    (cb) => {
      const qry = CustsPrvtDiningDaoImpl.custPrivateDiningByWeekQry(reqBody, tData);
      CustsPrvtDiningDao.privateDiningCommonAggregateFunc(qry, resObj1 => {
        cb(null, resObj1.resData.result);
      });
    },
    (cb) => {
      const qry = CustsPrvtDiningDaoImpl.custPrivateDiningByMonthQry(reqBody, tData);
      CustsPrvtDiningDao.privateDiningCommonAggregateFunc(qry, resObj2 => {
        cb(null, resObj2.resData.result);
      });
    },
  ], (err, result) => {
    if (err) {
      logger.error('There was an Error in daos/CustsPrvtDiningSrvc.js at postCustPrivateDiningCountByDate:' + err);
    }
    const TodayBookings = result[0].length > 0 ? result[0][0] : {_id: 'Today Bookings', count: 0};
    const WeekBookings = result[1].length > 0 ? result[1][0] : {_id: 'Week Bookings', count: 0};
    const MonthBookings = result[2].length > 0 ? result[2][0] : {_id: 'Month Bookings', count: 0};

    const resultObj = [TodayBookings, WeekBookings, MonthBookings]
    callback({ httpStatus: 200, status: '200', resData: resultObj });
  })
}

const postCustsPrivateDiningUpdate = (reqBody, tData, callback) => {
  const query = CustsPrvtDiningDaoImpl.privateDiningView(reqBody, tData);
  const updateObj = CustsPrvtDiningDaoImpl.updatePrivateDining(reqBody, tData);
  CustsPrvtDiningDao.privateDiningView(query, (resObj1) => {
    if (resObj1.status == '200') {
       const oldData = Object.assign({}, resObj1.resData.result.toObject());
      CustsPrvtDiningDao.privateDiningUpdate(query, updateObj, (resObj) => {
        callback(resObj);
        if (resObj.status == '200') {
          const data = Object.assign({}, resObj.resData.result.toObject());
          const lcsData = CustsPrvtDiningDaoImpl.privateDiningLcsCreate(data, tData);
          const lcsObj = new CustsPrivateDiningLcs(lcsData);
          CustsPrvtDiningDao.commonCreateFunc(lcsObj, () => { });
          DashbrdAnltcsSrvc.upsertAnltcsFrmPrvtDng(data, tData, 'update', oldData);
        };
      });
    } else {
      callback(resObj1);

    }
  });
}

const getPrivateDiningLcsList = (id, callback) => {
  const query = CustsPrvtDiningDaoImpl.privateDiningLcsList(id);
  CustsPrvtDiningDao.getPrivateDiningLcsList(query, callback);
}

const getPrivateDiningTotalList = (reqBody, tData, callback) => {
  const obj = CustsPrvtDiningDaoImpl.getPrivateDiningTotalList(reqBody, tData);
  CustsPrvtDiningDao.getPrivateDiningTotalList(obj.query, obj.project, callback)
}

//----------------------END Private Dining Apis----------------------//

module.exports = {
  createPrivateDining, getPrivateDiningList, privateDiningView, privateDiningStatusUpdate,
  postCustPrivateDiningCountByTime, postCustPrivateDiningCountByDate, postCustsPrivateDiningUpdate,
  getPrivateDiningLcsList, getPrivateDiningTotalList
};

const sendBranchMails = (reqBody, emID) => {
  const date1 = new Date(reqBody.bDt);
  const month = date1.toLocaleString('en-US', { month: 'long' });
  const day = date1.getDate();
  const monthDate = `${month} ${day}`;
  let date = monthDate, time = reqBody.bTm, name = reqBody.name, mobileNum = reqBody.mobNum;
  const eCode = reqBody?.eCode || reqBody?.oCode || 'VRU';
  const eName = reqBody?.eName || reqBody?.oName || 'V Reserve U';
  let mailSub = `${eCode}-PrivateDining-${date},${time}`;
  let htmlContent = 
  `<p>Hello,</p><p>You have a private dining request. Private dining requested for <b>${date}, ${time}</b> by</p><p>Customer: <b>${name}</b></p><p>Phone #: <b>+91 ${mobileNum}</b></p>
  <p><b>Note:</b> This is a system-generated email. Please do not reply to this message.</p>
  <p>Regards,<br/><b>${eName} Team</b></p>`;
  Mail.sendEMail(emID, mailSub, htmlContent, (err, resObj) => { });
}