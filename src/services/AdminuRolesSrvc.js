/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const daoImpl = require('../daosimplements/AdminuRolesDaosImpl');
const adminuRolesDaos = require('../daos/AdminuRolesDaos');
const adminuRolesAcsDaos = require('../daos/AdminuRolesAccessDao');
const SetRes = require('../SetRes');

const adminUsrRlsList = (reqBody, tData, callback) => {
  const obj = daoImpl.adminUsrRlsList(reqBody, tData);
  adminuRolesDaos.adminUsrRlsList(reqBody.actPgNum, reqBody.rLimit, obj, callback);
}

const postAdminUsrRlsCreate = (reqBody, tData, callback) => {
  const roleData = daoImpl.crtRolesData(reqBody, tData);
  adminuRolesDaos.postAdminUsrRlsCreate(roleData, callback);
}

const getAdminUsrRlsView = (recordId, tData, callback) => {
  const query = daoImpl.getQueryData(recordId, tData);
  adminuRolesDaos.getAdminUsrRlsView(query, callback);
}

const postb2bUsrRlsUpdate = (reqBody, recordId, tData, callback) => {
  const query = daoImpl.getQueryData(recordId, tData);
  const UpdateObj = daoImpl.updateData(reqBody, tData);
  adminuRolesDaos.postb2bUsrRlsUpdate(query, UpdateObj, callback);
}

const postb2bUsrRlsStatusUpdate = (reqBody, recordId, tData, callback) => {
  const query = daoImpl.getQueryData(recordId, tData);
  const UpdateObj = daoImpl.statusUpdateData(reqBody, tData);
  adminuRolesDaos.postb2bUsrRlsUpdate(query, UpdateObj, callback);
}

const adminUsrRlsDelete = (recordId, tData, callback) => {
  const raQry = daoImpl.getQueryData(recordId, tData);
  adminuRolesDaos.adminUsrRlsDelete(raQry, callback);
}

module.exports = {
  adminUsrRlsList, postAdminUsrRlsCreate, getAdminUsrRlsView, postb2bUsrRlsUpdate, postb2bUsrRlsStatusUpdate,
  adminUsrRlsDelete
};
