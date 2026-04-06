/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const sRes = require('../SetRes');

const ssnRoleTokenVldn = (tData) => {
  if (!tData) {
    const it = sRes.tokenInvalid();
    return { flag: false, result: it };
  } else if (tData.status === 'Expired') {
    const te = sRes.tokenExpired();
    return { flag: false, result: te };
  } else {
    return { flag: true };
  }
}

const postAdminRolesAcsListVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.actPgNum || !reqBody.rLimit) {
    const ad = sRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const postAdminRolesAcsCrtVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else {
    const data = b2bValidData(reqBody);
    if (!data) {
      const mandatoryResult = sRes.msdReqFields();
      return { flag: false, result: mandatoryResult };
    } else {
      return { flag: true };
    }
  }
}

const postAdminRolesAcsViewVldn = (req) => {
  if (!req.headers.vruadatoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.params.recordId) {
    const ad = sRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const postAdminRolesAcsEditVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.params.recordId || !reqBody.raSeq || !reqBody.access) {
    const mandatoryResult = sRes.msdReqFields();
    return { flag: false, result: mandatoryResult };
  } else {
    return { flag: true };
  }
}

module.exports = {
  ssnRoleTokenVldn, postAdminRolesAcsListVldn, postAdminRolesAcsCrtVldn, postAdminRolesAcsViewVldn, postAdminRolesAcsEditVldn
}

const b2bValidData = (reqBody) => {
  if (reqBody.raSeq && reqBody.role && reqBody.rType && reqBody.rName && reqBody.rCode && reqBody.access) {
    return true;
  } else {
    return false;
  }
}