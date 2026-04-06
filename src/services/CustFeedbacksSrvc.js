/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustFeedbacksDaoImpl = require('../daosimplements/CustFeedbacksDaoImpl');
const CustFeedbacksDao = require('../daos/CustFeedbacksDao');
const DashbrdAnltcsSrvc = require('./DashbrdAnltcsSrvc');

const postAdminUserFeedbackList = (reqBody, tData, callback) => {
  const qry = CustFeedbacksDaoImpl.userfdbkQry(reqBody, tData);
  CustFeedbacksDao.getfFdbkList(qry, reqBody, callback);
}

const postAdminUserFeedbackCreate = (reqBody, tData, callback) => {
  const qry = CustFeedbacksDaoImpl.userfdbkCreateQry(reqBody, tData);
  CustFeedbacksDao.commonCreateFunc(qry, (resObj) => {
     callback(resObj);
    if(resObj.status == 200) {
      DashbrdAnltcsSrvc.upsertAnltcsFrmFdbk(resObj.resData.result, tData, (resObj) => {});
    }
  });
}

module.exports = {
  postAdminUserFeedbackList, postAdminUserFeedbackCreate
};
