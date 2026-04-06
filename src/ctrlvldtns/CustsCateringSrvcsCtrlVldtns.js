/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
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
  if (!req.headers.vruadatoken) {
    const tr = SetRes.tokenRequired();
    return { flag: false, result: tr };
  } else if (!req.params.id) {
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

const postCateringSrvcUpdateVldn = (req) => {
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else {
    const vldn = updateBodyValidation(req.body);
    if (!req.body.id || !vldn) {
      const ma = SetRes.msdReqFields();
      return { flag: false, result: ma };
    } else {
      return { flag: true };
    }
  }
}
module.exports = {
  createVldn, listVldn, statusVldn, viewVldn, postCustDshbrdVldn, postCateringSrvcUpdateVldn
};

const bodyValidation = (reqBody) => {
  if (reqBody.name && reqBody.mobileNum && reqBody.mobCcNum && reqBody.serviceFor && reqBody.eDt && reqBody.eLocation) {
    return true
  } else {
    return false
  }
}
const updateBodyValidation = (reqBody) => {
  if (reqBody.name && reqBody.serviceFor && reqBody.eDt && reqBody.eLocation) {
    return true
  } else {
    return false
  }
}