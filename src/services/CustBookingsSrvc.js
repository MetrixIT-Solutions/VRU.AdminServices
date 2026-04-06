/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const async = require('async');
const moment = require('moment');

const CustsBookingsDaoImpl = require('../daosimplements/CustsBookingsDaoImpl');
const CustsBookingsDao = require('../daos/CustsBookingsDao');
const BranchDao = require('../daos/BranchDao');
const CustBookingsSrvcImpl = require('../services/CustBookingsSrvcImpl');
const CustsTableBookingsLcs = require('../schemas/CustsTableBookingsLcs');
const CustsTableBookings = require('../schemas/CustsTableBookings');
const CustsTableBookingsConfirmed = require('../schemas/CustsTableBookingsConfirmed')
const CustsTableBookingsAbsents = require('../schemas/CustsTableBookingsAbsents');
const CustTableBookingsCancelled = require('../schemas/CustsTableBookingsCanceled');
const CustsTableBookingsClsd = require('../schemas/CustsTableBookingsClsd');
const CustsUsers = require('../schemas/CustsUsers');
const CustsUsersInfos = require('../schemas/CustsUsersInfos');
const SetRes = require('../SetRes');
const config = require('config');
const Mail = require('../../config/mail');
const Apicall = require('../Apicall');
const CustUsersDao = require('../daos/CustUsersDao');
const DashbrdAnltcsSrvc = require('./DashbrdAnltcsSrvc');
const smsJson = require('../../config/sms.json');
const BranchDaoImpl = require('../daosimplements/BranchDaoImpl');
const CustUsersDaoImpl = require('../daosimplements/CustUsersDaoImpl');

const postAdminUserTableStatus = (reqBody, tData, callback) => {
  const branch = tData.ut == 'Board' || tData.ut == 'VRU' ? reqBody.branch ? {branch: reqBody.branch} : {} : tData.bid ? {branch: tData.bid} : {}; ;
  const data = {searchStr: reqBody.searchStr, type: reqBody.status, bookingDay: reqBody.bookingDay, startDate: reqBody.startDate, branch, rFor: reqBody.rFor, orgId: reqBody.orgId ? reqBody.orgId : '', entId: reqBody.entityId ? reqBody.entityId: ''}
  const obj = CustsBookingsDaoImpl.userTableQry(reqBody, data, tData);
  if (reqBody.status == 'Confirmed') {
    CustBookingsSrvcImpl.getConfirmedListData(obj, reqBody, branch, tData, callback);
  } else if (reqBody.status == 'Waiting') {
    CustBookingsSrvcImpl.getConfirmedListData(obj, reqBody, branch, tData, callback);
  } else if (reqBody.status == 'Completed') {
    CustBookingsSrvcImpl.getBookingCompletedData(obj, reqBody, branch, tData, callback);
  } else if (reqBody.status == 'Cancelled') {
    CustBookingsSrvcImpl.getBookingCancelledData(obj, reqBody, branch, tData, callback);
  } else if (reqBody.status == 'No Show') {
    CustBookingsSrvcImpl.getBookingNoshowData(obj, reqBody, branch, tData, callback);
  } else if (reqBody.status == 'Upcoming') {
    CustBookingsSrvcImpl.getConfirmedListData(obj, reqBody, branch, tData, callback);
  } else callback(SetRes.noData({}));
}

const postCustTableStatusUpdate = (reqBody, tData, callback) => {
  const qry = CustsBookingsDaoImpl.custBkngTble(reqBody, tData);
  const updateObj = CustsBookingsDaoImpl.bkngStatusUpdate(reqBody, tData);
  CustsBookingsDao.updateTableBookings(qry, updateObj, resObj => {
    if (resObj.status == '200') {
      const data = Object.assign({}, resObj.resData.result.toObject())
      const lcsObj = CustsBookingsDaoImpl.createCustTableBookingLcs(data, tData);
      const createLcsObj = new CustsTableBookingsLcs(lcsObj);
      CustsBookingsDao.createData(createLcsObj, () => {});
      CustBookingsSrvcImpl.setTableDataByStatus(reqBody, qry, tData);
      reqBody.status == 'Completed' && sendSmsCompletedFeedBack(resObj.resData.result);
      // reqBody.mailStatus == 'MailStatus' && sendMailList(reqBody);
      callback(resObj);
    } else {
      callback(resObj);
    }
  });
}

