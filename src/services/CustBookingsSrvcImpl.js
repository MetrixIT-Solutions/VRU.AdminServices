/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */
const async = require('async');
const config = require('config');
const moment = require('moment');

const Apicall = require('../Apicall');
const CustsBookingsDaoImpl = require('../daosimplements/CustsBookingsDaoImpl');
const CustsBookingsDao = require('../daos/CustsBookingsDao');
const CustsTableBookingsAbsents = require('../schemas/CustsTableBookingsAbsents');
const CustsTableBookingsCanceled = require('../schemas/CustsTableBookingsCanceled');
const CustsTableBookingsClsd = require('../schemas/CustsTableBookingsClsd');
const CustsTableBookingsConfirmed = require('../schemas/CustsTableBookingsConfirmed');
const SetRes = require('../SetRes');
const DashbrdAnltcsSrvc = require('./DashbrdAnltcsSrvc');
const smsJson = require('../../config/sms.json');

const setTableDataByStatus = (reqBody, query, tData) => {
  switch(reqBody.oldStatus) {
    case 'Confirmed':
      if (reqBody.status == 'Seated' || reqBody.status == 'Waiting') {
        const updateObj = CustsBookingsDaoImpl.bkngStatusUpdate(reqBody, tData);
        CustsBookingsDao.updateTableBookingsCnfrmd(query, updateObj, (resObj) => {
          if(resObj.status == '200') {
            const dCnfmdData = resObj.resData.result;
            swichConditionsByStatus(reqBody.sms, reqBody.status, reqBody.oldStatus, dCnfmdData, tData);
          }
       })
      } else {
        CustsBookingsDao.removeCnfrmTbBkng(query, (dCnfmd) => {
          if(dCnfmd.status == '200') {
            const dCnfmdData = dCnfmd.resData.result;
             swichConditionsByStatus(reqBody.sms, reqBody.status, reqBody.oldStatus, dCnfmdData, tData);
            setBngsCountUserInfo(reqBody.oldStatus, reqBody.status, dCnfmdData, tData);
          }
        });
      }
      break;
    case 'Seated':
      if (reqBody.status == 'Confirmed' || reqBody.status == 'Waiting') {
        const updateObj = CustsBookingsDaoImpl.bkngStatusUpdate(reqBody, tData);
        CustsBookingsDao.updateTableBookingsCnfrmd(query, updateObj, (resObj) => {
          if(resObj.status == '200') {
            const dCnfmdData = resObj.resData.result;
            swichConditionsByStatus(reqBody.sms, reqBody.status, reqBody.oldStatus, dCnfmdData, tData);
          }
        });
      } else {
        CustsBookingsDao.removeCnfrmTbBkng(query, (dCnfmd) => {
          if(dCnfmd.status == '200') {
            const dCnfmdData = dCnfmd.resData.result;
            swichConditionsByStatus(reqBody.sms, reqBody.status, reqBody.oldStatus, dCnfmdData, tData);
            setBngsCountUserInfo(reqBody.oldStatus, reqBody.status, dCnfmdData, tData);
          }
        });
      }
      break;
    case 'Waiting':
      if (reqBody.status == 'Seated' || reqBody.status == 'Confirmed') {
        const updateObj = CustsBookingsDaoImpl.bkngStatusUpdate(reqBody, tData);
        CustsBookingsDao.updateTableBookingsCnfrmd(query, updateObj, (resObj) => {
          if(resObj.status == '200') {
            const dCnfmdData = resObj.resData.result;
            swichConditionsByStatus(reqBody.sms, reqBody.status, reqBody.oldStatus, dCnfmdData, tData);
          }
        });
      } else {
        CustsBookingsDao.removeCnfrmTbBkng(query, (dCnfmd) => {
          if(dCnfmd.status == '200') {
            const dCnfmdData = dCnfmd.resData.result;
            swichConditionsByStatus(reqBody.sms, reqBody.status, reqBody.oldStatus, dCnfmdData, tData);
            setBngsCountUserInfo(reqBody.oldStatus, reqBody.status, dCnfmdData, tData);
          }
        });
      }
      break;
    case 'Completed':
      CustsBookingsDao.removeClsdTbBkng(query, (dCmpd) => {
        if(dCmpd.status == '200') {
          const dCmpdData = dCmpd.resData.result;
          swichConditionsByStatus(reqBody.sms, reqBody.status, reqBody.oldStatus, dCmpdData, tData);
          setBngsCountUserInfo(reqBody.oldStatus, reqBody.status, dCmpdData, tData);
        }
      });
      break;
    case 'Cancelled':
      CustsBookingsDao.removeCancelTbBkng(query, (dCancel) => {
        if(dCancel.status == '200') {
          const dCancelData = dCancel.resData.result;
          swichConditionsByStatus(reqBody.sms, reqBody.status, reqBody.oldStatus, dCancelData, tData);
          setBngsCountUserInfo(reqBody.oldStatus, reqBody.status, dCancelData, tData)
        }
      });
      break;
    case 'No Show':
      CustsBookingsDao.removeNoshowTbBkng(query, (dNs) => {
        if(dNs.status == '200') {
          const dNsData = dNs.resData.result;
          swichConditionsByStatus(reqBody.sms, reqBody.status, reqBody.oldStatus, dNsData, tData);
          setBngsCountUserInfo(reqBody.oldStatus, reqBody.status, dNsData, tData);
        }
      });
      break;
  }
}

