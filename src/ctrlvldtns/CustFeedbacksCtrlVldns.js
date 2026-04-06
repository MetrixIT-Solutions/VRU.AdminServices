/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

const postUsrFdBkListVldn = (req) => {
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

const postUsrFdBkCreateVldn = (req) => {
  const reqBody = req.body;
  const cVldn = bodyVldn(reqBody);
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!cVldn) {
    const ad = SetRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

module.exports = {
 postUsrFdBkListVldn, postUsrFdBkCreateVldn
};


const bodyVldn = (reqBody) => {
  if(!reqBody.entId || !reqBody.eName || !reqBody.eCode || !reqBody.name || !reqBody.mobCc || !reqBody.mobNum || !reqBody.mobCcNum || !reqBody.rating || !reqBody.ratingStr || !reqBody.qa.length){
    return true
  } else return false
}