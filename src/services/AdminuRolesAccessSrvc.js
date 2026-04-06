/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const daoImpl = require('../daosimplements/AdminuRoleAccessDaosImpl');
const AdminuRADaos = require('../daos/AdminuRolesAccessDao');

const postAdminUsrRlsAcsList = (reqBody, tData, callback) => {
  const obj = daoImpl.usrRlsAcsListQry(reqBody, tData);
  AdminuRADaos.postAdminUsrRlsAcsList(reqBody.actPgNum, reqBody.rLimit, obj, callback);
}

const postAdminUsrRlsAcsCreate = (reqBody, tData, callback) => {
  const rolesAcsData = daoImpl.rolesAcsData(reqBody, tData);
  AdminuRADaos.postAdminUsrRlsAcsCreate(rolesAcsData, callback);
}

const getAdminUsrRlsAcsView = (recordId, tData, callback) => {
  const query = daoImpl.getQueryData(recordId, tData);
  AdminuRADaos.getAdminUsrRlsAcsView(query, callback);
}

const putAdminUsrRlsAcsUpdate = (reqBody, recordId, tData, callback) => {
  const query = daoImpl.getQueryData(recordId, tData);
  const upObj = daoImpl.updateData(reqBody, tData);
  AdminuRADaos.putAdminUsrRlsAcsUpdate(query, upObj, callback);
}

const getRlAcsData = (payload, callback) => {
  const query = daoImpl.setRlAcsQuery(payload);
  AdminuRADaos.getAdminUsrRlsAcsView(query, callback);
}

module.exports = {
  postAdminUsrRlsAcsList, postAdminUsrRlsAcsCreate, getAdminUsrRlsAcsView, putAdminUsrRlsAcsUpdate, getRlAcsData
};
