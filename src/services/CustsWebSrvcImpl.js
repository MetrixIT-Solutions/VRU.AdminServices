/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var randomNumber = require('random-number');
const config = require('config');
var moment = require('moment');

const CustsUsers = require('../schemas/CustsUsers');
const CustsWebDaosImpl = require('../daosimplements/CustsWebDaosImpl');
const CustsWebDaos = require('../daos/CustsWebDaos');
const CustsUsersInfos = require('../schemas/CustsUsersInfos');
const tokens = require('../tokens');
const SetRes = require('../SetRes');
const CommonSrvc = require('./CommonSrvc');
const Mail = require('../../config/mail');
const smsJson = require('../../config/sms.json');
const CustsCateringSrvcs = require('../schemas/CustsCateringSrvcs');
const CustsFeedbacks = require('../schemas/CustsFeedbacks');
const CustsFranchise = require('../schemas/CustsFranchise');
const Apicall = require('../Apicall')
const CustsPrivateDining = require('../schemas/CustsPrivateDining');
const toMailsJson = require('../../config/toMails.json');
const DashbrdAnltcsSrvc = require('./DashbrdAnltcsSrvc');
const CustsPrivateDiningLcs = require('../schemas/CustsPrivateDiningLcs');
const CustsPrvtDiningDaoImpl = require('../daosimplements/CustsPrvtDiningDaoImpl');

const ot = { login: 'Login', fp: 'Forgot Password' };

const cateringSrvcCreate = (reqBody, usrRes, bData, callback) => {
  reqBody['user'] = usrRes._id;
  reqBody['refUID'] = usrRes.refUID
  const obj = CustsWebDaosImpl.createCateringSrvc(reqBody, bData);
  const createObj = new CustsCateringSrvcs(obj);
  CustsWebDaos.commonCreateFunc(createObj, (resObj) => {
    if (resObj.status == '200') {
      sendCateringMail(reqBody);
    }
    callback(resObj)
  });
}


const contactUsMail = (reqBody, emID) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentDate = new Date();
  let month = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const currentUTC = CommonSrvc.currUTCObj();
  const year = currentUTC.currUTCYear;
  const formattedDate = `${day}${month}${year}`;
  let mailSub = `${reqBody.bCode}-ContactUs-${formattedDate}`;
  let htmlContent = `<p>Following are the ContactUs information: </p>
  <p>Name: <b>${reqBody.name}</b></p>
  <p>Mobile #: <b>${reqBody.mobileNum}</b></p>
  <p>Email: <b>${reqBody.emID}</b></p>`;
  Mail.sendEMail(emID, mailSub, htmlContent, (err, resObj) => { });
}

const sendBranchMails = (reqBody, mail) => {
  const count = reqBody.vegCount + reqBody.nonVegCount + reqBody.kidsCount;
  const date1 = new Date(reqBody.bDt);
  const month = date1.toLocaleString('en-US', { month: 'long' });
  const day = date1.getDate();
  const year = date1.getFullYear();
  const monthDate = `${day} ${month}, ${year}`;
  const t1 = reqBody.bTm;
  const time = t1.replace(/(\d{2}:\d{2})\s([APM]{2})/, '$1$2');
  let date = monthDate, name = reqBody.name, mobileNum = reqBody.mobNum;
  let value = count > 1 ? 'persons' : 'person';
  let mailSub = `${reqBody.bCode}-Reservation-${reqBody.bDt}@${time}`;
  const eName = reqBody?.eName || reqBody?.oName || 'V Reserve U';
  let htmlContent = 
  `<p>Hello,</p><p>You have a Table Reservation. Table reserved for ${count} ${value} on <b>${date} ${reqBody.bTm}</b> by</p><p>Customer: <b>${name}</b></p><p>Phone #: <b>+91 ${mobileNum}</b></p>
   <p><b>Note:</b> This is a system-generated email. Please do not reply to this message.</p>
   <p>Regards,<br/><b>${eName} Team</b></p>`;
  Mail.sendEMail(mail, mailSub, htmlContent, (err, resObj) => { });
}

const sendBkngConfirmationSms = (reqBody) => {
  const date = moment(reqBody.bDt).format('Do MMM YYYY');
  const count = reqBody.vegCount + reqBody.nonVegCount + reqBody.kidsCount;
  const data = {
    template_id: smsJson[reqBody.bCode]?.confirmBkgTempId, short_url: config.smsShortUrl, 
    recipients: [{ mobiles: reqBody.userID, name: reqBody.name, members: count, date, time: reqBody.bTm, mins: '15'}]
  };
  Apicall.commonSms(data, (resObj) => {});
}

const prvtDngCreate = (query, reqBody, bData, resObj, callback) => {
  if (resObj.status == '200') {
    const upObj = CustsWebDaosImpl.updateCustomerData(reqBody, {});
    CustsWebDaos.updateCustUserData(query, upObj, (resObj1) => {
      if (resObj1.status == '200') {
        createDining(reqBody, bData, resObj1.resData.result, callback);
      } else {
        createDining(reqBody, bData, resObj.resData.result, callback);
      }
    })
  } else {
    reqBody['emailId'] = reqBody.emID;
    const obj = CustsWebDaosImpl.postCustUserSignupCreate(reqBody, {}, bData);
    const createObj = new CustsUsers(obj);
    CustsWebDaos.commonCreateFunc(createObj, (resObj2) => {
      if (resObj2.status == '200') {
        createDining(reqBody, bData, resObj2.resData.result, callback);
      } else {
        createDining(reqBody, bData, {}, callback);
      }
    });
  }
};

