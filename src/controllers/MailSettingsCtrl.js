
/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const util = require('../lib/util');
const MailSettingsCtrlVldns = require('../ctrlvldtns/MailSettingsCtrlVldns');
const MailSettingsSrvc = require('../services/MailSettingsSrvc');
const token = require('../tokens');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');

//----------------------BEGIN Restaurant Mail Settings Apis----------------------//\

const postRstrntMailSettingsCreate = (req, res, next) => {
  const createVldn = MailSettingsCtrlVldns.createVldn(req);
  if (createVldn.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        MailSettingsSrvc.postRstrntMailSettingsCreate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, createVldn.result);
}

const getRstrntMailSettingsList = (req, res, next) => {
  const createVldn = MailSettingsCtrlVldns.listVldn(req);
  if (createVldn.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        MailSettingsSrvc.getRstrntMailSettingsList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, createVldn.result);
}

const postRstrntMailSettingsUpdate = (req, res, next) => {
  const createVldn = MailSettingsCtrlVldns.updateVldn(req);
  if (createVldn.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        MailSettingsSrvc.postRstrntMailSettingsUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, createVldn.result);
}

//----------------------END Restaurant Mail Settings Apis----------------------//\

module.exports = {
  postRstrntMailSettingsCreate, getRstrntMailSettingsList, postRstrntMailSettingsUpdate
};