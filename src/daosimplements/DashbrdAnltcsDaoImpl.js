/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Dec 2025
 */

var { v4: uuidv4 } = require('uuid');

const moment = require('moment');
const CommonSrvc = require('../services/CommonSrvc');

const bkgStsFilds = {
  Confirmed: ["cnfrmdBCount", "cnfrmdPCount"], Waiting: ["wtngBCount", "wtngPCount"],
  Completed: ["clsdBCount", "clsdPCount"], Cancelled: ["cncldBCount", "cncldPCount"], "No Show": ["nsBCount", "nsPCount"]
};
const pdSflds = {
  Confirmed: ["cnfrmdPdCount", "cnfrmdPdPCount"], Closed: ["clsdPdCount", "clsdPdPCount"],
  Cancelled: ["cncldPdCount", "cncldPdPCount"]
};
const frnchStsFilds = { Requested: "frqCount", 'In Review': "firCount", Approved: "fapCount", Rejected: "frjCount" };

const gsiFldMap = {
  oExpVal: 'avgOExp', cleanVal: 'avgClean', cmfrtVal: 'avgCmfrt', bExpVal: 'avgBExp', bvrgsVal: 'avgBvrgs', buffetVal: 'avgBuffet', strsVal: 'avgStrs',
  dsrtsVal: 'avgDsrts', lveCntrVal: 'avgLCntr', atntvVal: 'avgAtntv', crtsVal: 'avgCrts', bilExpVal: 'avgBilExp'
};

const getUpdOpts = () => ({ upsert: true, new: true, setDefaultsOnInsert: true });

const getListQry = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.orgId ? { orgId: reqBody.orgId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entityId?.length ? { entId: { $in: reqBody.entityId } } : {});
  const branch = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch?.length ? { branch: { $in: reqBody.branch } } : {});
  const slot = reqBody.slot ? { slot: reqBody.slot } : {};

  let dateFilter = TbByDateType(reqBody);
  const rDtStr = { $gte: dateFilter?.startDate, $lte: dateFilter?.endDate };
  const qry = { delFlag: false, ...orgObj, ...entObj, ...branch, rDtStr, ...slot };
  let dateFilter1 =  TbByDateType();
  const dlyQry = { delFlag: false, ...orgObj, ...entObj, ...branch, rDtStr: {$gte: dateFilter1?.startDate, $lte: dateFilter1?.endDate}, ...slot };
  return { qry, dlyQry };
};

const getAnalyticsByRange = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.orgId ? { orgId: reqBody.orgId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entityId?.length ? { entId: { $in: reqBody.entityId } } : {});
  const branch = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch?.length ? { branch: { $in: reqBody.branch } } : {});
  let dateFilter = reqBody.dateType == 'Monthly' ? TbByDateType(reqBody) : {};
  const rDtStr = (dateFilter?.startDate || dateFilter?.endDate) ? { rDtStr: { $gte: dateFilter.startDate, $lte: dateFilter.endDate } } : {};
  const slot = reqBody.slot ? { slot: reqBody.slot } : {};
  const matchQuery = { ...orgObj, ...entObj, ...branch, delFlag: false, ...rDtStr, ...slot };
  const sumFields = [
    "tBkngs", "tPaxB", "cnfrmdBCount", "cnfrmdPCount", "wtngBCount", "wtngPCount", "stdBCount", "stdPCount",
    "clsdBCount", "clsdPCount", "cncldBCount", "cncldPCount",
    "nsBCount", "nsPCount", "vpBCount", "nvpBCount", "kidsBCount", "infantsBCount",

    "pdtBkngs", "tPaxPd", "cnfrmdPdCount", "cnfrmdPdPCount", "clsdPdCount", "clsdPdPCount", "cncldPdCount", "cncldPdPCount",
    "vpPdCount", "nvpPdCount", "kidsPdCount", "infantsPdCount",

    "tfbCount", "frqCount", "firCount", "fapCount",  "frjCount", "gsiTCount"
  ];

  const firstFields = [ "oName", "eName", "entId", "branch", "bName", "slot", "ratings", "rDtStr"];

  const defaultZeroFields = [
    "avgFdRtg", "avgSrvcRtg", "avgAmbncRtg", "avgOvrlRtg", "frTCount", "avgOExp", "avgClean", "avgCmfrt", "avgBExp",
     "avgBvrgs", "avgBuffet", "avgStrs", "avgDsrts", "avgLCntr","avgAtntv", "avgCrts", "avgBilExp"
  ];

  const groupStage = { _id: "$rDtStr" };
  sumFields.forEach(f => { groupStage[f] = { $sum: `$${f}` };});
  firstFields.forEach(f => {groupStage[f] = { $first: `$${f}` };});
  defaultZeroFields.forEach(f => { groupStage[f] = { $first: { $ifNull: [`$${f}`, 0] } } });

  const projectStage = { $project: {_id: 1,
      ...Object.fromEntries([...sumFields, ...firstFields, ...defaultZeroFields].map(f => [f, 1]))
    }};
  return [{ $match: matchQuery }, { $group: groupStage }, projectStage ];
};

