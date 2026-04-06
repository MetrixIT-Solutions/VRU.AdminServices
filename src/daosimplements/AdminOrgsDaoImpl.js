/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');
const config = require('config');

const CommonSrvc = require('../services/CommonSrvc');
const AdminOrgs = require('../schemas/AdminOrgs');
const AdOrgsOnBoardings = require('../schemas/AdminOrgsOnBoardings');
const AdOrgsOnBoardingsLcs = require('../schemas/AdminOrgsOnBoardingsLcs');

const orgCreateData = (body, files, tData) => {
  const data = { oIcon: null, oiActualName: null, oiPath: null, oFIcon: null, oFiActualName: null, oFiPath: null};
  const fileD = setImageData(files, data);
  const orgData = setOrgData(body, fileD, tData);
  const ooBoarding = setOrgsOnBoarding(body, orgData);
  const ooBoardingLc = setOrgsOnBoardingLc(ooBoarding);

  const org = new AdminOrgs(orgData);
  const oob = new AdOrgsOnBoardings(ooBoarding);
  const oobLc = new AdOrgsOnBoardingsLcs(ooBoardingLc);
  return { org, oob, oobLc };
}

const orgsList = (reqBody) => {
  const searchStr = reqBody.searchStr || '';
  const orgId = {_id: {$ne: config.vruId }}
  return {
    delFlag: false, ...orgId, $or: [
      { 'oName': { $regex: searchStr, $options: 'i' } },
      { 'oCode': { $regex: searchStr, $options: 'i' } },
      { 'mobCcNum': { $regex: searchStr, $options: 'i' } },
      { 'emID': { $regex: searchStr, $options: 'i' } },
      { 'district': { $regex: searchStr, $options: 'i' } },
      { 'oPlan': { $regex: searchStr, $options: 'i' } },
      { 'obType': { $regex: searchStr, $options: 'i' } },

    ]
  };
}

const orgView = (_id) => {
  return { delFlag: false, _id }
}

const orgStatusUpdate = (reqBody, tData) => {
  const curUtc = CommonSrvc.currUTCObj();
  return {
    oStatus: reqBody.status,
    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
    uDtNum: curUtc.currUTCDtTmNum
  }
}

const orgUpdate = (reqBody, filePaths, tData) => {
  const data = { oIcon: reqBody.icon, oiActualName: reqBody.iActualName, oiPath: reqBody.iPath, oFIcon: reqBody.ficon, oFiActualName: reqBody.fiActualName, oFiPath: reqBody.fiPath};
  const fileD = setImageData(filePaths, data);
  return setOrgUpdateData(reqBody, fileD, tData);
}

const orgsTotalList = (reqBody) => {
  const searchStr = reqBody.searchStr || '';
  const orgId = reqBody.vruId ?  {} : {_id: {$ne: config.vruId }}
  return {
    delFlag: false, ...orgId, oStatus: 'Active', $or: [
      { 'oName': { $regex: searchStr, $options: 'i' } },
      { 'oCode': { $regex: searchStr, $options: 'i' } }
    ]
  };
}

const getOrganistionId = (data, reqBody, tData, key) => {
  const currentDt = CommonSrvc.currUTCObj();
  const query = { delFlag: false, _id: data.orgId };
  const updateObj = key == 'create' ? {
    $inc : { eCount: 1 },
    $set: {
      uuType: tData.ur,
      uUser: tData.iss,
      uuName: tData.un,
      uDtTm: currentDt.currUTCDtTm,
      uDtStr: currentDt.currUTCDtTmStr,
      uDtNum: currentDt.currUTCDtTmNum
    },
    $push: {
      eNames: reqBody.eName
    }
  } : key == 'update' ? {
    $set: {
      uuType: tData.ur,
      uUser: tData.iss,
      uuName: tData.un,
      uDtTm: currentDt.currUTCDtTm,
      uDtStr: currentDt.currUTCDtTmStr,
      uDtNum: currentDt.currUTCDtTmNum
    },
    $push: { eNames: reqBody.eName },
  } : {
    $set: {
      uuType: tData.ur,
      uUser: tData.iss,
      uuName: tData.un,
      uDtTm: currentDt.currUTCDtTm,
      uDtStr: currentDt.currUTCDtTmStr,
      uDtNum: currentDt.currUTCDtTmNum
    },
    $pull: { eNames: reqBody.oldEName }
  }
  return { query, updateObj };
}

const orgSubPlanUpdate = (reqBody, tData) => {
  const curUtc = CommonSrvc.currUTCObj();
  const smsObj = (reqBody?.oldOsmsPrice || reqBody?.osmsPrice) ? { osmsPrice: reqBody?.osmsPrice || 0 } : {};
  const emailObj = ((reqBody?.oldOEmPrice && reqBody?.oldOEmMinPrice) || (reqBody?.oEmPrice && reqBody?.oEmMinPrice)) ? {
    oEmLimit: reqBody.oEmLimit || 100,
    oEmPrice: reqBody?.oEmPrice || 0,
    oEmMinPrice: reqBody?.oEmMinPrice || 0,
  } : {};
  return {
    oPlan: reqBody.oPlan,
    oeLimit: reqBody.oeLimit,
    oebLimit: reqBody.oebLimit,
    oauLimit: reqBody.oauLimit,
    oeuLimit: reqBody.oeuLimit,
    ...smsObj, ...emailObj,

    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
    uDtNum: curUtc.currUTCDtTmNum
  };
};