const postCustTableDshbrdCount = (reqBody, tData, callback) => {
  async.parallel([
    (cb) => {
      const qry = CustsBookingsDaoImpl.custTbDshbrdLnchQry(reqBody, tData, true);
      CustsBookingsDao.custAggregateCnfrmdTBCount(qry, resObj => {
        cb(null, resObj.resData.result);
      });
    },
    (cb) => {
      const qry3 = CustsBookingsDaoImpl.custTbDshbrdLnchQry(reqBody, tData, false);
      CustsBookingsDao.custBookingCompletedAggregate(qry3, resObj1 => {
        cb(null, resObj1.resData.result);
      });
    },
    (cb) => {
      const qry3 = CustsBookingsDaoImpl.custTbDshbrdLnchQry(reqBody, tData, false);
      CustsBookingsDao.custBookingNoshowAggregate(qry3, resObj2 => {
        cb(null, resObj2.resData.result);
      });
    },
    (cb) => {
      const qry3 = CustsBookingsDaoImpl.custTbDshbrdLnchQry(reqBody, tData, false);
      CustsBookingsDao.custBookingCancelledAggregate(qry3, resObj3 => {
        cb(null, resObj3.resData.result);
      });
    },
  ], (err, result) => {
    if (err) {
      logger.error('There was an Error in daos/CustsBookingsDao.js at postCustTableDshbrdCount:' + err);
    }
    const wtngCount = result[0].length > 0 ? result[0].filter(item => item._id?.bStatus == 'Waiting') : [];
    const cnfrmCountsD = result[0].length > 0 ? result[0].filter(item => item._id?.bStatus == 'Confirmed') : [];
    const completedCount = result[1].length > 0 ? result[1] : [];
    const waitingCnt = wtngCount?.length ? wtngCount.map(item => {return ({...item, _id: item._id?.rFor})}) : [];
    const confrmCounts = cnfrmCountsD?.length ? cnfrmCountsD.map(item => {return ({...item, _id: item._id?.rFor})}) : [];
    // const count = lnchCntData.reduce((a, b) => {return a + b.count}, 0);
    // const veg = lnchCntData.reduce((a, b) => {return a + b.veg}, 0)
    // const nonVeg = lnchCntData.reduce((a, b) => {return a + b.nonVeg}, 0)
    // const kids = lnchCntData.reduce((a, b) => {return a + b.kids}, 0)
    // const lnchCounts = [{_id: 'Lunch', count, veg, nonVeg, kids}];
    // const dnrCntData = cnfrmCount.filter(item => item._id == 'Dinner');
    // const dnrCount = dnrCntData.reduce((a, b) => {return a + b.count}, 0);
    // const dnrVeg = dnrCntData.reduce((a, b) => {return a + b.veg}, 0);
    // const dnrNonVeg = dnrCntData.reduce((a, b) => {return a + b.nonVeg}, 0);
    // const dnrKids = dnrCntData.reduce((a, b) => {return a + b.kids}, 0);
    // const dnrCounts = [{_id: 'Dinner', count: dnrCount, veg: dnrVeg, nonVeg: dnrNonVeg, kids: dnrKids}];
    const noshowCount = result[2].length > 0 ? result[2] : [];
    const cnclCount = result[3].length > 0 ? result[3]: [];
    const resultObj = {confrmCounts, waitingCnt, completedCount, noshowCount, cnclCount};
    callback({ httpStatus: 200, status: '200', resData: resultObj });
  });
}

const postCustTableBookingCountByDate = (reqBody, tData, callback) => {
  async.parallel([
    (cb) => {
      const qry = CustsBookingsDaoImpl.custTableBkngByTodayQry(reqBody, tData);
      CustsBookingsDao.custAggregateTotalTBCount(qry, resObj => {
        cb(null, resObj.resData.result);
      });
    },
    (cb) => {
      const qry = CustsBookingsDaoImpl.custTableBkngByWeekQry(reqBody, tData);
      CustsBookingsDao.custAggregateTotalTBCount(qry, resObj1 => {
        cb(null, resObj1.resData.result);
      });
    },
    (cb) => {
      const qry = CustsBookingsDaoImpl.custTableBkngByMonthQry();
      CustsBookingsDao.custAggregateTotalTBCount(qry, resObj2 => {
        cb(null, resObj2.resData.result);
      });
    },
  ], (err, result) => {
    if (err) {
      logger.error('There was an Error in daos/CustsBookingsDao.js at postCustTableDshbrdCount:' + err);
    }
    const TodayBookings = result[0].length > 0 ? result[0][0] : { _id: 'Today Bookings', count: 0 };
    const WeekBookings = result[1].length > 0 ? result[1][0] : { _id: 'Week Bookings', count: 0 };
    const MonthBookings = result[2].length > 0 ? result[2][0] : { _id: 'Month Bookings', count: 0 };

    const resultObj = [TodayBookings, WeekBookings, MonthBookings]
    callback({ httpStatus: 200, status: '200', resData: resultObj });
  });
}