const getConfirmedListData = (obj, reqBody, branch, tData, callback) => {
  async.parallel([
    (cb) => {
      CustsBookingsDao.getUsrCnfrmTable(obj.qry, obj.sortQuery, reqBody, (resObj) => {
        cb(null, resObj.resData.result);
      });
    },
    (cb) => {
    const data = {bookingDay: reqBody.bookingDay, startDate: reqBody.startDate, statusValue: reqBody.status, branch, rFor: reqBody.rFor, orgId: reqBody.orgId, entId: reqBody.entityId }
    const obj = CustsBookingsDaoImpl.getTotalCount(data, tData);
      CustsBookingsDao.custBookingConfirmedAggregate(obj, (resObj1) => {
        cb(null, resObj1.resData.result);
      });
    },
    (cb) => {
      const obj = CustsBookingsDaoImpl.getDineTypeCount(reqBody.bookingDay, reqBody.startDate, branch, reqBody.orgId, reqBody.entityId, tData);
      CustsBookingsDao.custBookingConfirmedAggregate(obj, (resObj2) => {
        cb(null, resObj2.resData.result);
      });
    },
  ], (err, result) => {
    if (err) {
      logger.error('There was an Error in srvc/CustsBookingsSrvcImpl.js at getConfirmedListData:' + err);
    }
    let resData = {bookingsListCount: result[0].bookingsListCount, bookingsList: result[0].bookingsList, totalCount: result[1].length > 0 ? {_id: reqBody.bookingDay, data: result[1]} : { _id: reqBody.bookingDay, data: [] }, diningTypeCount: result[2].length > 0 ? result[2]: []};
    const data = SetRes.successRes(resData);
    callback(data);
  });
}

const getBookingCompletedData = (obj, reqBody, branch, tData, callback) => {
  async.parallel([
    (cb) => {
      CustsBookingsDao.getUsrCmpltdTable(obj.qry, reqBody, (resObj) => {
        cb(null, resObj.resData.result);
      });
    },
    (cb) => {
      const data = {bookingDay: reqBody.bookingDay, startDate: reqBody.startDate, statusValue: reqBody.status, branch, rFor: reqBody.rFor, orgId: reqBody.orgId, entId: reqBody.entId}
      const obj = CustsBookingsDaoImpl.getTotalCount(data, tData);
      CustsBookingsDao.custBookingCompletedAggregate(obj, (resObj1) => {
        cb(null, resObj1.resData.result);
      });
    },
    (cb) => {
      const obj = CustsBookingsDaoImpl.getDineTypeCount(reqBody.bookingDay, reqBody.startDate, branch, reqBody.orgId, reqBody.entId, tData);
      CustsBookingsDao.custBookingCompletedAggregate(obj, (resObj2) => {
        cb(null, resObj2.resData.result);
      });
    },
  ], (err, result) => {
    if (err) {
      logger.error('There was an Error in srvc/CustsBookingsSrvcImpl.js at getBookingCompletedData:' + err);
    }
    let resData = {bookingsListCount: result[0].bookingsListCount, bookingsList: result[0].bookingsList, totalCount: result[1].length > 0 ? result[1][0]: { _id: reqBody.bookingDay, veg: 0, nonVeg: 0, kids: 0 }, diningTypeCount: result[2].length > 0 ? result[2]: []};
    const data = SetRes.successRes(resData);
    callback(data);
  });
}

