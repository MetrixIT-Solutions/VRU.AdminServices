/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

const createVldn = (req) => {
  if (!req.headers.vruadatoken) {
    const tr = SetRes.tokenRequired();
    return { flag: false, result: tr };
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

const listVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const tr = SetRes.tokenRequired();
    return { flag: false, result: tr };
  } else if (!reqBody.actPgNum || !reqBody.rLimit) {
    const ma = SetRes.msdReqFields();
    return { flag: false, result: ma };
  } else {
    return { flag: true };
  }
}

const viewVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const tr = SetRes.tokenRequired();
    return { flag: false, result: tr };
  } else if (!reqBody.id) {
    const ma = SetRes.msdReqFields();
    return { flag: false, result: ma };
  } else {
    return { flag: true };
  }
}

const statusVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const tr = SetRes.tokenRequired();
    return { flag: false, result: tr };
  } else if (!reqBody.id || !reqBody.status) {
    const ma = SetRes.msdReqFields();
    return { flag: false, result: ma };
  } else {
    return { flag: true };
  }
}

const postCustDshbrdVldn = (req) => {
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else {
    return { flag: true };
  }
}

const postPrivateDiningUpdateVldn = (req) => {
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else {
    const vldn = bodyValidation(req.body);
    if (!req.body.id || !vldn) {
      const ma = SetRes.msdReqFields();
      return { flag: false, result: ma };
    } else {
      return { flag: true };
    }
  }
}
const getPrivateDiningLfcVldn = (req) => {
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else {
    if (!req.params.id) {
      const ma = SetRes.msdReqFields();
      return { flag: false, result: ma };
    } else {
      return { flag: true };
    }
  }
}

module.exports = {
  createVldn, listVldn, statusVldn, viewVldn, postCustDshbrdVldn, postPrivateDiningUpdateVldn, getPrivateDiningLfcVldn
};

const bodyValidation = (reqBody) => {
  if (reqBody.name && reqBody.mobileNum && reqBody.userID && reqBody.bookingFor && reqBody.bDtTm && reqBody.bDt && reqBody.bTm) {
    return true
  } else {
    return false
  }
}