const getViewQry = (_id) => { return { delFlag: false, _id } };

const getQry = (data, dType) => {
  const { orgId, entId, slot } = data;
  const branch = data.branch || 'NA';
  const rDtStr = dType == 'day' ? moment(data.rDtStr).format('YYYY-MM-DD') : dType == 'month' ? moment(data.rDtStr).format('YYYY-MM') : moment(data.rDtStr).format('YYYY');
  const query = { orgId, entId, branch, rDtStr, slot };
  return query;
};

const getComUpdFlds = (tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  return {
    uuType: tData.ut,
    uUser: tData.iss,
    uuName: tData.un,
    uDtTm: currentUTC.currUTCDtTm,
    uDtStr: currentUTC.currUTCDtTmStr,
  };
};

const getComCrtFlds = (data, tData) => {
  const currentUTC = CommonSrvc.currUTCObj();
  const orgId = tData.ut === 'VRU' ? data.orgId : tData.oid;
  const oCode = tData.ut === 'VRU' ? data.oCode : tData.oc;
  const oName = tData.ut === 'VRU' ? data.oName : tData.on; 
  return {
    _id: uuidv4(),
    orgId, oCode, oName,
    entId: data.entId,
    eName: data.eName,
    eCode: data.eCode,
    branch: data.branch || 'NA',
    bCode: data.bCode || 'NA',
    bName: data.bName || 'NA',
    cuType: tData.ut,
    cUser: tData.iss,
    cuName: tData.un,
    cDtTm: currentUTC.currUTCDtTm,
    cDtStr: currentUTC.currUTCDtTmStr,
  };
};

const getBkgCrtUpdObj = (bData, tData, oldData, dType, type) => {
  return setBkgCrtUpdObj(bData, tData, oldData, dType, type);
};

const getBkgStsChgUpdObj = (bData, tData, oldbData) => {
  return setBkgStsChgUpdObj(bData, tData, oldbData);
};

const getBkgDtChgUpdObj = (bData, tData, dType, inc) => {
  return setBkgDtChgUpdObj(bData, tData, dType, inc)
};

const getPrvtDngCrtUpdObj = (bData, tData, oldData, dType, type) => {
  return setPrvtDngCrtUpdObj(bData, tData, oldData, dType, type);
};

const getPrvtDngStsChgUpdObj = (bData, tData, oldbData) => {
  return setPrvtDngStsChgUpdObj(bData, tData, oldbData);
};

const getPrvtDngDtChgUpdObj = (bData, tData, dType, inc) => {
  return setPrvDngDtChngUpdObj(bData, tData, dType, inc);
};

const getFdbkCrtUpdObj = (bData, tData, dType, oldData) => {
  return setFdbkCrtUpdObj(bData, tData, dType, oldData);
};

const getFrnchsUpdObj = (fData, tData, dType) => {
  return setFranchiseCrtUpdObj(fData, tData, dType);
}

const getFrnchsStsChgUpdObj = (newStatus, oldStatus, tData) => {
  return setFranchiseStsChgUpdObj(newStatus, oldStatus, tData);
}

const getGsiCrtUpdObj = (gData, tData, dType, type, oldData) => {
  return setGsiCrtUpdObj(gData, tData, dType, type, oldData);
}

const getGsiDtChgUpdObj = (gData, tData, dType, inc) => {
  return setGsiDtChgUpdObj(gData, tData, dType, inc);
}

module.exports = {
  getUpdOpts, getListQry, getQry, getAnalyticsByRange, getViewQry, getBkgCrtUpdObj, getBkgStsChgUpdObj,
  getPrvtDngCrtUpdObj, getPrvtDngStsChgUpdObj, getBkgDtChgUpdObj, getPrvtDngDtChgUpdObj,
  getFdbkCrtUpdObj, getGsiCrtUpdObj, getFrnchsUpdObj, getFrnchsStsChgUpdObj, getGsiDtChgUpdObj
};