const createFunct = (createObj, callback) => {
  const fdbkData = new CustsFeedbacks(createObj);
  CustsWebDaos.commonCreateFunc(fdbkData, (resObj) => {
    if(resObj.status == '200') {
      const tData = { ut: createObj.uuType, iss: createObj.uUser,  un: createObj.uuName };
      DashbrdAnltcsSrvc.upsertAnltcsFrmFdbk(resObj.resData.result, tData, () => {});
    }
    callback(resObj);
  });
}

const createFrnch = (createObj, mailId, callback) => {
  const fdbkData = new CustsFranchise(createObj);
  CustsWebDaos.commonCreateFunc(fdbkData, (resObj) => {
    callback(resObj);
    if(resObj.status == '200'){
      const tData = { ut: createObj.uuType, iss: createObj.uUser,  un: createObj.uuName };
      DashbrdAnltcsSrvc.upsertAnltcsFrmFranchise(resObj.resData.result, tData, 'create');
      sendFrnchMail(mailId, createObj);
    }
  });
}

const existingCustomer = (reqBody, res, userObj, callback) => {
  // if(reqBody.bCode != 'KNDPR') {
  //   custTokenGeneration(userObj, res, callback);
  // } else {
  const otpData = setOtpData(reqBody);
  const query = CustsWebDaosImpl.findUserWithMobNum(reqBody);
  const upObj = CustsWebDaosImpl.updateCustomerData(reqBody, otpData.otpObj);
  CustsWebDaos.updateCustUserData(query, upObj, (resObj) => {
    if (resObj.status == '200') {
      sendOtp(resObj.resData.result, otpData.otpNum, reqBody, res, callback);
    } else {
      const uke = SetRes.updateFailed({});
      callback(uke);
    }
  });
  // }
};

const postCustUserSignupCreate = (reqBody, res, bData, callback) => {
  const otpData = setOtpData(reqBody)
  const obj = CustsWebDaosImpl.postCustUserSignupCreate(reqBody, otpData.otpObj, bData);
  const createObj = new CustsUsers(obj);
  CustsWebDaos.commonCreateFunc(createObj, (resObj) => {
    if (resObj.status == '200') {
      const userObj = resObj.resData.result;
      // if(reqBody.bCode != 'KNDPR') {
      //   custTokenGeneration(userObj, res, callback);
      // } else {
      sendOtp(userObj, otpData.otpNum, reqBody, res, callback);
      const obj = CustsWebDaosImpl.postCustUserInfoCreate(userObj, bData);
      const createObj = new CustsUsersInfos(obj);
      CustsWebDaos.commonCreateFunc(createObj, (resObj) => { });
      // }
    } else {
      callback(resObj);
    }
  });
};

const verifyLoginOtp = (uResObj, otpNum, query, vrucutoken, res, callback) => {
  const otpObj = CommonSrvc.encryptStr(otpNum, uResObj.otpLav);
  if (uResObj.otp === otpObj.strHash) {
    const updateObj = CustsWebDaosImpl.setOtpVrfRes();
    CustsWebDaos.updateCustUserData(query, updateObj, (resObj) => {
      if (resObj.status == '200') {
        vrucuRefreshToken(uResObj, vrucutoken, res, callback);
      } else {
        const ovf = SetRes.otpVerifyFailed();
        callback(ovf);
      }
    });
  } else {
    const invOtp = SetRes.invalidOtp();
    callback(invOtp);
  }
}

const sendFrnchMail = (mailId, data) => {
  const date1 = new Date();
  const month = date1.toLocaleString('en-US', { month: 'long' });
  const date = date1.getDate();
  const yr = date1.getFullYear();
  const smth = month.slice(0, 3);
  let fReq = `<p>Request for: <b>${data.eName}</b></p>`
  let name = `<p>Name: <b>${data.name}</b></p>`;
  let mb = `<p>Mobile #: <b> +91 ${data.mobNum}</b></p>`;
  let em = `<p>Email: <b>${data.emID}</b></p>`;
  let st = ` <p>Streat/Area: <b>${data.fArea}</b></p>`;
  let pnc = `<p>Pincode: <b>${data.fPincode}</b></p>`;
  let ct = `<p>City: <b>${data.fCity}</b></p>`;
  let state = `<p>State: <b>${data.fState}</b></p>`;

  let mailSub = `${data.eName}-FranchiseRequest-${date}${smth}${yr}`;
  let htmlContent = `<p>Hello,</p><p>Following are the Franchise request information: </p> ${fReq} ${name} ${mb}  ${em} ${st} ${pnc} ${ct} ${state}.`;
  Mail.sendEMail(mailId, mailSub, htmlContent, (err, resObj) => { });
}

