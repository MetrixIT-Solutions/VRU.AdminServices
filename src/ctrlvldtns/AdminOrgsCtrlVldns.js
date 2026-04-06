/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');

const postOrgCreateVldn = (req) => {
  const reqBody = JSON.parse(req.body.orgData);
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else {
    const bodyVldn = bodyValidation(reqBody);
    if (!bodyVldn) {
      const rf = SetRes.msdReqFields();
      return { flag: false, result: rf };
    } else {
      return { flag: true };
    }
  }
}

const postOrgListVldn = (req) => {
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

const postOrgViewVldn = (req) => {
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

const postOrgStatusUpdateVldn = (req) => {
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

const postAdminOrgUpdateVldn = (req) => {
  const reqBody = JSON.parse(req.body.orgData);
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else {
    const bodyVldn = updateBodyValidation(reqBody);
    if (!bodyVldn || !reqBody.id) {
      const rf = SetRes.msdReqFields();
      return { flag: false, result: rf };
    } else {
      return { flag: true };
    }
  }
}

const putOrgSubPlanVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!reqBody.id || !reqBody.oPlan || !reqBody.oeLimit || !reqBody.oebLimit || !reqBody.oauLimit || !reqBody.oeuLimit) {
    const rf = SetRes.msdReqFields();
    return { flag: false, result: rf };
  } else {
    return { flag: true };
  }
}

module.exports = {
  postOrgCreateVldn, postOrgListVldn, postOrgViewVldn, postOrgStatusUpdateVldn, postAdminOrgUpdateVldn, putOrgSubPlanVldn
};

const bodyValidation = (reqBody) => {
  if (reqBody.oName && reqBody.oCode && reqBody.mobNum && reqBody.mobCcNum && reqBody.emID && reqBody.oStatus && reqBody.houseNum && reqBody.area && reqBody.zip && reqBody.district && reqBody.state
    && reqBody.oPlan && reqBody.oeLimit && reqBody.oebLimit && reqBody.oauLimit && reqBody.oeuLimit && reqBody.oobStatus && reqBody.oobsMsg) {
    return true
  } else {
    return false
  }
}

const updateBodyValidation = (reqBody) => {
  if (reqBody.oName && reqBody.oCode && reqBody.mobNum && reqBody.mobCcNum && reqBody.emID && reqBody.oStatus && reqBody.houseNum && reqBody.area && reqBody.zip && reqBody.district && reqBody.state) {
    return true
  } else {
    return false
  }
}