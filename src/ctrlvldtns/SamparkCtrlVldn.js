/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

const postAdminUserAgentIdVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const tdr = SetRes.tokenRequired();
    return { isTrue: false, result: tdr };
  } else if (!reqBody.agentId) {
    const mrf = SetRes.msdReqFields();
    return { isTrue: false, result: mrf };
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

const postAdminUserAgentRedialVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const tdr = SetRes.tokenRequired();
    return { isTrue: false, result: tdr };
  } else if (!reqBody.agentId || !reqBody.number || !reqBody.cNumber) {
    const mrf = SetRes.msdReqFields();
    return { isTrue: false, result: mrf };
  } else {
    return { isTrue: true };
  }
}

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

module.exports = {
  postAdminUserAgentIdVldn, postAdminUserAgentCall, postAdminUserAgentRedialVldn, tokenVldn
};
