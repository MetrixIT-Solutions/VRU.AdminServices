/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

const gsiListVldn = (req) => {
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

const gsiCrtVldn = (req) => {
  const reqBody = req.body;
  const bodyVldn = setGsiCreateVldn(reqBody);
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.entId || !reqBody.eName || !reqBody.eCode || !reqBody.branch || !reqBody.bCode || !reqBody.bName || !bodyVldn) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const gsiListCountVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.startDate || !reqBody.endDate) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const gsiUpdateVldn = (req) => {
  const bodyVldn = setGsiCreateVldn(req.body);
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.body.id || !bodyVldn) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}
const gsiViewVldn = (req) => {
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

const gsiAvgCountByMonthVldn = (req) => {
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.body.monthYear) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

module.exports = {
  gsiListVldn, gsiCrtVldn, gsiListCountVldn, gsiUpdateVldn, gsiViewVldn, gsiAvgCountByMonthVldn
};

const setGsiCreateVldn = (reqBody) => {
if(!reqBody.cName || !reqBody.tNum || !reqBody.sDtStr || !reqBody.gName || !reqBody.gMob || !reqBody.dineSlot || !reqBody.hdyk || !reqBody.oExp || !reqBody.oExpVal || !reqBody.clean || !reqBody.cleanVal || !reqBody.cmfrt || !reqBody.cmfrtVal || !reqBody.bExp || !reqBody.bExpVal || !reqBody.bvrgs || !reqBody.bvrgsVal || !reqBody.buffet || !reqBody.buffetVal || !reqBody.strs || !reqBody.strsVal || !reqBody.dsrts || !reqBody.dsrtsVal || !reqBody.lveCntr || !reqBody.lveCntrVal || !reqBody.atntv || !reqBody.atntvVal || !reqBody.crts || !reqBody.crtsVal || !reqBody.bilExp || !reqBody.bilExpVal){
 return false
} else return true
}
