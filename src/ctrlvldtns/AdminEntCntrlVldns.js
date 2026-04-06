/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

const postEntiCreateVldtn = (req) => {
  const reqBody = JSON.parse(req.body.entData);
  if (!req.headers.vruadatoken) {
    const re = SetRes.tokenRequired();
    return { flag: false, result: re }
  } else {
    const bodyValdtn = bodyValidation(reqBody);
    if (!bodyValdtn) {
      const rf = SetRes.msdReqFields();
      return { flag: false, result: rf };
    } else {
      return { flag: true };
    }
  }
}

const postEntListVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.actPgNum || !reqBody.rLimit) {
    const rf = SetRes.msdReqFields();
    return { flag: false, result: rf };
  } else {
    return { flag: true };
  }
}

const postEntiViewVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.id) {
    const rf = SetRes.msdReqFields();
    return { flag: false, result: rf };
  } else {
    return { flag: true };
  }
}

const postEntiStatusUpdateVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.id || !reqBody.status) {
    const rf = SetRes.msdReqFields();
    return { flag: false, result: rf };
  } else {
    return { flag: true };
  }
}

const postEntiUpdateVldn = (req) => {
  const reqBody = JSON.parse(req.body.entData);
  if (!req.headers.vruadatoken) {
    const re = SetRes.tokenRequired();
    return { flag: false, result: re }
  } else {
    const bodyValdtn = bodyValidation(reqBody);
    if (!bodyValdtn || !reqBody.id) {
      const rf = SetRes.msdReqFields();
      return { flag: false, result: rf };
    } else {
      return { flag: true };
    }
  }
}

const postEntOrgVldn = (req) =>{
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  }  else {
    return { flag: true };
  }
}

module.exports = {
  postEntiCreateVldtn, postEntListVldn, postEntiViewVldn, postEntiStatusUpdateVldn, postEntiUpdateVldn, postEntOrgVldn
};

const bodyValidation = (reqBody) => {
  if (reqBody.obType && reqBody.eName && reqBody.eCode && reqBody.mobNum && reqBody.mobCcNum && reqBody.emID && reqBody.eStatus && reqBody.houseNum && reqBody.area && reqBody.zip && reqBody.district && reqBody.state && reqBody.stateCode) {
    return true;
  } else {
    return false;
  }
}