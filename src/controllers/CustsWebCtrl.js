/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsWebCtrlVldns = require('../ctrlvldtns/CustsWebCtrlVldns');
const CutstsWebSrvc = require('../services/CutstsWebSrvc');
const util = require('../lib/util');
const SetRes = require('../SetRes');
const tokens = require('../tokens');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');

const getCustsBranchesList = (req, res, next) => {
  CutstsWebSrvc.getCustsBranchesList(req.body, (resObj) => util.sendApiResponse(res, resObj));
};

const createCateringSrvc = (req, res, next) => {
  const cv = CustsWebCtrlVldns.ctrngCrtVldn(req);
  if (cv.flag) CutstsWebSrvc.createCateringSrvc(req.body, (resObj) => util.sendApiResponse(res, resObj));
  else util.sendApiResponse(res, cv.result);
};

const createCustsContact = (req, res, next) => {
  const cv = CustsWebCtrlVldns.cntctCrtVldn(req);
  if (cv.flag) CutstsWebSrvc.createCustsContact(req.body, (resObj) => util.sendApiResponse(res, resObj));
  else util.sendApiResponse(res, cv.result);
};

const getCustsOffersList = (req, res, next) => {
  const vVldn = CustsWebCtrlVldns.offerViewVldn(req);
  if (vVldn.flag){
    const tData = tokens.vrucuRefreshToken(req.headers.vrucutoken, res);
    const tv = CommonCtrlVldns.tokenVldn(tData);
    if (tv.flag) {
      CutstsWebSrvc.getCustsOffersList(req.body, (resObj) => util.sendApiResponse(res, resObj));
    } else {
      util.sendApiResponse(res, tv.result);
    }
  } 
  else util.sendApiResponse(res, vVldn.result);
};

const createPrivateDining = (req, res, next) => {
  const cv = CustsWebCtrlVldns.prvtDngCrtVldn(req);
  if (cv.flag) CutstsWebSrvc.createPrivateDining(req.body, (resObj) => util.sendApiResponse(res, resObj));
  else util.sendApiResponse(res, cv.result);
};

const createTableBkg = (req, res, next) => {
  const createVldn = CustsWebCtrlVldns.bkngCrtVldn(req);
  if (createVldn.flag) {
    const tData = tokens.vrucuRefreshToken(req.headers.vrucutoken, res);
    const tv = CommonCtrlVldns.tokenVldn(tData);
    if (tv.flag) {
      CutstsWebSrvc.createTableBkg(req.body, tData.tokenData, (resObj) => {
        util.sendApiResponse(res, resObj);
      });
    } else {
      util.sendApiResponse(res, tv.result);
    }
  } else util.sendApiResponse(res, createVldn.result);
}

const getCustsTableBlckDates = (req, res, next) => {
  const reqBody = req.body;
  if (reqBody.oCode && reqBody.bCode && reqBody.eCode) {
      CutstsWebSrvc.getCustsTableBlckDates(reqBody, (resObj) => {
        util.sendApiResponse(res, resObj);
      });
  } else util.sendApiResponse(res, SetRes.msdReqFields());
}

const postCustUserSignupCreate = (req, res, next) => {
  const cv = CustsWebCtrlVldns.usrCrtVldn(req);
  if (cv.flag) CutstsWebSrvc.postCustUserSignupCreate(req.body, res, (resObj) => {
    util.sendApiResponse(res, resObj)});
  else util.sendApiResponse(res, cv.result);
};

const postCustUserLoginVerifyOtp = (req, res, next) => {
  const verifyOtp = CustsWebCtrlVldns.otpVldn(req);
  if (verifyOtp.flag) {
    const tData = tokens.custUserTokenDecode(req.headers.vrucutoken);
    const tv = CommonCtrlVldns.tokenVldn(tData);
    if (tv.flag) {
      CutstsWebSrvc.postCustUserLoginVerifyOtp(req.body, tData.tokenData, req.headers.vrucutoken, res, (resObj) => {
        util.sendApiResponse(res, resObj);
      });
    } else {
      util.sendApiResponse(res, tv.result);
    }
  } else {
    util.sendApiResponse(res, verifyOtp.result);
  }
}

const postCustUserFeedbackCreate = (req, res) => {
  const bdVldn = CustsWebCtrlVldns.custFdBkVldn(req);
  if (bdVldn.flag) {
    CutstsWebSrvc.postCustUserFeedbackCreate(req.body, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else util.sendApiResponse(res, bdVldn.result)
}

const postCustUserFranchiseCreate = (req, res) => {
  const bdVldn = CustsWebCtrlVldns.custFrnchBkVldn(req);
  if (bdVldn.flag) {
    CutstsWebSrvc.postCustUserFranchiseCreate(req.body, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else util.sendApiResponse(res, bdVldn.result);
}

const getRestaurantInformation = (req, res, next) => {
  const reqBody = req.body;
  if(reqBody.oCode && reqBody.bCode && reqBody.eCode) {
    CutstsWebSrvc.getRestaurantInformation(reqBody, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else util.sendApiResponse(res, SetRes.msdReqFields());
};

const getSpecialDaysPricingsList = (req, res, next) => {
  const reqBody = req.body;
  if (reqBody.oCode && reqBody.bCode && reqBody.eCode) {
    CutstsWebSrvc.getSpecialDaysPricingsList(reqBody, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else util.sendApiResponse(res, SetRes.msdReqFields());
};

module.exports = {
  getCustsBranchesList, createCateringSrvc, createCustsContact, getCustsOffersList,
  createPrivateDining, createTableBkg, getCustsTableBlckDates, postCustUserSignupCreate,
  postCustUserLoginVerifyOtp, postCustUserFeedbackCreate, postCustUserFranchiseCreate,
  getRestaurantInformation, getSpecialDaysPricingsList
};