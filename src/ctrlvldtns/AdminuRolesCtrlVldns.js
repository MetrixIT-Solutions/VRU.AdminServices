/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const sRes = require('../SetRes');

const postAdminRolesListVldn = (req) => {
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

const postAdminRolesCrtVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else {
    const data = adminValidData(reqBody);
    if (!data) {
      const res = sRes.msdReqFields();
      return { flag: false, result: res };
    } else {
      return { flag: true };
    }
  }
}

const postAdminRolesViewVldn = (req) => {
  if (!req.headers.vruadatoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.params.id) {
    const ad = sRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const postAdminRolesEditVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else {
    const data = adminEditValidData(reqBody);
    if (!data || !req.params.id) {
      const res = sRes.msdReqFields();
      return { flag: false, result: res };
    } else {
      return { flag: true };
    }
  }
}

const postAdminUsrRlsStatusUpdateVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.vruadatoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.params.id || !reqBody.roleStatus) {
    const ad = sRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const adminUsrRlsDelete = (req) => {
  if (!req.headers.vruadatoken) {
    const te = sRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.params.id) {
    const ad = sRes.msdReqFields();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

module.exports = {
  postAdminRolesListVldn, postAdminRolesCrtVldn, postAdminRolesViewVldn, postAdminRolesEditVldn, postAdminUsrRlsStatusUpdateVldn,
  adminUsrRlsDelete
};

const adminValidData = (reqBody) => {
  if (reqBody.roleName && reqBody.roleCode && reqBody.roleSeq && reqBody.roleStatus) {
    return true;
  } else {
    return false;
  }
}

const adminEditValidData = (reqBody) => {
  if (reqBody.roleName && reqBody.roleCode && reqBody.roleSeq) {
    return true;
  } else {
    return false;
  }
}