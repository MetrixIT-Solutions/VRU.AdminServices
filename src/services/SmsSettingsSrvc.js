/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SmsSettings = require('../schemas/SmsSettings');
const SmsSettingsDaoImpl = require('../daosimplements/SmsSettingsDaoImpl');
const SmsSettingsDao = require('../daos/SmsSettingsDao');

const postRstrntSmsSettingsCreate = (reqBody, tData, callback) => {
  const obj = SmsSettingsDaoImpl.createSmsSettings(reqBody, tData);
  const createObj = new SmsSettings(obj);
  SmsSettingsDao.commonCreateFunc(createObj, callback);
}

const getRstrntSmsSettingsList = (reqBody, tData, callback) => {
  const query = SmsSettingsDaoImpl.getRstrntSmsSettingsList(reqBody, tData);
  SmsSettingsDao.getRstrntSmsSettingsList(query, reqBody, callback);
}

const postRstrntSmsSettingsUpdate = (reqBody, tData, callback) => {
  const obj = SmsSettingsDaoImpl.rstrntSmsSettingsUpdate(reqBody, tData);
  SmsSettingsDao.postRstrntSmsSettingsUpdate(obj.query, obj.updateObj, callback);
}

module.exports = {
  postRstrntSmsSettingsCreate, getRstrntSmsSettingsList, postRstrntSmsSettingsUpdate
}
