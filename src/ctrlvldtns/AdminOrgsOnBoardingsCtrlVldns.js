/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

const listVldn = (req) => {
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

const validateVldn = (req) => {
  const reqBody = req.body;
  if (!reqBody.vName || !reqBody.vType) {
    const rf = SetRes.msdReqFields();
    return { flag: false, result: rf };
  } else {
    return { flag: true };
  }
}
const createVldn = (req) => {
  const reqBody = req.body;
    const bodyVldn = bodyValidation(reqBody);
    if (!bodyVldn) {
      const rf = SetRes.msdReqFields();
      return { flag: false, result: rf };
    } else {
      return { flag: true };
    }
}

const viewVldn = (req) => {
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

const statusUpdateVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.params.id || !reqBody.status ||!reqBody.notes) {
    const rf = SetRes.msdReqFields();
    return { flag: false, result: rf };
  } else {
    return { flag: true };
  }
}

const updateVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else {
    const bodyVldn = bodyValidation(reqBody);
    if (!bodyVldn || !reqBody.id) {
      const rf = SetRes.msdReqFields();
      return { flag: false, result: rf };
    } else {
      return { flag: true };
    }
  }
}

const activateVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else {
    if (!req.params.id || !reqBody.isActive) {
      const rf = SetRes.msdReqFields();
      return { flag: false, result: rf };
    } else {
      return { flag: true };
    }
  }
}

const onBrdngLfcsVldn = (req) => {
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.params.id) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

module.exports = {
  validateVldn, createVldn, listVldn, viewVldn, statusUpdateVldn, updateVldn, activateVldn, onBrdngLfcsVldn
};

const bodyValidation = (reqBody) => {
  if (reqBody.oName && reqBody.oCode && reqBody.cPerson && reqBody.mobNum && reqBody.mobCcNum && reqBody.emID && reqBody.oobStatus && reqBody.houseNum && reqBody.area && reqBody.zip && reqBody.district && reqBody.state) {
    return true
  } else {
    return false
  }
}