const postCustTableBookingCreate = (reqBody, tData, callback) => {
  if((tData.ut !== 'VRU') || (tData.ut === 'VRU' && reqBody.orgId && reqBody.oCode && reqBody.oName)) {
    if (reqBody.refUID) {
      createData(reqBody, tData, callback);
      const obj = CustsBookingsDaoImpl.oebUpdateQuery(reqBody, tData);
      obj?.updateQuery && CustUsersDao.postCustuserUpdate(obj.query, obj.updateQuery, (resObj) => {});
    } else {
      const obj = CustsBookingsDaoImpl.createUser(reqBody, tData);
      const createObj = new CustsUsers(obj);
      CustsBookingsDao.createData(createObj, (resObj) => {
        if (resObj.status == '200') {
          const resData = resObj.resData.result;
          reqBody['user'] = resData._id;
          reqBody['refUID'] = resData.refUID;
          createData(reqBody, tData, callback);
          const obj = CustsBookingsDaoImpl.postCustUserInfoCreate(resObj.resData.result);
          const createObj = new CustsUsersInfos(obj);
          CustsBookingsDao.createData(createObj, (resObj) => { });
        } else if (resObj.status == '101') {
          const body = { orgId: reqBody?.orgId, mobNum: reqBody.mobileNum };
          const qry = CustUsersDaoImpl.userViewQry(body, tData);
          CustUsersDao.postCustuserView(qry, (resObj1) => {
            if (resObj.status == '200') {
              reqBody['user'] = resData._id;
              reqBody['refUID'] = resData.refUID;
              createData(reqBody, tData, callback);
              const obj = CustsBookingsDaoImpl.oebUpdateQuery(reqBody, tData);
              obj?.updateQuery && CustUsersDao.postCustuserUpdate(obj.query, obj.updateQuery, (resObj) => { });
            } else {
              callback(resObj1)
            }
          })
        } else {
          callback(resObj)
        }
      });
    }
  } else {
    const rf = SetRes.msdReqFields();
    callback(rf);
  }
}

const postCustTableBookingView = (reqBody, tData, callback) => {
  const query = CustsBookingsDaoImpl.postCustTableBookingView(reqBody, tData);
  if (reqBody.status == 'Confirmed' || reqBody.status == 'Seated' || reqBody.status == 'Waiting') {
    CustsBookingsDao.postCustTableBookingConfirmedView(query, callback);
  } else if (reqBody.status == 'Cancelled') {
    CustsBookingsDao.postCustTableBookingCancelledView(query, callback);
  } else if (reqBody.status == 'No Show') {
    CustsBookingsDao.postCustTableBookingAbsentsView(query, callback);
  } else {
    CustsBookingsDao.postCustTableBookingClosedView(query, callback);
  }
}

