/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');
var moment = require('moment');
var {rimraf} = require('rimraf');

'use strict';
var crypto = require('crypto');

const logger = require('../lib/logger');
// const { log } = require('winston');

/**
 * Begin genSalt: Code to Generate Salt.
 * @param {Number} length, length of salt.
 * @param {function} callback is a callback function.
 */
const genSalt = (length) => {
  try {
    return (crypto.randomBytes(Math.ceil(length/2))
      .toString('hex') // convert to hexadecimal format
      .slice(0, length)); // return required number of characters
  } catch(error) {
    logger.error('Un-Known Error in services/CommonSrvc.js, at genSalt:' + error);
    return config.mySalt;
  }
}
// --- End genSalt: Salt Generation Code.

/**
 * Begin encryptStr: String Encryption Code.
 * @param {String} gStr, Given String.
 * @param {String} salt to encryption.
 * @param {function} callback, is a callback function
 */
const encryptStr = (gStr, salt) => {
  try {
    var hash = crypto.createHmac('sha512', salt); // Hashing algorithm sha512
    hash.update(gStr);
    var strHash = hash.digest('hex');
    return {salt, strHash};
  } catch(error) {
    logger.error('Un-Known Error in services/CommonSrvc.js, at encryptStr:' + error);
    return {salt, strHash: ''};
  }
}
// --- End encryptStr: Pasword Encryption Code.

const currUTCObj = () => {
  const utcMoment = moment.utc();
  const currUTCDtTmStr = utcMoment.format('YYYY-MM-DD HH:mm:ss');
  const currUTCTmStr = utcMoment.format('HH:mm:ss');
  const currUTCDtTmNum = moment(currUTCDtTmStr, 'YYYY-MM-DD HH:mm:ss').valueOf();
  const currUTCDtTm = new Date(currUTCDtTmStr);
  const currUTCYear = utcMoment.year();
  const currUTCDayOfYear = utcMoment.dayOfYear();
  const currUTCMonth = utcMoment.format('MM');
  const currUTCDay = utcMoment.format('DD');
  const currUTCHrs = utcMoment.format('HH');
  const currUTCMin = utcMoment.format('mm');
  const currUTCSec = utcMoment.format('ss');
  const currUTCStr = utcMoment.format('YYYYMMDD-HHmmss');
  const currUTCDt = utcMoment.format('YYYY-MM-DD');

  return {currUTCDtTmStr, currUTCDtTmNum, currUTCDtTm, currUTCYear, currUTCDayOfYear, currUTCMonth, currUTCDay, currUTCTmStr, currUTCHrs, currUTCMin, currUTCSec, currUTCStr, currUTCDt};
}

const currUTC = (type) => {
  const utcMoment = moment.utc();
  const currUTCDtTmStr = utcMoment.format('YYYY-MM-DD HH:mm:ss');
  switch(type) {
    case 'Num':
      const currUTCDtTmNum = moment(currUTCDtTmStr, 'YYYY-MM-DD HH:mm:ss').valueOf();
      return currUTCDtTmNum;
    case 'DtTm':
      const currUTCDtTm = new Date(currUTCDtTmStr);
      return currUTCDtTm;
    default:
      return currUTCDtTmStr;
  }
}

