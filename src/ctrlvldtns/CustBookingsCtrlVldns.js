/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

const postUsrTableStsVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.actPgNum || !reqBody.pageLimit) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const postCustStsUpdVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.status || !reqBody.id || !reqBody.oldStatus) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}


const postCustDshbrdVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
    // } else if (!reqBody.status || !reqBody.id || !reqBody.oldStatus) {
    //   const ad = SetRes.msdReqFields();
    //   return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const postCustCreateBkngVldn = (req) => {
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else {
    const vldn = bodyValidation(req.body);
    if (!vldn) {
      const ma = SetRes.msdReqFields();
      return { flag: false, result: ma };
    } else {
      return { flag: true };
    }
  }
}

const postCustBkngViewVldn = (req) => {
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.body.id || !req.body.status) {
    const ma = SetRes.msdReqFields();
    return { flag: false, result: ma };
  } else {
    return { flag: true };
  }
}

const postCustBkngUpdateVldn = (req) => {
  const vldn = bodyValidation(req.body);
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.body.id || !req.body.status || !vldn) {
    const ma = SetRes.msdReqFields();
    return { flag: false, result: ma };
  } else {
    return { flag: true };
  }
}

const postBookingByCalendarValidation = (req) => {
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.body.startDate || !req.body.endDate || !req.body.status) {
    const ma = SetRes.msdReqFields();
    return { flag: false, result: ma };
  } else {
    return { flag: true };
  }
}

const postCustExcelCreateBkngVldn = (req) => {
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } 
  else {
    const vldn = bodyExcelValidation(req.body);
    if (!vldn) {
      const ma = SetRes.msdReqFields();
      return { flag: false, result: ma };
    } else {
      return { flag: true };
    }
  }
}

const custTblBkngLfcsVldn = (req) => {
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.params.id) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

module.exports = {
  postUsrTableStsVldn, postCustStsUpdVldn, postCustDshbrdVldn, postCustCreateBkngVldn,
  postCustBkngViewVldn, postCustBkngUpdateVldn, postBookingByCalendarValidation, postCustExcelCreateBkngVldn,
  custTblBkngLfcsVldn
};

const bodyValidation = (reqBody) => {
  if (reqBody.name && reqBody.mobileNum && reqBody.userID && reqBody.netAmt && reqBody.totalAmt && reqBody.bDt && reqBody.bTm) {
    return true
  } else {
    return false
  }
}

const bodyExcelValidation = (reqBody) => {
  if (reqBody.Name && reqBody.MobileNumber && reqBody.BookingTime && reqBody.BookingDate && reqBody.OccationType && reqBody.BookingType && reqBody.BookingStatus) {
    return true
  } else {
    return false
  }
}