const TbByDateType = (reqBody) => {
  if (reqBody?.dateType == 'Custom Dates') {
    const startDate = moment(reqBody.startDate).format('YYYY-MM-DD');
    const endDate = moment(reqBody.endDate).format('YYYY-MM-DD')
    return { startDate, endDate }
  } else if (reqBody?.dateType == 'Monthly') {
    const startDate = moment().startOf('year').format('YYYY-MM');
    const endDate = moment().endOf('year').format('YYYY-MM');
    return { startDate, endDate }
  } else if (reqBody?.dateType == 'Yearly') {
    return { startDate: '', endDate: '' }
  } else {
    const startDate = moment().startOf('month').format('YYYY-MM-DD');
    const endDate = moment().endOf('month').format('YYYY-MM-DD');
    return { startDate, endDate }
  }
}

const setBkgCrtUpdObj = (bData, tData, oldData = {}, dType, type) => {
  oldData = oldData || {};
  const rDate = formatRDate(bData.bDt, dType);
  const updateFields = {
    rDate,
    rDtStr: rDate,
    slot: bData.rFor,
    ...getComUpdFlds(tData)
  };
  const oldPax = sumPax(oldData); const newPax = sumPax(bData);
  const paxDiff = newPax - oldPax;
  const incFlds = {
    vpBCount: diff(bData.vegCount, oldData?.vegCount),
    nvpBCount: diff(bData.nonVegCount, oldData?.nonVegCount),
    kidsBCount: diff(bData.kidsCount, oldData?.kidsCount),
    infantsBCount: diff(bData.infantsCount, oldData?.infantsCount),
    tPaxB: paxDiff
  };
  if (type === "create") {
    incFlds.tBkngs = 1;
    const [bFld, pFld] = bkgStsFilds[bData.bStatus] || [];
    if (bFld) {
      incFlds[bFld] = 1;
      incFlds[pFld] = newPax;
    }
    return { obj: { $set: updateFields, $inc: incFlds, $setOnInsert: { ...getComCrtFlds(bData, tData) } } };
  }
  const oldStatus = oldData?.bStatus;
  const newStatus = bData.bStatus;
  if (oldStatus == newStatus) {
    const [, paxFld] = bkgStsFilds[newStatus] || [];
    if (paxFld) incFlds[paxFld] = paxDiff;
  }
  return { obj: { $set: updateFields, $inc: incFlds } };
};

const formatRDate = (date, type) => {
  if (type === "day") return moment(date).format("YYYY-MM-DD");
  if (type === "month") return moment(date).format("YYYY-MM");
  return moment(date).format("YYYY");
}
const sumPax = (data = {}) => {
  return (data?.vegCount || 0) + (data?.nonVegCount || 0) + (data?.kidsCount || 0) + (data?.infantsCount || 0);
}
const diff = (newVal = 0, oldVal = 0) => { return (newVal || 0) - (oldVal || 0); }

