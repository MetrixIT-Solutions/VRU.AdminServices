/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const MailSettings = require('../schemas/MailSettings');
const MailSettingsDaoImpl = require('../daosimplements/MailSettingsDaoImpl');
const MailSettingsDao = require('../daos/MailSettingsDao');
const setRes = require('../SetRes')

const postRstrntMailSettingsCreate = (reqBody, tData, callback) => {
  createMailData(0, reqBody, [], tData, callback);
}

const getRstrntMailSettingsList = (reqBody, tData, callback) => {
  const query = MailSettingsDaoImpl.getRstrntMailSettingsList(reqBody, tData);
  MailSettingsDao.getRstrntMailSettingsList(query, reqBody, callback);
}

const postRstrntMailSettingsUpdate = (reqBody, tData, callback) => {
  const obj = MailSettingsDaoImpl.rstrntMailSettingsUpdate(reqBody, tData);
  MailSettingsDao.postRstrntMailSettingsUpdate(obj.query, obj.updateObj, callback);
}

module.exports = {
  postRstrntMailSettingsCreate, getRstrntMailSettingsList, postRstrntMailSettingsUpdate
}


const createMailData = (i, reqBody, resArr, tData, callback) => {
   const mailData = reqBody.mailType;
    if(i < mailData.length){
      const data = mailData[i];
    const obj = MailSettingsDaoImpl.createSmsSettings(reqBody, data, tData);
    const createObj = new MailSettings(obj);
    MailSettingsDao.commonCreateFunc(createObj, (resObj) => {
        resObj.status =='200' && resArr.push(resObj.resData.result);  
      createMailData(i+1,  reqBody, resArr, tData, callback);
    });
    } else{
      if(resArr.length > 0){
      const resData = setRes.successRes(resArr)
      callback(resData);
    } else {
      const fail = setRes.createFailed()
      callback(fail);
    }
    }
}
