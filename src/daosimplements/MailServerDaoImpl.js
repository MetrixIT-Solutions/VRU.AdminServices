/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');

const CommonSrvc = require('../services/CommonSrvc');

const MailServerData = (reqData, tData) => {
  const data = setData(reqData, tData);
  return data;
}

const mailServerListQry = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.orgId ? { orgId: reqBody.orgId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entityId ? { entId: reqBody.entityId } : {});
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch ? { branch: reqBody.branch } : {});
  return {
    ...orgObj, ...entObj, ...branchObj, delFlag: false };
}

module.exports = {
  MailServerData, mailServerListQry
}

const setData = (reqData, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    _id: uuidv4(),
    orgId: reqData.orgId,
    oCode: reqData.oCode,
    oName: reqData.oName,
    entId: reqData.entId,
    eCode: reqData.eCode,
    eName: reqData.eName,

    fromMail: reqData.fromMail,
    fromMailPswd: reqData.fromMailPswd,
    mailServerHost: reqData.mailServerHost,
    mailServerPort: reqData.mailServerPort,
    senderAdrs: reqData.senderAdrs,

    cuType: tData.ut,
    cUser: tData.iss,
    cuName: tData.un,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum
  }
}