const setBkgStsChgUpdObj = (newbData, tData, oldbData) => {
  const cmnUpdtFlds = getComUpdFlds(tData);
  const obj = { $inc: {}, $set: { ...cmnUpdtFlds, slot: newbData.rFor } };
  const pax = (oldbData.vegCount || 0) + (oldbData.nonVegCount || 0) + (oldbData.kidsCount || 0) + (oldbData.infantsCount || 0);
  switch (oldbData.bStatus) {
    case 'Confirmed':
      obj.$inc.cnfrmdBCount = (obj.$inc.cnfrmdBCount || 0) - 1;
      obj.$inc.cnfrmdPCount = (obj.$inc.cnfrmdPCount || 0) - pax;
      break;
    case 'Waiting':
      obj.$inc.wtngBCount = (obj.$inc.wtngBCount || 0) - 1;
      obj.$inc.wtngPCount = (obj.$inc.wtngPCount || 0) - pax;
      break;
    case 'Completed':
      obj.$inc.clsdBCount = (obj.$inc.clsdBCount || 0) - 1;
      obj.$inc.clsdPCount = (obj.$inc.clsdPCount || 0) - pax;
      break;
    case 'Cancelled':
      obj.$inc.cncldBCount = (obj.$inc.cncldBCount || 0) - 1;
      obj.$inc.cncldPCount = (obj.$inc.cncldPCount || 0) - pax;
      break;
    case 'No Show':
      obj.$inc.nsBCount = (obj.$inc.nsBCount || 0) - 1;
      obj.$inc.nsPCount = (obj.$inc.nsPCount || 0) - pax;
      break;
  }
  switch (newbData.bStatus) {
    case 'Confirmed':
      obj.$inc.cnfrmdBCount = (obj.$inc.cnfrmdBCount || 0) + 1;
      obj.$inc.cnfrmdPCount = (obj.$inc.cnfrmdPCount || 0) + pax;
      break;
    case 'Waiting':
      obj.$inc.wtngBCount = (obj.$inc.wtngBCount || 0) + 1;
      obj.$inc.wtngPCount = (obj.$inc.wtngPCount || 0) + pax;
      break;
    case 'Completed':
      obj.$inc.clsdBCount = (obj.$inc.clsdBCount || 0) + 1;
      obj.$inc.clsdPCount = (obj.$inc.clsdPCount || 0) + pax;
      break;
    case 'Cancelled':
      obj.$inc.cncldBCount = (obj.$inc.cncldBCount || 0) + 1;
      obj.$inc.cncldPCount = (obj.$inc.cncldPCount || 0) + pax;
      break;
    case 'No Show':
      obj.$inc.nsBCount = (obj.$inc.nsBCount || 0) + 1;
      obj.$inc.nsPCount = (obj.$inc.nsPCount || 0) + pax;
      break;
  }
  return { obj };
};

const setBkgDtChgUpdObj = (bData, tData, dType, inc) => {
  const cmnUpdtFlds = getComUpdFlds(tData);
  const pax = sumPax(bData);
  const obj = { $set: { ...cmnUpdtFlds, slot: bData.slot }, $inc: {} };
  const fields = {
    vpBCount: bData.vegCount || 0,
    nvpBCount: bData.nonVegCount || 0,
    kidsBCount: bData.kidsCount || 0,
    infantsBCount: bData.infantsCount || 0,
    tPaxB: pax,
    tBkngs: 1
  };
  const [bFld, pFld] = bkgStsFilds[bData.bStatus] || [];
  if (bFld) {
    fields[bFld] = 1;
    fields[pFld] = pax;
  }
  for (const key in fields) {
    obj.$inc[key] = (inc * fields[key]);
  }
  const rDate = formatRDate(bData.rDtStr, dType);
  obj.$set.rDate = rDate;
  obj.$set.rDtStr = rDate;
  if (inc > 0) {
    obj.$setOnInsert = { ...getComCrtFlds(bData, tData) };
  }
  return { obj };
}
const setPrvtDngCrtUpdObj = (bData, tData, oldData = {}, dType, type) => {
  oldData = oldData || {};
  const rDate = formatRDate(bData.bDt, dType);
  const updateFields = { rDate, rDtStr: rDate, slot: bData.bookingFor, ...getComUpdFlds(tData) };
  const oldPax = sumPax(oldData);
  const newPax = sumPax(bData);
  const paxDiff = newPax - oldPax;
  const incFlds = {
    vpPdCount: diff(bData.vegCount, oldData?.vegCount),
    nvpPdCount: diff(bData.nonVegCount, oldData?.nonVegCount),
    kidsPdCount: diff(bData.kidsCount, oldData?.kidsCount),
    infantsPdCount: diff(bData.infantsCount, oldData?.infantsCount),
    tPaxPd: paxDiff
  };
  if (type === "create") {
    incFlds.pdtBkngs = 1;
    const [bFld, pFld] = pdSflds[bData.bStatus] || [];
    if (bFld) {
      incFlds[bFld] = 1;
      incFlds[pFld] = newPax;
    }
    return { obj: { $set: updateFields, $inc: incFlds, $setOnInsert: { ...getComCrtFlds(bData, tData) } } };
  }
  const oldStatus = oldData?.bStatus;
  const newStatus = bData.bStatus;
  if (oldStatus == newStatus) {
    const [, paxFld] = pdSflds[newStatus] || [];
    if (paxFld) incFlds[paxFld] = (incFlds[paxFld] || 0) + paxDiff;
  }
  return { obj: { $set: updateFields, $inc: incFlds } };
};

