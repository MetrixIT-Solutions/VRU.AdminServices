/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

var { v4: uuidv4 } = require('uuid');

const adOrgsOnBrdngDaoImpl = require('../daosimplements/AdminOrgsOnBoardingDaoImpl');
const adOrgsOnBrdngDao = require('../daos/AdminOrgsOnBoardingsDao');
const AdminOrgsOnBoardings = require('../schemas/AdminOrgsOnBoardings');
const AdminOrgsOnBoardingsSrvcImpl = require('./AdminOrgsOnBoardingsSrvcImpl');
const AdminOrgsOnBoardingsLcs = require('../schemas/AdminOrgsOnBoardingsLcs');
const AdminOrgsDao = require('../daos/AdminOrgsDao');

const adminOrgsOnbrdngsList = (reqBody, tData, callback) => {
  const query = adOrgsOnBrdngDaoImpl.adminOrgsOnbrdngsList(reqBody);
  adOrgsOnBrdngDao.adminOrgsOnbrdngsList(reqBody.actPgNum, reqBody.rLimit, query, callback);
}

const adOrgsOnbrdngValidate = (reqBody, callback) => {
  const query = adOrgsOnBrdngDaoImpl.adOrgOnbrdngVldtQry(reqBody);
  if(reqBody.type == 'org') AdminOrgsDao.postAdminOrgView(query, callback);
  else adOrgsOnBrdngDao.getAdminOrgsOnBrdngView(query, callback);
}
const postAdminOrgsOnBrdngCreate = (reqBody, callback) => {
  const data = adOrgsOnBrdngDaoImpl.crtOnbrdngData(reqBody);
  const createObj = new AdminOrgsOnBoardings(data);
  adOrgsOnBrdngDao.postAdminOrgsOnBrdngCreate(createObj, (resObj) => {
    callback(resObj);
    if (resObj.status == '200') {
      const createObj1 = new AdminOrgsOnBoardingsLcs({ ...data, orgId: data._id, _id: uuidv4() });
      adOrgsOnBrdngDao.postAdminOrgsOnBrdngCreate(createObj1, (resObj1) => { });
      AdminOrgsOnBoardingsSrvcImpl.sendOnBrdngRqstMail(reqBody);
    }
  });
}

const getAdminOrgsOnBrdngView = (recordId, callback) => {
  const query = adOrgsOnBrdngDaoImpl.getAdminOrgOnBrdngView(recordId);
  adOrgsOnBrdngDao.getAdminOrgsOnBrdngView(query, callback);
}

const putAdminOrgsOnBrdngUpdate = (reqBody, recordId, tData, callback) => {
  const query = adOrgsOnBrdngDaoImpl.getAdminOrgOnBrdngView(recordId);
  const updateObj = adOrgsOnBrdngDaoImpl.updateOrgOnbrdngData(reqBody, tData);
  adOrgsOnBrdngDao.putAdminOrgsOnBrdngUpdate(query, updateObj, (resObj) => {
    if (resObj.status == '200') {
      const data = Object.assign({}, resObj.resData.result.toObject());
      const dObj = { ...data, _id: uuidv4(), orgId: data._id, cUser: data.uUser, cuName: data.cuName, cDtTm: data.uDtTm, cDtStr: data.uDtStr };
      const createObj = new AdminOrgsOnBoardingsLcs(dObj);
      adOrgsOnBrdngDao.postAdminOrgsOnBrdngCreate(createObj, (resObj1) => { });
    }
    callback(resObj);
  });
}

const putAdminOrgsOnBrdngStatusUpdate = (reqBody, recordId, res, tData, callback) => {
  const query = adOrgsOnBrdngDaoImpl.getAdminOrgOnBrdngView(recordId);
  const upObj = adOrgsOnBrdngDaoImpl.adminOrgOnBrdngStatusUpdate(reqBody, tData);
  adOrgsOnBrdngDao.putAdminOrgsOnBrdngUpdate(query, upObj, (resObj) => {
    callback(resObj);
    if (resObj.status == '200') {
      const data = Object.assign({}, resObj.resData.result.toObject());
      const dObj = { ...data, _id: uuidv4(), orgId: data._id, cUser: data.uUser, cuName: data.cuName, cDtTm: data.uDtTm, cDtStr: data.uDtStr };
      const createObj = new AdminOrgsOnBoardingsLcs(dObj);
      adOrgsOnBrdngDao.postAdminOrgsOnBrdngCreate(createObj, (resObj1) => { });
      reqBody.status == 'Rejected' && AdminOrgsOnBoardingsSrvcImpl.sendRejectedMail(data);
    }
  });
}

const putAdminOrgsOnBrdngActivate = (reqBody, recordId, res, devInfo, tData, callback) => {
  const query = adOrgsOnBrdngDaoImpl.getAdminOrgOnBrdngView(recordId);
  const upObj = adOrgsOnBrdngDaoImpl.activateAdminOrgOnBrdng(reqBody, tData);
  adOrgsOnBrdngDao.putAdminOrgsOnBrdngUpdate(query, upObj, (resObj) => {
     callback(resObj);
    if (resObj.status == '200') {
      const data = Object.assign({}, resObj.resData.result.toObject());
      const dObj = { ...data, _id: uuidv4(), orgId: data._id, cUser: data.uUser, cuName: data.cuName, cDtTm: data.uDtTm, cDtStr: data.uDtStr };
      const createObj = new AdminOrgsOnBoardingsLcs(dObj);
      adOrgsOnBrdngDao.postAdminOrgsOnBrdngCreate(createObj, (resObj1) => { });
      reqBody.isActive && AdminOrgsOnBoardingsSrvcImpl.createOrg(data, res, devInfo, tData);
    }
  });
}

const getOnbrdngsLfcsList = (id, callback) => {
  const query = adOrgsOnBrdngDaoImpl.onBrdngsLfcsListQry(id);
  adOrgsOnBrdngDao.getOnbrdngsLfcsList(query, callback);
}

module.exports = {
  adminOrgsOnbrdngsList, adOrgsOnbrdngValidate, postAdminOrgsOnBrdngCreate, getAdminOrgsOnBrdngView, putAdminOrgsOnBrdngUpdate, 
  putAdminOrgsOnBrdngStatusUpdate, putAdminOrgsOnBrdngActivate, getOnbrdngsLfcsList
};
