/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

const postRstnViewVldn = (req) => {
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else {
    return { flag: true };
  }
}

const postRstnUpdateVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.seatCapacity || ! reqBody.bcLaps || !reqBody.wVegAmt || !reqBody.wNonVegAmt || !reqBody.wvTotalAmt || !reqBody.wnvTotalAmt || !reqBody.weVegAmt || !reqBody.weNonVegAmt || !reqBody.wevTotalAmt || !reqBody.wenvTotalAmt ) {
    const mf = SetRes.msdReqFields();
    return { flag: false, result: mf };
  } else {
    return { flag: true };
  }
}

const postRstnPricingCreateVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.eName || !reqBody.eCode || !reqBody.entId || !reqBody.seatCapacity || !reqBody.bcLaps || !reqBody.wVegAmt || !reqBody.wNonVegAmt || !reqBody.wvTotalAmt || !reqBody.wnvTotalAmt || !reqBody.weVegAmt || !reqBody.weNonVegAmt || !reqBody.wevTotalAmt || !reqBody.wenvTotalAmt) {
    const mf = SetRes.msdReqFields();
    return { flag: false, result: mf };
  } else {
    return { flag: true };
  }
}

const postRstnSpclDayPricingListVldn = (req) => {
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

const postRstnSplcDayViewVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const tr = SetRes.tokenRequired();
    return { flag: false, result: tr };
  } else if (reqBody.value) {
    if(reqBody.value == 'spclDay'){
     if(!reqBody.id){
      const ma = SetRes.msdReqFields();
      return { flag: false, result: ma };
     } else {
      return { flag: true };
     }
    }
  } else if(!reqBody.entId){
      const ma = SetRes.msdReqFields();
      return { flag: false, result: ma };
  }  else {
    return { flag: true };
  }
}

const postRstnSpclDayPricingDeleteVldn = (req) => {
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

const postRestuarantPricingCreateVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.orgId || !reqBody.oCode || !reqBody.oName || !reqBody.entId || !reqBody.eName || !reqBody.eCode) {
    const mf = SetRes.msdReqFields();
    return { flag: false, result: mf };
  } else {
    return { flag: true };
  }
}

const postRstnSpclDayPricingBranchListVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const tr = SetRes.tokenRequired();
    return { flag: false, result: tr };
  } else if (!reqBody.branchId) {
    const ma = SetRes.msdReqFields();
    return { flag: false, result: ma };
  } else {
    return { flag: true };
  }
}

module.exports = {
  postRstnViewVldn, postRstnUpdateVldn, postRstnPricingCreateVldn, postRstnSpclDayPricingListVldn, postRstnSplcDayViewVldn, postRstnSpclDayPricingDeleteVldn, 
  postRestuarantPricingCreateVldn, postRstnSpclDayPricingBranchListVldn
}