const setPrvtDngStsChgUpdObj = (newbData, tData, oldbData) => {
  const cmnUpdtFlds = getComUpdFlds(tData);
  const obj = { $inc: {}, $set: { ...cmnUpdtFlds, slot: newbData.bookingFor } };
  const pax = (oldbData.vegCount || 0) + (oldbData.nonVegCount || 0) + (oldbData.kidsCount || 0) + (oldbData.infantsCount || 0);
  switch (oldbData.bStatus) {
    case 'Confirmed':
      obj.$inc.cnfrmdPdCount = (obj.$inc.cnfrmdPdCount || 0) - 1;
      obj.$inc.cnfrmdPdPCount = (obj.$inc.cnfrmdPdPCount || 0) - pax;
      break;
    case 'Closed':
      obj.$inc.clsdPdCount = (obj.$inc.clsdPdCount || 0) - 1;
      obj.$inc.clsdPdPCount = (obj.$inc.clsdPdPCount || 0) - pax;
      break;
    case 'Cancelled':
      obj.$inc.cncldPdCount = (obj.$inc.cncldPdCount || 0) - 1;
      obj.$inc.cncldPdPCount = (obj.$inc.cncldPdPCount || 0) - pax;
      break;
  }
  switch (newbData.bStatus) {
    case 'Confirmed':
      obj.$inc.cnfrmdPdCount = (obj.$inc.cnfrmdPdCount || 0) + 1;
      obj.$inc.cnfrmdPdPCount = (obj.$inc.cnfrmdPdPCount || 0) + pax;
      break;
    case 'Closed':
      obj.$inc.clsdPdCount = (obj.$inc.clsdPdCount || 0) + 1;
      obj.$inc.clsdPdPCount = (obj.$inc.clsdPdPCount || 0) + pax;
      break;
    case 'Cancelled':
      obj.$inc.cncldPdCount = (obj.$inc.cncldPdCount || 0) + 1;
      obj.$inc.cncldPdPCount = (obj.$inc.cncldPdPCount || 0) + pax;
      break;
  }
  return { obj };
};

const setPrvDngDtChngUpdObj = (bData, tData, dType, inc) => {
  const cmnUpdtFlds = getComUpdFlds(tData);
  const pax = sumPax(bData);
  const obj = { $set: { ...cmnUpdtFlds, slot: bData.slot }, $inc: {} };
  const fields = {
    vpPdCount: bData.vegCount || 0,
    nvpPdCount: bData.nonVegCount || 0,
    kidsPdCount: bData.kidsCount || 0,
    infantsPdCount: bData.infantsCount || 0,
    tPaxPd: pax,
    pdtBkngs: 1
  };
  const [bFld, pFld] = pdSflds[bData.bStatus] || [];
  if (bFld) {
    fields[bFld] = 1;
    fields[pFld] = pax;
  }
  for (const key in fields) {
    obj.$inc[key] = (inc * fields[key]);
  }
  const rDate = formatRDate(bData.rDtStr, dType);
  obj.$set.rDate = rDate;
  obj.$set.rDtStr = rDate;
  if (inc > 0) {
    obj.$setOnInsert = { ...getComCrtFlds(bData, tData) };
  }
  return { obj };
}

const setFdbkCrtUpdObj = (fData, tData, dType, oldData = null) => {
  const rDate = formatRDate(fData.cDtStr, dType);
  const updateFields = { ...getComUpdFlds(tData) };
  const incFlds = { tfbCount: 1 };
  let rtgs;
  if (oldData && oldData?.ratings?.length) {
    rtgs = JSON.parse(JSON.stringify(oldData.ratings));
  } else {
    rtgs = [
      { _id: "Food", s1: 0, s2: 0, s3: 0, s4: 0, s5: 0 },
      { _id: "Service", s1: 0, s2: 0, s3: 0, s4: 0, s5: 0 },
      { _id: "Ambience", s1: 0, s2: 0, s3: 0, s4: 0, s5: 0 },
      { _id: "Overall", s1: 0, s2: 0, s3: 0, s4: 0, s5: 0 }
    ];
  }
  const updateRating = (type, ratingValue) => {
    if (ratingValue) {
      const ratingToUpdate = rtgs.find(r => r._id === type);
      if (ratingToUpdate) {
        ratingToUpdate[`s${ratingValue}`] += 1;
      }
    }
  };
  updateRating("Food", fData.fRating);
  updateRating("Service", fData.sRating);
  updateRating("Ambience", fData.aRating);
  updateRating("Overall", fData.rating);
  updateFields.ratings = rtgs;
  const oldTfbCount = oldData?.tfbCount || 0;
  if (fData.fRating) {
    const oldAvg = oldData?.avgFdRtg || 0;
    updateFields.avgFdRtg = Math.round(((oldAvg * oldTfbCount) + fData.fRating) / (oldTfbCount + 1));
  }
  if (fData.sRating) {
    const oldAvg = oldData?.avgSrvcRtg || 0;
    updateFields.avgSrvcRtg = Math.round(((oldAvg * oldTfbCount) + fData.sRating) / (oldTfbCount + 1));
  }
  if (fData.aRating) {
    const oldAvg = oldData?.avgAmbncRtg || 0;
    updateFields.avgAmbncRtg = Math.round(((oldAvg * oldTfbCount) + fData.aRating) / (oldTfbCount + 1));
  }
  if (fData.rating) {
    const oldAvg = oldData?.avgOvrlRtg || 0;
    updateFields.avgOvrlRtg = Math.round(((oldAvg * oldTfbCount) + fData.rating) / (oldTfbCount + 1));
  }
  const setOnInsertFields = { ...getComCrtFlds(fData, tData), rDate, rDtStr: rDate, slot: fData.slot };
  return { obj: { $set: updateFields, $inc: incFlds, $setOnInsert: setOnInsertFields } };
};

