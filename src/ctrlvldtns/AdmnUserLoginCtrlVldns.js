/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

const postUsrLgnVldn = (req) => {
  const reqBody = req.body;
  if (!reqBody.userID || !reqBody.password) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const profileUpdateVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.id ||reqBody.fullName && reqBody.shortName && reqBody.mobNum && reqBody.mobCcNum && reqBody.mobCc) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const adminFPVald = (req) => {
  if(!req.body.usrID) {
    const msdReqFields = SetRes.msdReqFields();
    return {isTrue: false, result: msdReqFields};
  } else {
    return {isTrue: true};
  }
}

const adminFPOtpVald = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadotoken) {
    const tdr = SetRes.tokenRequired();
    return { isTrue: false, result: tdr };
  } else if (!reqBody.otp) {
    const mrf = SetRes.msdReqFields();
    return { isTrue: false, result: mrf };
  } else {
    return { isTrue: true };
  }
}

const AdminRestPwdVald = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadotoken) {
    const tdr = SetRes.tokenRequired();
    return { isTrue: false, result: tdr };
  } else if (!reqBody.password) {
    const mrf = SetRes.msdReqFields();
    return { isTrue: false, result: mrf };
  } else {
    return { isTrue: true };
  }
}

const postAdminUserAgentIdVldn = (req) => {
  // const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const tdr = SetRes.tokenRequired();
    return { isTrue: false, result: tdr };
  // } else if (!reqBody.agentId) {
  //   const mrf = SetRes.msdReqFields();
  //   return { isTrue: false, result: mrf };
  } else {
    return { isTrue: true };
  }
}

const postAdminUserAgentCall = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const tdr = SetRes.tokenRequired();
    return { isTrue: false, result: tdr };
  } else if (!reqBody.mobNum || !reqBody.agentId || !reqBody.exten) {
    const mrf = SetRes.msdReqFields();
    return { isTrue: false, result: mrf };
  } else {
    return { isTrue: true };
  }
}

const tokenValdtn = (tData) => {
  if (!tData) {
    const it = SetRes.invalidToken();
    return { isTrue: false, result: it };
  } else if (tData.status === 'Expired') {
    const te = SetRes.tokenExpired();
    return { isTrue: false, result: te };
  } else {
    return { isTrue: true };
  }
}

const postUsrChnagePswdVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const tdr = SetRes.tokenRequired();
    return { isTrue: false, result: tdr };
  } else if (!reqBody.curPswrd || !reqBody.password) {
    const mrf = SetRes.msdReqFields();
    return { isTrue: false, result: mrf };
  } else {
    return { isTrue: true };
  }
}

const postOrgAdminSetPswrdVldn = (req) => {
  const reqBody = req.body;
  if (!req.body.id || !reqBody.password) {
    const mrf = SetRes.msdReqFields();
    return { isTrue: false, result: mrf };
  } else {
    return { isTrue: true };
  }
}

module.exports = {
  postUsrLgnVldn, profileUpdateVldn, adminFPVald, 
  adminFPOtpVald, AdminRestPwdVald, postAdminUserAgentIdVldn, postAdminUserAgentCall, tokenValdtn, postUsrChnagePswdVldn, postOrgAdminSetPswrdVldn
};
