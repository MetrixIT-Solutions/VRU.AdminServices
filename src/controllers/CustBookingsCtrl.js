/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustBookingsSrvc = require('../services/CustBookingsSrvc');
const CustBookingsCtrlVldns = require('../ctrlvldtns/CustBookingsCtrlVldns');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');
const token = require('../tokens');
const util = require('../lib/util');
var cron = require('node-cron');
const CommonSrvc = require('../services/CommonSrvc');
const XLSX = require('xlsx');
const SetRes = require('../SetRes');

// --- Begin: CronJob  for booking-cancel Msg create
cron.schedule('0 16 * * *', () => {
  CustBookingsSrvc.postCustClosedTableBookingUpdate();
});
// --- End: CronJob  for booking-cancel Msg create

// --- Begin: CronJob  for booking-cancel Msg create
cron.schedule('0 23 * * *', () => {
  CustBookingsSrvc.postCustClosedTableBookingUpdate1();
});
// --- End: CronJob  for booking-cancel Msg create

// --- Begin: CronJob  for booking-Confirmed Booking move to Absent
// cron.schedule('0 3 * * *', () => {
//   CustBookingsSrvc.bookingConfirmedStatusUpdate();
// });
// --- End: CronJob  for booking-Confirmed Booking move to Absent

const postAdminUserTableStatus = (req, res) => {
  const vldRes = CustBookingsCtrlVldns.postUsrTableStsVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustBookingsSrvc.postAdminUserTableStatus(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postCustTableStatusUpdate = (req, res) => {
  const vldRes = CustBookingsCtrlVldns.postCustStsUpdVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustBookingsSrvc.postCustTableStatusUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}


const postCustTableDshbrdCount = (req, res) => {
  const vldRes = CustBookingsCtrlVldns.postCustDshbrdVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustBookingsSrvc.postCustTableDshbrdCount(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postCustTableBookingCountByDate = (req, res) => {
  const vldRes = CustBookingsCtrlVldns.postCustDshbrdVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustBookingsSrvc.postCustTableBookingCountByDate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postCustTableBookingCreate = (req, res) => {
  const vldRes = CustBookingsCtrlVldns.postCustCreateBkngVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustBookingsSrvc.postCustTableBookingCreate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postCustTableBookingView = (req, res) => {
  const vldRes = CustBookingsCtrlVldns.postCustBkngViewVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustBookingsSrvc.postCustTableBookingView(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postCustTableBookingUpdate  = (req, res) => {
  const vldRes = CustBookingsCtrlVldns.postCustBkngUpdateVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustBookingsSrvc.postCustTableBookingUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postCustTableBookingsCountByCalendar = (req, res) => {
  const vldRes = CustBookingsCtrlVldns.postBookingByCalendarValidation(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustBookingsSrvc.postCustTableBookingsCountByCalendar(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postCustExcelDataTableBookingCreate = (req, res) => {
  setExcelFileData(req.body);
  const vldRes = CustBookingsCtrlVldns.postCustExcelCreateBkngVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustBookingsSrvc.postCustExcelDataTableBookingCreate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const getCustTableBookingLfcsList = (req, res) => {
  const vldRes = CustBookingsCtrlVldns.custTblBkngLfcsVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustBookingsSrvc.getCustTableBookingLfcsList(req.params.id, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const getCustTableBookingsTotalList = (req, res) => {
  if (req.headers.vruadatoken) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustBookingsSrvc.getCustTableBookingsTotalList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, SetRes.tokenRequired());
  }
}

module.exports = {
  postAdminUserTableStatus, postCustTableStatusUpdate, postCustTableDshbrdCount,
  postCustTableBookingCountByDate, postCustTableBookingCreate, postCustTableBookingView,
  postCustTableBookingUpdate, postCustTableBookingsCountByCalendar, postCustExcelDataTableBookingCreate,
  getCustTableBookingLfcsList, getCustTableBookingsTotalList
};

const setExcelFileData = (setdata) => {
  const data1 = CommonSrvc.currUTCObj();
  const year = data1.currUTCYear;
  const month = data1.currUTCMonth;
  const day = data1.currUTCDay;
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const filepath = 'assets/files/bookingImports/' + 'BBQH-' + year + month + day + '-' + hours + minutes + seconds + '.xlsx';

  const data = setdata;

  const keys = Object.keys(data).filter( key => {return data[key] === ''})
  const filteredKeys = keys.filter(key => key === 'Name' || key === 'Branch' || key === 'BookingDate' || key === 'BookingTime' || key === 'MobileNumber' || key === 'BookingType' || key === 'OccationType' || key === 'BookingStatus');
  if(data.Name == '' || data.Branch == '' || data.BookingDate == '' || data.BookingTime == '' || data.MobileNumber == '' || data.BookingType == '' || data.OccationType == '' || data.BookingStatus == ''){

    data['Error'] = filteredKeys + ' ' + 'is requried';
    data['Sucess'] = 'failed';

    const convertExcelToJSon = () => {
      const workSheet = XLSX.utils.json_to_sheet([data]);
      const workBook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workBook, workSheet, "data");
      XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })
      XLSX.write(workBook, { bookType: 'xlsx', type: "binary" })
      XLSX.writeFile(workBook, filepath);
    }
    convertExcelToJSon();
  } else {
    data['Error'] = '';
    data['Sucess'] = 'Sucess'

    const convertExcelToJSon = () => {
      const workSheet = XLSX.utils.json_to_sheet([data]);
      const workBook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workBook, workSheet, "data");
      XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })
      XLSX.write(workBook, { bookType: 'xlsx', type: "binary" })
      XLSX.writeFile(workBook, filepath);
    }
    convertExcelToJSon();
  }
}