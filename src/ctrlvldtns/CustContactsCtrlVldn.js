/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

const postCustContsListVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.actPgNum || !reqBody.rLimit) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const postCustContsStsUpdVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.status || !reqBody.id) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const createVldn = (req) => {
  const vldn = bodyValidation(req.body);
  if (!vldn) {
    const ma = SetRes.msdReqFields();
    return { flag: false, result: ma };
  } else {
    return { flag: true };
  }
}

const custCntctLfcsVldn = (req) => {
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
  postCustContsListVldn, postCustContsStsUpdVldn, createVldn, custCntctLfcsVldn
};

const bodyValidation = (reqBody) => {
  if (reqBody.name && reqBody.mobileNum  && reqBody.emID && reqBody.userID && reqBody.message && reqBody.eCode) {
    return true
  } else {
    return false
  }
}