/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

const tokenVldn = (tData) => {
  if (!tData) {
    const it = SetRes.invalidToken();
    return { flag: false, result: it };
  } else if (tData?.status === 'Success') {
    return { flag: true };
  } else if (tData?.status === 'Expired') {
    const te = SetRes.tokenExpired();
    return { flag: false, result: te };
  } else {
    const ue = SetRes.unKnownErr({});
    return { flag: false, result: ue };
  }
}

const postAdminListVldn = (req) => {
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

const admnUsrCreateVldtns = (req) => {
  const reqBody = JSON.parse(req.body.userData);
  if (!req.headers.vruadatoken) {
    const tokenResult = SetRes.tokenRequired();
    return { flag: false, result: tokenResult };
  } else {
    const data = userValidData(reqBody);
    if (!data) {
      const mandatoryResult = SetRes.msdReqFields();
      return { flag: false, result: mandatoryResult };
    } else {
      return { flag: true };
    }
  }
}

const adminUsrEditVldtns = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const tokenResult = SetRes.tokenRequired();
    return { flag: false, result: tokenResult };
  } else {
    const data = userEditData(reqBody);
    if (!req.params.recordId || !data) {
      const msId = SetRes.msdReqFields();
      return { flag: false, result: msId };
    } else {
      return { flag: true };
    }
  }
}

const adminUsrStatusEditVldtns = (req) => {
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

const getAdminUserView = (req) => {
  if (!req.headers.vruadatoken) {
    const tr = SetRes.tokenRequired();
    return { flag: false, result: tr };
  } else if (!req.params.recordId) {
    const ma = SetRes.msdReqFields();
    return { flag: false, result: ma };
  } else {
    return { flag: true };
  }
}
const vldtAdUsrsCount = (req) => {
  if (!req.headers.vruadatoken) {
    const tr = SetRes.tokenRequired();
    return { flag: false, result: tr };
  } else if (!req.params.orgId) {
    const ma = SetRes.msdReqFields();
    return { flag: false, result: ma };
  } else {
    return { flag: true };
  }
}

const postAdminCustCallLogListVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.actPgNum || !reqBody.rLimit || !reqBody.keyStatus || !reqBody.key) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const postAdminAgentListVldn = (req) => {
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else {
    return { flag: true };
  }
}

module.exports = {
  tokenVldn, postAdminListVldn, admnUsrCreateVldtns, adminUsrEditVldtns, adminUsrStatusEditVldtns, getAdminUserView, 
  vldtAdUsrsCount, postAdminCustCallLogListVldn, postAdminAgentListVldn
};

const userValidData = (reqBody) => {
  if (reqBody.fullName && reqBody.shortName && reqBody.status && reqBody.userType && reqBody.userRole) {
    return true;
  } else {
    return false;
  }
}

const userEditData = (reqBody) => {
  if (reqBody.fullName && reqBody.shortName && reqBody.status && reqBody.userType && reqBody.userRole) {
    return true;
  } else {
    return false;
  }
}
