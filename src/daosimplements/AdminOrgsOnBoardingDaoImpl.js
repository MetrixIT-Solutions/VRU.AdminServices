/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');
const CommonSrvc = require('../services/CommonSrvc');

const uObj = { ut: 'VRU', un: 'Superadmin', iss: 'VRUAUID10001'}

const adminOrgsOnbrdngsList = (reqBody) => {
  const searchStr = reqBody.searchStr || '';
  const status = reqBody.status ? {oobStatus : reqBody.status} : {};
  return {
    delFlag: false,
    ...status,
    $or: [
      { oName: { $regex: searchStr, $options: 'i' } },
      { oCode: { $regex: searchStr, $options: 'i' } },
      { mobCcNum: { $regex: searchStr, $options: 'i' } },
      { emID: { $regex: searchStr, $options: 'i' } },
      { oPlan: { $regex: searchStr, $options: 'i' } },
      { cPerson: { $regex: searchStr, $options: 'i' } },
      { district: { $regex: searchStr, $options: 'i' } },
      { obType: { $regex: searchStr, $options: 'i' } },

    ]
  };
};

const adOrgOnbrdngVldtQry = (reqBody) => ({ [reqBody.vType]: reqBody.vName });
const crtOnbrdngData = (reqBody) => {
  return setOnBrdngCreate(reqBody)
};

const getAdminOrgOnBrdngView = (_id) => {
  return { _id, delFlag: false, };
};

const getAdminOrgOnBoardingViewByCode = (oCode) => {
  return { oCode, delFlag: false };
};

const adminOrgOnBrdngStatusUpdate = (reqBody, tData) => {
  const curUtc = CommonSrvc.currUTCObj();
  const aprvdDtmObj = reqBody.aprvdDtStr ? {aprvdDtStr: reqBody.aprvdDtStr } : {};
  const rjctdDtmObj = reqBody.rjctdDtStr ? {rjctdDtStr: reqBody.rjctdDtStr } : {};
  return {
    oobStatus: reqBody.status,
    oobsMsg: reqBody.msg || '',
    oobsNotes: reqBody.notes || '',
    ...aprvdDtmObj,
    ...rjctdDtmObj,
    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  };
};

const adminOrgOnBoardingUpdate = (reqBody, tData) => {
    return updateOnBrdngData(reqBody, tData);
};

const adminOrgOnBoardingsTotalList = (reqBody) => {
  const searchStr = reqBody.searchStr || '';
  return {
    delFlag: false,
    oobStatus: 'Approved',
    $or: [
      { oName: { $regex: searchStr, $options: 'i' } },
      { oCode: { $regex: searchStr, $options: 'i' } }
    ]
  };
};

const setUserData = (data) => {
  return setUserObj(data)
}

const activateAdminOrgOnBrdng = (reqBody, tData) => {
const curUtc = CommonSrvc.currUTCObj();
  return {
    isActive: reqBody.isActive,

    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  };
}

const setRolesData = (resData, role, count) => {
  const curUtc = CommonSrvc.currUTCObj();
  return {
    orgId: resData._id,
    oCode: resData.oCode,
    oName: resData.oName,
    rType: role.roleType,
    rName: role.roleName,
    rCode: role.roleCode,
    rSeq: role.sequence,
    rStatus: 'Active',
    delFlag: false,
    cuType: resData.cuType,
    cUser: resData.cUser,
    cuName: resData.cuName,
    cDtTm: curUtc.currUTCDtTm,
    cDtStr: curUtc.currUTCDtTmStr,
    uuType: resData.uuType,
    uUser: resData.uUser,
    uuName: resData.uuName,
    uDtTm: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  }
}

const onBrdngsLfcsListQry = (orgId) => {
    return { orgId, delFlag: false };
}

module.exports = {
  adOrgOnbrdngVldtQry, crtOnbrdngData, adminOrgsOnbrdngsList, getAdminOrgOnBrdngView, getAdminOrgOnBoardingViewByCode, adminOrgOnBrdngStatusUpdate,
  adminOrgOnBoardingUpdate, adminOrgOnBoardingsTotalList, setUserData, activateAdminOrgOnBrdng, setRolesData, onBrdngsLfcsListQry
};