module.exports = {
  cateringSrvcCreate, contactUsMail, sendBranchMails, sendBkngConfirmationSms, prvtDngCreate, createFunct, createFrnch, postCustUserSignupCreate, existingCustomer, verifyLoginOtp, sendFrnchMail
};

const sendCateringMail = (reqBody) => {
  const date = moment(reqBody.eDt).format('DD MMM, YYYY');
  let name = reqBody.name, mobileNum = reqBody.mobileNum;
  let mailSub = `${reqBody.bCode} - Catering Service - ${date}`;
  const toMails = toMailsJson[reqBody.bCode]?.toMails ? toMailsJson[reqBody.bCode]?.toMails : config.ftoMails;
  let htmlContent = `
        <p>Hello,</p>
        <h3>You have a Catering service request</h3>
        <p><strong>Customer:</strong> ${name}</p>
        <p><strong>Phone #: </strong> +91 ${mobileNum}</b></p>
        <p><strong>Number Of Persons: </strong> ${reqBody.numPersons} </p>
        <p><strong>Service For:</strong> ${reqBody.serviceFor}</p>
        <p><strong>Event Date:</strong> ${date}</p>
        <p><strong>Event Location:</strong> ${reqBody.eLocation}</p>
        <p><strong>Occasion:</strong> ${reqBody.occassion}</p>
        ${reqBody.eInfo ? `<p><strong>Info:</strong> ${reqBody.eInfo}</p>` : ''}`;
  Mail.sendEMail(toMails, mailSub, htmlContent, (err, resObj) => { });
}

const setOtpData = (reqBody) => {
  const otpNumLimit = { min: 1000, max: 9999, integer: true };
  const otpNum = randomNumber(otpNumLimit).toString();
  const body = { template_id: smsJson[reqBody.bCode]?.otpTempId, short_url: config.smsShortUrl, recipients: [{ mobiles: reqBody.userID, otpnum: otpNum }] };
  Apicall.commonSms(body, (resObj) => {});
  const salt = CommonSrvc.genSalt(config.mySaltLen);
  const otpObj = CommonSrvc.encryptStr(otpNum, salt);
  return { otpNum, otpObj };
}

const sendOtp = (uResObj, otpNum, reqBody, res, callback) => {
  uResObj.userID = reqBody.userID;
  const otpToken = tokens.vrucuTokenGeneration(uResObj, ot.login, res);
  if (!otpToken) {
    return callback(SetRes.unKnownErr({}));
  }
  console.log(uResObj.myPrimary, '===Login otpNumber:', otpNum);
  callback(SetRes.otpSentSuc(otpNum));
};


const vrucuRefreshToken = (userObj, vrucutoken, res, callback) => {
  const token = tokens.vrucuRefreshToken(vrucutoken, res);
  if (token) {
    const uObj = CustsWebDaosImpl.setUserResData(userObj);
    const otpVerfy = SetRes.otpVerify(uObj);
    callback(otpVerfy);
  } else {
    const ovf = SetRes.otpVerifyFailed();
    callback(ovf);
  }
}

const createDining = (reqBody, bData, uRes, callback) => {
  const obj = CustsWebDaosImpl.createPrivateDining(reqBody, bData, uRes);
  const createObj = new CustsPrivateDining(obj);
  CustsWebDaos.commonCreateFunc(createObj, (resObj) => {
    if (resObj.status == '200') {
      const tData = { ut: obj.uuType, iss: obj.uUser,  un: obj.uuName };
      DashbrdAnltcsSrvc.upsertAnltcsFrmPrvtDng(resObj.resData.result, tData, 'create');
      pdMail(resObj.resData.result, bData.emID);
      const data = Object.assign({}, resObj.resData.result.toObject());
      const lcsData = CustsPrvtDiningDaoImpl.privateDiningLcsCreate(data, tData);
      const lcsObj = new CustsPrivateDiningLcs(lcsData);
      CustsWebDaos.commonCreateFunc(lcsObj, (resObj) => {});
      callback(resObj);
    } else {
      callback(resObj)
    }
  });
}

const pdMail = (reqBody, emID) => {
  const date1 = new Date(reqBody.bDt);
  const month = date1.toLocaleString('en-US', { month: 'long' });
  const day = date1.getDate();
  const monthDate = `${month} ${day}`;
  let date = monthDate, time = reqBody.bTm, name = reqBody.name, mobileNum = reqBody.mobNum;
  const eCode = reqBody?.eCode || reqBody?.oCode || 'VRU';
  const eName = reqBody?.eName || reqBody?.oName || 'V Reserve U';
  let mailSub = `${eCode}-PrivateDining-${date},${time}`;
  let htmlContent = 
  `<p>Hello,</p><p>You have a private dining request. Private dining requested for <b>${date}, ${time}</b> by</p><p>Customer: <b>${name}</b></p><p>Phone #: <b>+91 ${mobileNum}</b></p>
  <p><b>Note:</b> This is a system-generated email. Please do not reply to this message.</p>
  <p>Regards,<br/><b>${eName} Team</b></p>`;
  Mail.sendEMail(emID, mailSub, htmlContent, (err, resObj) => { });
}