const isJsonEmpty = (obj) => {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

// --- Delete Folder === //
const dltFolder = async (filesPath) => {
  if (filesPath && filesPath.length > 0) {
    const folders = await filesPath.map(file => file.destination);
    rimraf(folders, {}, () => { });
  }
}

// --- Random String Generation --- //
const randomStrGen = (str, size) => {
  var result = '';
  for (let i = size; i > 0; --i) result += str[Math.floor(Math.random() * str.length)];
  return result;
};

// --- Begin: getDateTimeObjByDateType
const getDateTimeObjByDateType = (reqBody) => {
  let dateType = reqBody.dateType;
  switch (dateType) {
    case 'Today':
      let startDay = moment.utc().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      let startDayTime = new Date(startDay);
      let todayDateTypeObj = { 'dateType': dateType, 'startTime': startDayTime };
      return todayDateTypeObj;
    case 'Yesterday':
      let startLastDay = moment.utc().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
      let startLastDayTime = new Date(startLastDay);
      let endLastDay = moment.utc().subtract(1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss');
      let endLastDayTime = new Date(endLastDay);
      let yesterDayDateTypeObj = { 'dateType': dateType, 'startTime': startLastDayTime, 'endTime': endLastDayTime };
      return yesterDayDateTypeObj;
    case 'Week':
      let startWeek = moment.utc().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      let startWeekDay = new Date(startWeek);
      let endWeek = moment.utc().endOf('week').format('YYYY-MM-DD HH:mm:ss');
      let endWeekDay = new Date(endWeek);
      let weekDateTypeObj = { 'dateType': dateType, 'startTime': startWeekDay, 'endTime': endWeekDay };
      return weekDateTypeObj;
    case 'Last Week':
      let startLastWeek = moment.utc().subtract(1, 'week').startOf('week').format('YYYY-MM-DD HH:mm:ss');
      let startLastWeekDay = new Date(startLastWeek);
      let endLastWeek = moment.utc().subtract(1, 'week').endOf('week').format('YYYY-MM-DD HH:mm:ss');
      let endLastWeekDay = new Date(endLastWeek);
      let lastWeekDateTypeObj = { 'dateType': dateType, 'startTime': startLastWeekDay, 'endTime': endLastWeekDay };
      return lastWeekDateTypeObj;
    case 'Month':
      let startMonth = moment.utc().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      let startMonthDay = new Date(startMonth);
      let endMonth = moment.utc().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      let endMonthDay = new Date(endMonth);
      let monthDateTypeObj = { 'dateType': dateType, 'startTime': startMonthDay, 'endTime': endMonthDay };
      return monthDateTypeObj;
    case 'Last Month':
      let startLastMonth = moment.utc().subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss');
      let startLastMonthDay = new Date(startLastMonth);
      let endLastMonth = moment.utc().subtract(1, 'month').endOf('month').format('YYYY-MM-DD HH:mm:ss');
      let endLastMonthDay = new Date(endLastMonth);
      let lastMonthDateTypeObj = { 'dateType': dateType, 'startTime': startLastMonthDay, 'endTime': endLastMonthDay };
      return lastMonthDateTypeObj;
    case 'Year':
      let startYear = moment.utc().startOf('year').format('YYYY-MM-DD HH:mm:ss');
      let startYearDay = new Date(startYear);
      let endYear = moment.utc().endOf('year').format('YYYY-MM-DD HH:mm:ss');
      let endYearDay = new Date(endYear);
      let yearDateTypeObj = { 'dateType': dateType, 'startTime': startYearDay, 'endTime': endYearDay };
      return yearDateTypeObj;
    case 'Last Year':
      let startLastYear = moment.utc().subtract(1, 'year').startOf('year').format('YYYY-MM-DD HH:mm:ss');
      let startLastYearDay = new Date(startLastYear);
      let endLastYear = moment.utc().subtract(1, 'year').endOf('year').format('YYYY-MM-DD HH:mm:ss');
      let endLastYearDay = new Date(endLastYear);
      let lastYearDateTypeObj = { 'dateType': dateType, 'startTime': startLastYearDay, 'endTime': endLastYearDay };
      return lastYearDateTypeObj;
    case 'Custom Dates':
      let startDate = moment(reqBody.startDate, 'YYYY-MM-DD').startOf('day').format('YYYY-MM-DD HH:mm:ss');
      let startDateTime = new Date(startDate);
      let endDate = moment(reqBody.endDate, 'YYYY-MM-DD').endOf('day').format('YYYY-MM-DD HH:mm:ss');
      let endDateTime = new Date(endDate);
      let customDateObj = { 'dateType': 'Custom Dates', 'startTime': startDateTime, 'endTime': endDateTime };
      return customDateObj;
    default:
      let defaultObj = { 'dateType': 'default' };
      return defaultObj;
  }
}
// --- End: getDateTimeObjByDateType

const generateAccessToken = () => {
  const curntUTC = currUTCObj();
  const g5rndm = randomStrGen(config.atStr, 5);
  const g5rndm1 = randomStrGen(config.atStr, 5);
  const yr = curntUTC.currUTCYear - 2023;
  const doy = curntUTC.currUTCDayOfYear;
  const hrs = curntUTC.currUTCHrs;
  const min = curntUTC.currUTCMin;
  const sec = curntUTC.currUTCSec;
  const g4rndm = randomStrGen(config.atStr, 4);
  const at = g5rndm+yr+doy+'-'+hrs+g5rndm1+min+'-'+g4rndm+sec;
  return at;
}
module.exports = {
  genSalt, encryptStr,
  currUTCObj, currUTC,
  isJsonEmpty, dltFolder,
  randomStrGen, getDateTimeObjByDateType, generateAccessToken
}
