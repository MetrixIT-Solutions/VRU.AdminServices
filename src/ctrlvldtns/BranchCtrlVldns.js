/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

const postBBQHBrnchListVldn = (req) => {
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

const postBBQHBrnchCrtVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.bName || !reqBody.bCode || !reqBody.cPerson || !reqBody.mobCc || !reqBody.mobNum || !reqBody.mobCcNum || !reqBody.emID || !reqBody.blName || !reqBody.houseNum || !reqBody.area || !reqBody.mandal || !reqBody.zip || !reqBody.state || !reqBody.stateCode || !reqBody.district) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const postBBQHBrnchEditVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.id || !reqBody.bName || !reqBody.bCode || !reqBody.cPerson || !reqBody.mobCc || !reqBody.mobNum || !reqBody.mobCcNum || !reqBody.emID || !reqBody.blName || !reqBody.houseNum || !reqBody.area || !reqBody.mandal || !reqBody.zip || !reqBody.state || !reqBody.stateCode || !reqBody.district) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const postBBQHBrnchStatusUpdateVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.id || !reqBody.bStatus) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

module.exports = {
  postBBQHBrnchListVldn, postBBQHBrnchCrtVldn, postBBQHBrnchEditVldn, postBBQHBrnchStatusUpdateVldn
};
