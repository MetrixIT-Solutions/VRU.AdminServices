/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

const ctrngCrtVldn = (req) => {
  const vldn = ctrngVldn(req.body);
  if (!vldn) {
    const ma = SetRes.msdReqFields();
    return { flag: false, result: ma };
  } else {
    return { flag: true };
  }
};

const cntctCrtVldn = (req) => {
  const vldn = cntctVldn(req.body);
  if (!vldn) {
    const ma = SetRes.msdReqFields();
    return { flag: false, result: ma };
  } else {
    return { flag: true };
  }
};

const offerViewVldn = (req) => {
  const reqBody = req.body;
   if (!reqBody.oCode || !reqBody.eCode ||!reqBody.bCode) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
};

const prvtDngCrtVldn = (req) => {
  const vldn = pvrtDVldn(req.body);
  if (!vldn) {
    const ma = SetRes.msdReqFields();
    return { flag: false, result: ma };
  } else {
    return { flag: true };
  }
};

const bkngCrtVldn = (req) => {
    const vldn = bkgVldn(req.body);
    if (!vldn) {
      const ma = SetRes.msdReqFields();
      return { flag: false, result: ma };
    } else {
      return { flag: true };
    }
}

const otpVldn = (req) => {
  const reqBody = req.body;
   if (!reqBody.otpNum) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const usrCrtVldn = (req) => {
  const vldn = usrVldn(req.body);
  if (!vldn) {
    const ma = SetRes.msdReqFields();
    return { flag: false, result: ma };
  } else {
    return { flag: true };
  }
};

const custFdBkVldn = (req) => {
  const reqBody = req.body;
  if (!reqBody.oCode || !reqBody.eCode || !reqBody.bCode || !reqBody.name || !reqBody.mobileNum || !reqBody.userID || !reqBody.rating) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const custFrnchBkVldn = (req) => {
  const reqBody = req.body;
  if (!reqBody.oCode || !reqBody.eCode || !reqBody.name || !reqBody.mobileNum || !reqBody.userID || !reqBody.fState || !reqBody.fStateCode || !reqBody.fCity) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

module.exports = {
  ctrngCrtVldn, cntctCrtVldn, offerViewVldn, prvtDngCrtVldn, bkngCrtVldn, otpVldn, usrCrtVldn, custFdBkVldn, custFrnchBkVldn
};

const ctrngVldn = (reqBody) => {
  if (reqBody.oCode && reqBody.eCode && reqBody.bCode && reqBody.name && reqBody.mobileNum && reqBody.mobCcNum && reqBody.serviceFor && reqBody.eDt && reqBody.eDtStr && reqBody.eLocation) {
    return true
  } else {
    return false
  }
};

const cntctVldn = (reqBody) => {
  if (reqBody.name && reqBody.mobileNum && reqBody.emID && reqBody.userID && reqBody.message) {
    return true
  } else {
    return false
  }
};

const pvrtDVldn = (reqBody) => {
  if (reqBody.oCode && reqBody.eCode && reqBody.bCode && reqBody.name && reqBody.mobileNum && reqBody.userID && reqBody.bookingFor && reqBody.bDtTm && reqBody.bDt && reqBody.bTm && reqBody.bDtStr) {
    return true
  } else {
    return false
  }
};

const bkgVldn = (reqBody) => {
  if (reqBody.oCode && reqBody.eCode && reqBody.bCode && reqBody.name && reqBody.mobileNum && reqBody.userID && reqBody.netAmt && reqBody.totalAmt && reqBody.bDtTm && reqBody.bDt && reqBody.bTm && reqBody.bDtStr && reqBody.oType) {
    return true
  } else {
    return false
  }
}

const usrVldn = (reqBody) => {
  if (reqBody.oCode && reqBody.eCode &&  reqBody.bCode && reqBody.mobileNum && reqBody.name && reqBody.userID) {
    return true
  } else {
    return false
  }
}