const getBookingCancelledData = (obj, reqBody, branch, tData, callback) => {
  async.parallel([
    (cb) => {
      CustsBookingsDao.getUsrCncledTable(obj.qry, reqBody, (resObj) => {
        cb(null, resObj.resData.result);
      });
    },
    (cb) => {
      const data = {bookingDay: reqBody.bookingDay, startDate: reqBody.startDate, statusValue: reqBody.status, branch, rFor: reqBody.rFor, orgId: reqBody.orgId, entId: reqBody.entityId}
      const obj = CustsBookingsDaoImpl.getTotalCount(data, tData);
        CustsBookingsDao.custBookingCancelledAggregate(obj, (resObj1) => {
        cb(null, resObj1.resData.result);
      });
    },
    (cb) => {
      const obj = CustsBookingsDaoImpl.getDineTypeCount(reqBody.bookingDay, reqBody.startDate, branch, reqBody.orgId, reqBody.entityId, tData);
      CustsBookingsDao.custBookingCancelledAggregate(obj, (resObj2) => {
        cb(null, resObj2.resData.result);
      });
    },
  ], (err, result) => {
    if (err) {
      logger.error('There was an Error in srvc/CustsBookingsSrvcImpl.js at getBookingCancelledData:' + err);
    }
    let resData = {bookingsListCount: result[0].bookingsListCount, bookingsList: result[0].bookingsList, totalCount: result[1].length > 0 ? result[1][0]: { _id: reqBody.bookingDay, veg: 0, nonVeg: 0, kids: 0 }, diningTypeCount: result[2].length > 0 ? result[2]: []};
    const data = SetRes.successRes(resData);
    callback(data);
  });
}

const getBookingNoshowData = (obj, reqBody, branch, tData, callback) => {
  async.parallel([
    (cb) => {
      CustsBookingsDao.getUsrNoShowTable(obj.qry, reqBody, (resObj) => {
        cb(null, resObj.resData.result);
      });
    },
    (cb) => {
      const data = {bookingDay: reqBody.bookingDay, startDate: reqBody.startDate, statusValue: reqBody.status, branch, rFor: reqBody.rFor, orgId: reqBody.orgId, entId: reqBody.entityId}
      const obj = CustsBookingsDaoImpl.getTotalCount(data, tData);
      CustsBookingsDao.custBookingNoshowAggregate(obj, (resObj1) => {
        cb(null, resObj1.resData.result);
      });
    },
    (cb) => {
      const obj = CustsBookingsDaoImpl.getDineTypeCount(reqBody.bookingDay, reqBody.startDate, branch, reqBody.orgId, reqBody.entityId, tData);
      CustsBookingsDao.custBookingNoshowAggregate(obj, (resObj2) => {
        cb(null, resObj2.resData.result);
      });
    },
  ], (err, result) => {
    if (err) {
      logger.error('There was an Error in srvc/CustsBookingsSrvcImpl.js at getBookingNoshowData:' + err);
    }
    let resData = {bookingsListCount: result[0].bookingsListCount, bookingsList: result[0].bookingsList, totalCount: result[1].length > 0 ? result[1][0]: { _id: reqBody.bookingDay, veg: 0, nonVeg: 0, kids: 0 }, diningTypeCount: result[2].length > 0 ? result[2]: []};
    const data = SetRes.successRes(resData);
    callback(data);
  })
}