const postCustTableBookingUpdate = (reqBody, tData, callback) => {
  if(tData.ut !== 'VRU' || (tData.ut === 'VRU' && reqBody.orgId && reqBody.oCode && reqBody.oName)) {
    const query = CustsBookingsDaoImpl.postCustTableBookingView(reqBody, tData);
    const updateObj = CustsBookingsDaoImpl.postCustTableBookingUpdate(reqBody, tData);
    CustsBookingsDao.tableBookingData(query, (resObj1) => {
      if (resObj1.status == '200') {
        const handleUpdate = (resObj) => {
          callback(resObj);
          if (resObj.status == 200) {
            reqBody.status == 'Confirmed' && rescheduleSms(resObj.resData.result, resObj.resData.result.bCode);
            const data = Object.assign({}, resObj.resData.result.toObject())
            const lcsObj = CustsBookingsDaoImpl.createCustTableBookingLcs(data, tData);
            const createLcsObj = new CustsTableBookingsLcs({...lcsObj, bStatus: reqBody.status});
            CustsBookingsDao.createData(createLcsObj, () => {});
            CustsBookingsDao.updateTableBookings(query, updateObj, (resObj) => {
              const oldData = Object.assign({}, resObj1.resData.result.toObject());
              oldData['bStatus'] = reqBody.status; reqBody['bStatus'] = reqBody.status;
              DashbrdAnltcsSrvc.upsertAnltcsFrmBkg(reqBody, tData, 'update', oldData);
            });
          }
        };
        if (reqBody.status == 'Confirmed' || reqBody.status == 'Seated' || reqBody.status == 'Waiting') {
          CustsBookingsDao.updateTableBookingsCnfrmd(query, updateObj, handleUpdate);
        } else if (reqBody.status == 'Cancelled') {
          CustsBookingsDao.updateTableBookingsCncld(query, updateObj, handleUpdate);
        } else if (reqBody.status == 'No Show') {
          CustsBookingsDao.updateTableBookingsAbsents(query, updateObj, handleUpdate);
        } else {
          CustsBookingsDao.updateTableBookingsClsd(query, updateObj, handleUpdate);
        }
      } else {
        const nd = SetRes.noData();
        callback(nd);
      }
    })
  } else {
    const rf = SetRes.msdReqFields();
    callback(rf);
  }
}

const postCustTableBookingsCountByCalendar = (reqBody, tData, callback) => {
  const query = CustsBookingsDaoImpl.postCustTableBookingsCountByCalendar(reqBody, tData);
  if (reqBody.status == 'Confirmed' || reqBody.status == 'Seated' || reqBody.status == 'Waiting' || reqBody.status == 'Upcoming') {
    CustsBookingsDao.custBookingConfirmedAggregate(query, callback);
  } else if (reqBody.status == 'Completed') {
    CustsBookingsDao.custBookingCompletedAggregate(query, callback);
  } else if (reqBody.status == 'Cancelled') {
    CustsBookingsDao.custBookingCancelledAggregate(query, callback);
  } else if (reqBody.status == 'No Show') {
    CustsBookingsDao.custBookingNoshowAggregate(query, callback);
  } else callback(SetRes.noData({}));
}
const postCustClosedTableBookingUpdate = () => {
  const obj = CustsBookingsDaoImpl.closedBkTables();
  getClosedBkngTables(obj);
}

const postCustClosedTableBookingUpdate1 = () => {
  const obj1 = CustsBookingsDaoImpl.closedBkTables();
  getClosedBkngTables(obj1);
}

const bookingConfirmedStatusUpdate = () => {
  const obj = CustsBookingsDaoImpl.confimedBooking();
  CustsBookingsDao.confirmedtablesList(obj, resObj => {
    if (resObj.status == '200') {
      const data = resObj.resData.result;
      const id = data.map(item => item._id);
      const updateObj = CustsBookingsDaoImpl.removeBookingIdTable(id);
      CustsBookingsDao.removeBookingConfirmId(updateObj, resObj => {});
      const UpdateBkTable = CustsBookingsDaoImpl.updateBktableStatus(id, data, 'Absent');
      CustsBookingsDao.upDateBookingtable(UpdateBkTable.query, UpdateBkTable.updateObj, resObj => {});
      setData(0, data);
    }
  });
}

const postCustExcelDataTableBookingCreate = (reqBody, tData, callback) => {
  const query = CustsBookingsDaoImpl.getUserData(reqBody);
  CustsBookingsDao.tableBookingData(query, (resObj) => {
    if (resObj.status == '200') {
      bkCreateData({}, reqBody, tData, callback);
      const data = resObj.resData.result;
      if (data.bStatus == 'Confirmed') {
        sendConfirmationSms(reqBody);
        sendMailData(reqBody)
      } else if (data.bStatus == 'Completed') {
        sendSmsCompletedFeedBack(data);
      }
    } else {
      const obj = CustsBookingsDaoImpl.createExcelBooking(reqBody, tData);
      const setData = new CustsTableBookings(obj);
      CustsBookingsDao.createData(setData, (resObj) => {
        if (resObj.status == '200') {
          const data1 = resObj.resData.result;
          if (data1.bStatus == 'Confirmed') {
            sendConfirmationSms(reqBody);
            sendMailData(reqBody)                                                                      
          } else if (data1.bStatus == 'Completed') {
            sendSmsCompletedFeedBack(data1);
          }
          bkCreateData(obj, reqBody, tData, callback);
        }
      });
    }
  });
}

