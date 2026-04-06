/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');


const createVldn = (req) => {
  const reqBody = JSON.parse(req.body.menuData);
  const vldn = bodyValidation(reqBody)
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!vldn) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const listVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.rLimit || !reqBody.actPgNum) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const statusUpdateVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.id || !reqBody.status) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const menuDeleteVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.id) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const updateVldn = (req) => {
  const reqBody = JSON.parse(req.body.menuData);
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.id || !reqBody.day || !reqBody.itemName) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

module.exports = {
  createVldn, listVldn, statusUpdateVldn, menuDeleteVldn, updateVldn
};

const bodyValidation = (reqBody) => {
  if (reqBody.entId && reqBody.eName && reqBody.eCode && reqBody.branch && reqBody.bCode && reqBody.subCategory && reqBody.itemData.length > 0) {
    return true
  } else {
    return false
  }
}