module.exports = {
  setTableDataByStatus, getConfirmedListData, getBookingCompletedData, 
  getBookingCancelledData, getBookingNoshowData
};

const swichConditionsByStatus = (sms, status, oldStatus, reqBody, tData) => {
  const data = Object.assign({}, reqBody.toObject());
  const newData = { ...data, bStatus: status}; const oData = { ...data, bStatus: oldStatus};
  DashbrdAnltcsSrvc.upsertAnltcsFrmBkg(newData, tData, 'status', oData);
  switch(status) {
    case 'Confirmed':
      const cfmdData = CustsBookingsDaoImpl.setTableData(reqBody, tData, status);
      const cfmdObj = new CustsTableBookingsConfirmed(cfmdData);
      CustsBookingsDao.createData(cfmdObj, resObj => {});
      sendConfirmationSms(data)
      break;
      case 'Seated':
      const stdData = CustsBookingsDaoImpl.setTableData(reqBody, tData, status);
      const stdObj = new CustsTableBookingsConfirmed(stdData);
      CustsBookingsDao.createData(stdObj, resObj => {});
      break;
      case 'Waiting' :
      const wtngData = CustsBookingsDaoImpl.setTableData(reqBody, tData, status);
      const wtngObj = new CustsTableBookingsConfirmed(wtngData);
      CustsBookingsDao.createData(wtngObj, resObj => {});
      break;
    case 'Completed':
      const cmpdData = CustsBookingsDaoImpl.setTableData(reqBody, tData, status);
      const cmpdObj = new CustsTableBookingsClsd(cmpdData);
      CustsBookingsDao.createData(cmpdObj, resObj => {});
       oldStatus == 'Seated' && sendFeedbackSms(cmpdData);
      break;
    case 'Cancelled':
      const cancelData = CustsBookingsDaoImpl.setTableData(reqBody, tData, status);
      const cancelObj = new CustsTableBookingsCanceled(cancelData);
      CustsBookingsDao.createData(cancelObj, resObj => {});
      sms && sendCancelledSms(reqBody);
      break;
    case 'No Show':
      const nsData = CustsBookingsDaoImpl.setTableData(reqBody, tData, status);
      const nsObj = new CustsTableBookingsAbsents(nsData);
      CustsBookingsDao.createData(nsObj, resObj => {});
      sms && sendCancelledSms(reqBody);
      break;
  }
}

const setBngsCountUserInfo = (oldStatus, status, reqBody, tData) => {
  const qry = CustsBookingsDaoImpl.usrInfoQry(reqBody);
  const updObj = CustsBookingsDaoImpl.setUserInfoObj(oldStatus, status);
  CustsBookingsDao.updateUserInfoBkngsCount(qry, updObj, resObj => {});
}

const sendConfirmationSms = (reqBody) => {
  const date = moment(reqBody.bDt).format('Do MMM YYYY');
  const count = reqBody.vegCount + reqBody.nonVegCount + reqBody.kidsCount;
  const data = {
      template_id: smsJson[reqBody.bCode]?.confirmBkgTempId, short_url: config.smsShortUrl, 
      recipients: [{ mobiles: reqBody.mobCcNum, name: reqBody.name, members: count, date, time: reqBody.bTm, mins: '15'}]
    };
  Apicall.commonSms(data, (resObj) => { });
}

const sendFeedbackSms = (data) => {
  const setData = {
    template_id: smsJson[data.bCode]?.feedBcktempId, short_url: config.smsShortUrl,
    recipients: [{ mobiles: data.mobCcNum, fburl: smsJson[data.bCode]?.fburl }],
  }
  Apicall.commonSms(setData, (resObj) => { });
}

const sendCancelledSms = (data) => {
const date = moment(data.bDt).format('Do MMM YYYY');
  const count = data.vegCount + data.nonVegCount + data.kidsCount;
  const data1 = {
    template_id: smsJson[data.bCode]?.cancelledBkgTempId, short_url: config.smsShortUrl, 
    recipients: [{ mobiles: data.mobCcNum, name: data.name, members: count, date, time: data.bTm}]
  };
  Apicall.commonSms(data1, (resObj) => { });
}