const getCustTableBookingLfcsList = (bId, callback) => {
  const query = CustsBookingsDaoImpl.getLfcsData(bId);
  CustsBookingsDao.getCustTableBookingLfcsList(query,  callback)
}

const getCustTableBookingsTotalList = (reqBody, tData, callback) => {
  const obj = CustsBookingsDaoImpl.getBkngsTotalList(reqBody, tData);
  CustsBookingsDao.custTableBookingsTotalList(obj.query, obj.project, callback)
}

module.exports = {
  postAdminUserTableStatus, postCustTableStatusUpdate, postCustTableDshbrdCount,
  postCustTableBookingCountByDate, postCustTableBookingCreate, postCustTableBookingView,
  postCustTableBookingUpdate, postCustTableBookingsCountByCalendar, postCustClosedTableBookingUpdate,
  postCustClosedTableBookingUpdate1, bookingConfirmedStatusUpdate, postCustExcelDataTableBookingCreate,
  getCustTableBookingLfcsList, getCustTableBookingsTotalList
};

const getClosedBkngTables = (obj) => {
  CustsBookingsDao.custClosedBktables(obj, (resObj) => {
    if (resObj.status == '200') {
      const data = resObj.resData.result;
      const id = data.map(item => item._id);
      const updateObj = CustsBookingsDaoImpl.removeBookingIdTable(id);
      CustsBookingsDao.removeBookingConfirmId(updateObj, resObj => {});
      const UpdateBkTable = CustsBookingsDaoImpl.updateBktableStatus(id, data, 'Completed');
      CustsBookingsDao.upDateBookingtable(UpdateBkTable.query, UpdateBkTable.updateObj, resObj => {});
      sendSmsFeedBack(0, data, (resObj) => {});
    }
  });
} 

const setData =(i, resData) => {
  if(i < resData.length){
    const data =  resData[i];
    const cmpdData = CustsBookingsDaoImpl.setTableData(data, {}, '');
    const cmpdObj = new CustsTableBookingsAbsents(cmpdData);
    CustsBookingsDao.createData(cmpdObj, resObj => { });
    setData(i+1, resData); 
  }
}

const sendSmsFeedBack = (i, resData, callback) => {
  if (i < resData.length) {
    const data = resData[i];
    const setData = {
      template_id: smsJson[data.bCode]?.feedBcktempId, short_url: config.smsShortUrl,
      recipients: [{ mobiles: data.mobCcNum, fburl: smsJson[data.bCode]?.fburl }],
    }
    Apicall.commonSms(setData, (resObj) => {
      sendSmsFeedBack(i + 1, resData, callback);
    });
    const cmpdData = CustsBookingsDaoImpl.setTableData(data, {}, 'Completed');
    const cmpdObj = new CustsTableBookingsClsd(cmpdData);
    CustsBookingsDao.createData(cmpdObj, resObj => { });
  } else {
    callback();
  }
}

const sendSmsCompletedFeedBack = (data) => {
  const setData = {
    template_id: smsJson[data.bCode]?.feedBcktempId, short_url: config.smsShortUrl,
    recipients: [{ mobiles: data.mobCcNum, fburl: smsJson[data.bCode]?.fburl } ],
  }
  Apicall.commonSms(setData, (resObj) => { });
}

