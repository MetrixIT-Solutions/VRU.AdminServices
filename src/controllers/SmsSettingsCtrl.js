
/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const util = require('../lib/util');
const SmsSettingsCtrlVldns = require('../ctrlvldtns/SmsSettingsCtrlVldns');
const SmsSettingsSrvc = require('../services/SmsSettingsSrvc');
const token = require('../tokens');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');

//----------------------BEGIN Restaurant Sms Settings Apis----------------------//\

const postRstrntSmsSettingsCreate = (req, res, next) => {
  const createVldn = SmsSettingsCtrlVldns.createVldn(req);
  if (createVldn.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        SmsSettingsSrvc.postRstrntSmsSettingsCreate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, createVldn.result);
}

const getRstrntSmsSettingsList = (req, res, next) => {
  const createVldn = SmsSettingsCtrlVldns.listVldn(req);
  if (createVldn.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        SmsSettingsSrvc.getRstrntSmsSettingsList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, createVldn.result);
}

const postRstrntSmsSettingsUpdate = (req, res, next) => {
  const createVldn = SmsSettingsCtrlVldns.updateVldn(req);
  if (createVldn.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        SmsSettingsSrvc.postRstrntSmsSettingsUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, createVldn.result);
}

//----------------------END Restaurant Sms Settings Apis----------------------//\

module.exports = {
  postRstrntSmsSettingsCreate, getRstrntSmsSettingsList, postRstrntSmsSettingsUpdate
};
