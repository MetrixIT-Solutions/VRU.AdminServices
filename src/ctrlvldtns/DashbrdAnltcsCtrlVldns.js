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

const postDashbrdAnltcsListVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  }  else {
    return { flag: true };
  }
}

const getDashbrdAnltcsViewVldn = (req) => {
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

module.exports = {
  tokenVldn,
  postDashbrdAnltcsListVldn,
  getDashbrdAnltcsViewVldn
};