const createData = (reqBody, tData, callback) => {
  if(reqBody.bStatus === 'Completed') {
    const obj = CustsBookingsDaoImpl.createBooking(reqBody, tData);
    const createObj = new CustsTableBookings(obj);
    CustsBookingsDao.createData(createObj, (resObj) => {
      if(resObj.status == '200') {
        const data = Object.assign({}, resObj.resData.result.toObject())
        const lcsObj = CustsBookingsDaoImpl.createCustTableBookingLcs(data, tData);
        const createLcsObj = new CustsTableBookingsLcs(lcsObj);
        CustsBookingsDao.createData(createLcsObj, () => {});
        const createObj = new CustsTableBookingsClsd(obj);
        CustsBookingsDao.createData(createObj, (res)=>{
          callback(res);
          if(res.status == '200') DashbrdAnltcsSrvc.upsertAnltcsFrmBkg(resObj.resData.result, tData, 'create');
        });
        const obj2 = CustsBookingsDaoImpl.updateUserInfoBkngsCount(obj, tData);
        CustsBookingsDao.updateUserInfoBkngsCount(obj2.query, obj2.updateObj, (resobj2) => {});
        const setData = {
          template_id: smsJson[data.bCode]?.feedBcktempId, short_url: config.smsShortUrl,
          recipients: [{ mobiles: data.mobCcNum, fburl: smsJson[data.bCode]?.fburl }],
        }
        Apicall.commonSms(setData, (resObj) => { });
      } else callback(resObj);
    });
  } else {
    const obj = CustsBookingsDaoImpl.createBooking(reqBody, tData);
    const createObj = new CustsTableBookings(obj);
    CustsBookingsDao.createData(createObj, (resObj) => {
      if(resObj.status == '200'){
        const data = Object.assign({}, resObj.resData.result.toObject())
        const lcsObj = CustsBookingsDaoImpl.createCustTableBookingLcs(data, tData);
        const createLcsObj = new CustsTableBookingsLcs(lcsObj);
        CustsBookingsDao.createData(createLcsObj, () => {});
        const createObj = new CustsTableBookingsConfirmed(obj);
        CustsBookingsDao.createData(createObj, (res)=>{
          callback(res);
          if(res.status == '200') DashbrdAnltcsSrvc.upsertAnltcsFrmBkg(resObj.resData.result, tData, 'create');
        });
        sendConfirmationSms(reqBody);
        const obj2 = CustsBookingsDaoImpl.updateUserInfoBkngsCount(reqBody);
        CustsBookingsDao.updateUserInfoBkngsCount(obj2.query, obj2.updateObj, (resobj2) => {});
        // sendMailList(reqBody);
        if(resObj.status == '200'){
          const branchId = resObj.resData.result.branch;
          const getQuery = BranchDaoImpl.getBranchDatabyId(branchId);
          BranchDao.getAdminBranchList(getQuery, (resObj3) => {
            if (resObj3.status == '200') {
              sendBranchMails(resObj.resData.result, resObj3.resData.result.emID);
            }
          });
        }
      } else {
        callback(resObj)
      }
    });
  }
}

const sendMailList = (reqBody) => {
  const mailLsit = reqBody.tomails;
  for (i = 0; i < mailLsit.length; i++) {
    const mail = mailLsit[i];
    sendMail(reqBody, mail);
  }
}   

const sendConfirmationSms = (reqBody) => {
  const date = moment(reqBody.bDt).format('Do MMM YYYY');
  const count = reqBody.vegCount + reqBody.nonVegCount + reqBody.kidsCount;
  const data = {
      template_id: smsJson[reqBody.bCode]?.confirmBkgTempId, short_url: config.smsShortUrl, 
      recipients: [{ mobiles: reqBody.userID, name: reqBody.name, members: count, date, time: reqBody.bTm, mins: '15'}]
    };
  Apicall.commonSms(data, (resObj) => { });
}
const sendMail = (reqBody, mails) => {
  const cont1 = reqBody.htmlContent;
  const repl = cont1.replace(/\n/g, '<br>');
  const count = reqBody.vegCount + reqBody.nonVegCount + reqBody.kidsCount;
  const date1 = new Date(reqBody.bDt);
  const month = date1.toLocaleString('en-US', { month: 'long' });
  const day = date1.getDate();
  const monthDate = `${month} ${day}`;
  let date = monthDate, time = reqBody.bTm, name = reqBody.name, mobileNum = reqBody.mobileNum;
  let value = count > 1 ? 'persons' : 'person';
  let mailSub = `${reqBody.mailSubject}-${date},${time}`;     
  const eName = reqBody?.eName || reqBody?.oName || 'V Reserve U';
  let htmlContent = 
  `<p>Hello,</p><p> ${repl} ${count} ${value} on <b>${date} ${time}</b> by</p><p>Customer: <b>${name}</b></p><p>Phone #: <b>+91 ${mobileNum}</b></p>
   <p><b>Note:</b> This is a system-generated email. Please do not reply to this message.</p>`;
  let htmlContent1 = 
  `<p>Hello,</p><p> 'You have a table Booking was ${reqBody.status} Table booked for ' ${count} ${value} on <b>${date} ${time}</b> by</p><p>Customer: <b>${name}</b></p><p>Phone #: <b>+91 ${mobileNum}</b></p>
   <p><b>Note:</b> This is a system-generated email. Please do not reply to this message.</p>
   <p>Regards,<br/><b>${eName} Team</b></p>`;
  let ct1 = (reqBody.status === 'No Show' || reqBody.bStatus === 'No Show') || (reqBody.status === 'Cancelled' || reqBody.bStatus === 'Cancelled') ?  htmlContent1 : htmlContent;
  Mail.sendEMail(mails, mailSub,ct1, (err, resObj) => { 
  });
}