module.exports = {
  orgCreateData, orgsList, orgView, orgStatusUpdate, orgUpdate, orgsTotalList, getOrganistionId, orgSubPlanUpdate
}

const setImageData = (files = {}, data = {}) => {
  if (files.icon?.length) {
    const icon = files.icon[0];
    data.oIcon = icon.icon;
    data.oiActualName = icon.originalname;
    data.oiPath = icon.path;
  }
  if (files.favicon?.length) {
    const favicon = files.favicon[0];
    data.oFIcon = favicon.icon;
    data.oFiActualName = favicon.originalname;
    data.oFiPath = favicon.path;
  }
  return data;
};

const setOrgsOnBoarding = (reqBody, orgData) => {
    const curUtc = CommonSrvc.currUTCObj();
  return {
    ...orgData,
    aprvdDtStr: curUtc.currUTCDtTmStr,
    oobStatus: reqBody.oobStatus,
    isActive: true,
    oobsMsg: reqBody.oobsMsg,
    oobsNotes: reqBody.oobsNotes || '',
  };
}
const setOrgsOnBoardingLc = (ooBoarding) => {
  return {
    ...ooBoarding,
    orgId: ooBoarding._id,
    _id: uuidv4()
  };
}
const setOrgData = (reqBody, files, tData) => {
  const curUtc = CommonSrvc.currUTCObj();
  const smsObj = reqBody?.osmsPrice ? {osmsPrice: reqBody.osmsPrice} : {};
  const emailObj = reqBody?.oEmPrice && reqBody?.oEmMinPrice ? {
    oEmLimit: reqBody.oEmLimit || 100,
    oEmPrice: reqBody.oEmPrice,
    oEmMinPrice: reqBody.oEmMinPrice,
  } : {};
  const idSeqObj = {
    idSeq: {
      seq: 'IND' + reqBody.stateCode + curUtc.currUTCYear + curUtc.currUTCMonth + curUtc.currUTCDay,
      countryCode: 'IND',
      stateCode: reqBody.stateCode,
      year: curUtc.currUTCYear,
      month: curUtc.currUTCMonth,
      day: curUtc.currUTCDay
    }
  }
  return {
    _id: uuidv4(),

    ...idSeqObj,
    oName: reqBody.oName,
    oCode: reqBody.oCode,
    cPerson: reqBody.cPerson,
    mobCc: reqBody.mobCc,
    mobNum: reqBody.mobNum,
    mobCcNum: reqBody.mobCcNum,
    emID: reqBody.emID,
    altMobCc: reqBody.altMobCc,
    altMobNum: reqBody.altMobNum,
    altMobCcNum: reqBody.altMobCcNum,
    altEmID: reqBody.altEmID,
    doi: reqBody.doi,
    gst: reqBody.gst,
    pan: reqBody.pan,
    cin: reqBody.cin || '',
    tan: reqBody.tan || '',

    about: reqBody.about || '',
    oPlan: reqBody.oPlan,
    oeLimit: reqBody.oeLimit,
    oebLimit: reqBody.oebLimit,
    oauLimit: reqBody.oauLimit,
    oeuLimit: reqBody.oeuLimit,
    oStatus: reqBody.oStatus,
    obType: reqBody.obType || 'Other',
    ...smsObj, ...emailObj,

    houseNum: reqBody.houseNum,
    area: reqBody.area,
    mandal: reqBody.mandal || '',
    zip: reqBody.zip,
    country: 'India',
    countryCode: 'IND',
    state: reqBody.state,
    stateCode: reqBody.stateCode,
    district: reqBody.district,
    geocoordinates: reqBody.geocoordinates || {},

    ...files,

    oStatus: reqBody.oStatus,

    cuType: tData.ut,
    cUser: tData.iss,
    cuName: tData.un,
    cDtTm: curUtc.currUTCDtTm,
    cDtStr: curUtc.currUTCDtTmStr,
    cDtNum: curUtc.currUTCDtTmNum,
    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
    uDtNum: curUtc.currUTCDtTmNum
  }
}

const setOrgUpdateData = (reqBody, fileData, tData) => {
  const curUtc = CommonSrvc.currUTCObj();

  return {
    oName: reqBody.oName,
    oCode: reqBody.oCode,
    cPerson: reqBody.cPerson,
    mobCc: reqBody.mobCc,
    mobNum: reqBody.mobNum,
    mobCcNum: reqBody.mobCcNum,
    emID: reqBody.emID,
    altMobCc: reqBody.altMobCc,
    altMobNum: reqBody.altMobNum,
    altMobCcNum: reqBody.altMobCcNum,
    altEmID: reqBody.altEmID,
    doi: reqBody.doi,
    gst: reqBody.gst,
    pan: reqBody.pan,
    obType: reqBody.obType || 'Other',

    houseNum: reqBody.houseNum,
    area: reqBody.area,
    zip: reqBody.zip,
    state: reqBody.state,
    stateCode: reqBody.stateCode,
    district: reqBody.district,
    geocoordinates: reqBody.geocoordinates || {},

    oStatus: reqBody.oStatus,
    about: reqBody.about || '',
    ...fileData,

    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
    uDtNum: curUtc.currUTCDtTmNum
  }
}