const setOnBrdngCreate = (reqBody) => {
  const curUtc = CommonSrvc.currUTCObj();
  return {
    _id: uuidv4(),
    idSeq: {
      seq: 'IND' + reqBody.stateCode + curUtc.currUTCYear + curUtc.currUTCMonth + curUtc.currUTCDay,
      countryCode: 'IND',
      stateCode: reqBody.stateCode,
      year: curUtc.currUTCYear,
      month: curUtc.currUTCMonth,
      day: curUtc.currUTCDay
    },

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

    houseNum: reqBody.houseNum,
    area: reqBody.area,
    zip: reqBody.zip,
    country: 'India',
    countryCode: 'IND',
    state: reqBody.state,
    stateCode: reqBody.stateCode,
    district: reqBody.district,
    // mandal: reqBody.mandal || '',
    geocoordinates: reqBody?.geocoordinates || {},
    about: reqBody.about || '',

    oPlan: reqBody.oPlan,
    oeLimit: reqBody.oeLimit || 1,
    oebLimit: reqBody.oebLimit || 1,
    oauLimit: reqBody.oauLimit || 1,
    oeuLimit: reqBody.oeuLimit || 2,
    // osmsPrice: reqBody.osmsPrice || 0.2,
    // oEmLimit: reqBody.oEmLimit || 100,
    // oEmPrice: reqBody.oEmPrice || 0.04,
    // oEmMinPrice: reqBody.oEmMinPrice || 5,
    oobStatus: reqBody.oobStatus,
    oobsMsg: reqBody.oobsMsg || '',
    oobsNotes: reqBody.oobsNotes || '',
    obType: reqBody.obType || 'Other',

    delFlag: false,
    cuType: uObj.ut,
    cUser: uObj.iss,
    cuName: uObj.un,
    cDtTm: curUtc.currUTCDtTm,
    cDtStr: curUtc.currUTCDtTmStr,
    uuType: uObj.ut,
    uUser: uObj.iss,
    uuName: uObj.un,
    uDtTm: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  };
}

const updateOnBrdngData = (reqBody, tData) => {
const curUtc = CommonSrvc.currUTCObj();
  return {
    oName: reqBody.oName,
    oCode: reqBody.oCode,

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

    houseNum: reqBody.houseNum,
    area: reqBody.area,
    zip: reqBody.zip,
    state: reqBody.state,
    stateCode: reqBody.stateCode,
    district: reqBody.district,
    mandal: reqBody.mandal || '',
    geocoordinates: reqBody.geocoordinates || {},

    about: reqBody.about || '',

    oPlan: reqBody.oPlan,
    oeLimit: reqBody.oeLimit,
    oebLimit: reqBody.oebLimit,
    oauLimit: reqBody.oauLimit,
    oeuLimit: reqBody.oeuLimit,
    osmsPrice: reqBody.osmsPrice,
    oEmLimit: reqBody.oEmLimit,
    oEmPrice: reqBody.oEmPrice,
    oEmMinPrice: reqBody.oEmMinPrice,
    oobStatus: reqBody.oobStatus,
    oobsMsg: reqBody.oobsMsg,
    oobsNotes: reqBody.oobsNotes,
    
    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  };
}

const setUserObj = (reqBody) => {
  const currentUTC = CommonSrvc.currUTCObj();

  return {
    _id: uuidv4(),
    idSeq: reqBody.idSeq,
    orgId: reqBody._id, 
    oCode: reqBody.oCode,  
    oName: reqBody.oName,
    oPlan: reqBody.oPlan,

    name: 'Admin',
    sName: 'Admin',
    mobCc: reqBody.mobCc,
    mobNum: reqBody.mobNum,
    mobCcNum: reqBody.mobCcNum,
    emID: reqBody.emID,
    refUID: reqBody.mobNum,
    myPrimary: reqBody.emID,
    mpType: 'Email',

    altMobCc: reqBody.altMobCc,
    altMobNum: reqBody.altMobNum,
    altMobCcNum: reqBody.altMobCcNum,
    altEmID: reqBody.altEmID,

    houseNum: reqBody.houseNum,
    area: reqBody.area,
    zip: reqBody.zip,
    country: reqBody.country,
    countryCode: reqBody.countryCode,
    state: reqBody.state,
    stateCode: reqBody.stateCode,
    district: reqBody.district,
    mandal: reqBody.mandal || '',

    uStatus: 'Active',
    uType: 'Board',
    uRole: 'Admin',
    urCode: 'BRDAD',
    urSeq: 201,

    cuType: reqBody.cuType,
    cUser: reqBody.cUser,
    cuName: reqBody.cuName,
    cDtTm: currentUTC.currUTCDtTmNum,
    cDtStr: currentUTC.currUTCDtTmStr,
    cDtNum: currentUTC.currUTCDtTmNum,
    uuType: reqBody.uuType,
    uUser: reqBody.uUser,
    uuName: reqBody.uuName,
    uDtTm: currentUTC.currUTCDtTmNum,
    uDtStr: currentUTC.currUTCDtTmStr,
    uDtNum: currentUTC.currUTCDtTmNum

  };
}