const setGsiCrtUpdObj = (gData, tData, dType, type, oldData = {}) => {
  oldData = oldData || {};
  const rDate = formatRDate(gData.rDtStr, dType);
  const updateFields = { ...getComUpdFlds(tData), gsiSlot: gData.dineSlot, captain: gData.captain };
  const incFlds = {};
  if (type === "create") {
    incFlds.gsiTCount = 1;
    const oldGsiTCount = oldData?.gsiTCount || 0;
    for (const key in gsiFldMap) {
      if (typeof gData[key] === 'number') {
        const avgField = gsiFldMap[key];
        const oldAvg = oldData[avgField] || 0;
        updateFields[avgField] = Math.round(((oldAvg * oldGsiTCount) + gData[key]) / (oldGsiTCount + 1));
      }
    }
    const setOnInsertFields = { ...getComCrtFlds(gData, tData), rDate, rDtStr: rDate, slot: gData.slot };
    return { obj: { $set: updateFields, $inc: incFlds, $setOnInsert: setOnInsertFields } };
  }
  for (const key in gsiFldMap) {
    incFlds[gsiFldMap[key]] = diff(gData[key], oldData[key]);
  }
  return { obj: { $set: updateFields, $inc: incFlds } };
};

const setGsiDtChgUpdObj = (gData, tData, dType, inc) => {
  const cmnUpdtFlds = getComUpdFlds(tData);
  const obj = { $set: { ...cmnUpdtFlds, slot: gData.slot, gsiSlot: gData.dineSlot }, $inc: {} };
  const fields = { gsiTCount: 1 };
  for (const key in gsiFldMap) {
    fields[gsiFldMap[key]] = gData[key] || 0;
  }
  for (const key in fields) {
    obj.$inc[key] = (inc * fields[key]);
  }
  const rDate = formatRDate(gData.rDtStr, dType);
  obj.$set.rDate = rDate;
  obj.$set.rDtStr = rDate;
  if (inc > 0) {
    obj.$setOnInsert = { ...getComCrtFlds(gData, tData) };
  }
  return { obj };
}

const setFranchiseCrtUpdObj = (fData, tData, dType) => {
  const rDate = formatRDate(fData.cDtStr, dType);
  const setOnInsertFields = { ...getComCrtFlds(fData, tData), rDate, rDtStr: rDate, slot: 'Lunch' };
  const updateFields = { ...getComUpdFlds(tData) };
  const incFlds = { frTCount: 1 };
  const statusField = frnchStsFilds[fData.fStatus];
  if (statusField) incFlds[statusField] = 1;
  return { obj: { $set: updateFields, $inc: incFlds, $setOnInsert: setOnInsertFields } };
};

const setFranchiseStsChgUpdObj = (newStatus, oldStatus, tData) => {
  const updateFields = { ...getComUpdFlds(tData) };
  const incFlds = {};
  const oldStatusField = frnchStsFilds[oldStatus];
  incFlds[oldStatusField] = -1;
  const newStatusField = frnchStsFilds[newStatus];
  incFlds[newStatusField] = 1;
  return { obj: { $set: updateFields, $inc: incFlds } };
};