const sendBranchMails = (reqBody, mail) => {
  const count = reqBody.vegCount + reqBody.nonVegCount + reqBody.kidsCount;
  const date1 = new Date(reqBody.bDt);
  const month = date1.toLocaleString('en-US', { month: 'long' });
  const day = date1.getDate();
  const year = date1.getFullYear();
  const monthDate = `${day} ${month}, ${year}`;
  const t1 = reqBody.bTm;
  const time = t1.replace(/(\d{2}:\d{2})\s([APM]{2})/, '$1$2');
  let date = monthDate, name = reqBody.name, mobileNum = reqBody.mobNum;
  let value = count > 1 ? 'persons' : 'person';
  let mailSub = `${reqBody.bCode}-Reservation-${reqBody.bDt}@${time}`;
  const eName = reqBody?.eName || reqBody?.oName || 'V Reserve U';
  let htmlContent = 
  `<p>Hello,</p><p>You have a Table Reservation. Table reserved for ${count} ${value} on <b>${date} ${reqBody.bTm}</b> by</p><p>Customer: <b>${name}</b></p><p>Phone #: <b>+91 ${mobileNum}</b></p>
   <p><b>Note:</b> This is a system-generated email. Please do not reply to this message.</p>
   <p>Regards,<br/><b>${eName} Team</b></p>`;
  Mail.sendEMail(mail, mailSub, htmlContent, (err, resObj) => { });
}

const bkCreateData = (obj, reqBody, tData, callback) => {
  if (reqBody.BookingStatus == 'Confirmed' || reqBody.BookingStatus == 'Seated' || reqBody.BookingStatus == 'Waiting') {
    const setData = new CustsTableBookingsConfirmed(obj);
    CustsBookingsDao.createData(setData, callback);
  } else if (reqBody.BookingStatus == 'Cancelled') {
    const setData = new CustTableBookingsCancelled(obj);
    CustsBookingsDao.createData(setData, callback);
  } else if (reqBody.BookingStatus == 'No Show') {
    const setData = new CustsTableBookingsAbsents(obj);
    CustsBookingsDao.createData(setData, callback);
  } else {
    const setData = new CustsTableBookingsClsd(obj);
    CustsBookingsDao.createData(setData, callback);
  }
}

const sendMailData = (reqBody) => {
  const count = reqBody.vegCount + reqBody.nonVegCount + reqBody.kidsCount;
  const date1 = new Date(reqBody.Date);
  const month = date1.toLocaleString('en-US', { month: 'long' });
  const day = date1.getDate();
  const monthDate = `${month} ${day}`;
  const mobilenumber = '+91' + reqBody.MobileNumber;
  let date = monthDate, time = reqBody.BookingTime, name = reqBody.Name, mobileNum = mobilenumber;
  let value = count > 1 ? 'persons' : 'person';
  const eCode = reqBody?.eCode || reqBody?.oCode || 'VRU';
  let mailSub = `${eCode}-TableBooking-${date},${time}`;
  const eName = reqBody?.eName || reqBody?.oName || 'V Reserve U';
  let htmlContent = 
    `<p>Hello,</p><p>You have a Table Booking. Table booked for ${count} ${value} on <b>${date} ${time}</b> by</p><p>Customer: <b>${name}</b></p><p>Phone #: <b>+91 ${mobileNum}</b></p>
    <p><b>Note:</b> This is a system-generated email. Please do not reply to this message.</p>
    <p>Regards,<br/><b>${eName} Team</b></p>`;
  Mail.sendEMail(config.toMails, mailSub, htmlContent, (err, resObj) => { });
}

const rescheduleSms = (reqBody, bCode) => {
  const date = moment(reqBody.bDt).format("Do MMM YYYY");
  const count = reqBody.vegCount + reqBody.nonVegCount + reqBody.kidsCount;
  const data = {
    template_id: smsJson[bCode]?.rescheduleBkngTempId, short_url: config.smsShortUrl, 
    recipients: [{ mobiles: reqBody.mobCcNum, name: reqBody.name, members: count, date, time: reqBody.bTm, mins: '15'}]
  };
  Apicall.commonSms(data, (resObj) => { });
}
