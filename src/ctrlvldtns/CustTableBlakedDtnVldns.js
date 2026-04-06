/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');
const SetRes = require('../SetRes');

const custTableBlakedDtnCreate = (req) => {
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

const custTableBlakedDtnListVldtn = (req) => {
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

const adminUsrEditVldtns = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const tokenResult = SetRes.tokenRequired();
    return { flag: false, result: tokenResult };
  } else {
    if (!reqBody.recordId) {
      const msId = SetRes.msdReqFields();
      return { flag: false, result: msId };
    } else {
      return { flag: true };
    }
  }
}

module.exports = {
  custTableBlakedDtnCreate, custTableBlakedDtnListVldtn, adminUsrEditVldtns
}

const bodyValidation = (reqBody) => {
  if (reqBody.blockDate && reqBody.slotType) {
    return true;
  } else {
    return false;
  }
}
