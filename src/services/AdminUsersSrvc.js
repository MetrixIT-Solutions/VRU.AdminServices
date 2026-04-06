/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const AdmnUsrs = require('../schemas/AdminUsers');
const AdminUsersDaoImpl = require('../daosimplements/AdminUsersDaoImpl');
const AdminUsersDAO = require('../daos/AdminUsersDao');
const AdminUserLoginDaoImpl = require('../daosimplements/AdmnUserLoginDaoImpl');
const AdminUsersLoginDao = require('../daos/AdminUsersLoginDao');

const getAdminUsersList = (reqBody, tokenData, callback) => {
  const obj = AdminUsersDaoImpl.getAdminUsersList(reqBody, tokenData);
  AdminUsersDAO.getAdminUsersList(reqBody.actPgNum, reqBody.rLimit, obj, callback);
}

const adminUserCreate = (reqBody, file, decodeData, callback) => {
  const tData = decodeData.tokenData;
  if (tData.ut !== 'VRU' || (tData.ut === 'VRU' && reqBody.orgId && reqBody.oCode && reqBody.oName)) {
    if (tData.ut !== 'VRU') {
      const obj = AdminUsersDaoImpl.getAdminUsersCountExcptBoard(tData);
      AdminUsersDAO.getAdminUsrsCounts(obj, (resObj) => {
        if (resObj.status === '200') {
          const count = resObj.resData.result;
          if (((tData.op == 'Basic' && count < 2) || ((tData.op == 'Standard' || tData.op == 'Advanced') && count < 10) || (tData.op == 'Premium' && count < 15))) {
            createAdminUsr(reqBody, file, tData, callback);
          } else {
            const ad = SetRes.accessDenied([]);
            callback(ad);
          }
        } else {
          createAdminUsr(reqBody, file, tData, callback);
        }
      })
    } else {
      createAdminUsr(reqBody, file, tData, callback);
    }
  } else {
    const rf = SetRes.msdReqFields();
    callback(rf);
  }
}

const updateAdminUser = (reqBody, recordId, tokenData, callback) => {
  const obj = AdminUsersDaoImpl.editAdminUserData(reqBody, recordId, tokenData);
  AdminUsersDAO.updateAdminUserData(obj.query, obj.updateObj, (resObj) => {
    callback(resObj);
    if (resObj.status == '200' && reqBody.ssnFlag) {
      const query = AdminUserLoginDaoImpl.getSsnDataByUserID(recordId);
      AdminUsersLoginDao.adUserSsnMultipleDelete(query, (resObj1) => { });
    }
  });
}

const getAdminUserView = (recordId, reqBody, tData, callback) => {
  const obj = AdminUsersDaoImpl.getAdminUserView(recordId, reqBody, tData);
  AdminUsersDAO.getAdminUserData(obj, callback);
}

const AdminUserStatusUpdate = (reqBody, tokenData, callback) => {
  const obj = AdminUsersDaoImpl.editAdminUserStatusData(reqBody, tokenData);
  AdminUsersDAO.updateAdminUserData(obj.query, obj.updateObj, (resObj) => {
    callback(resObj);
    if (resObj.status == '200' && reqBody.status == 'Inactive') {
      const data = Object.assign({}, resObj.resData.result.toObject());
      const query = AdminUserLoginDaoImpl.getSsnDataByUserID(data._id);
      AdminUsersLoginDao.adUserSsnMultipleDelete(query, (resObj1) => { });
    }
  });
}

const AdminUserPwsdChange = (reqBody, tokenData, callback) => {
  const obj = AdminUsersDaoImpl.editAdminUserPwsdChange(reqBody, tokenData);
  AdminUsersDAO.updateAdminUserData(obj.query, obj.updateObj, callback);
}
const getAdminUsersCount = (orgId, tData, callback) => {
  const obj = AdminUsersDaoImpl.getAdminUsersCountByOrgId(orgId);
  AdminUsersDAO.getAdminUsrsCounts(obj, callback);
}

const getAdminUsersAgentList = (reqBody, tokenData, callback) => {
  const obj = AdminUsersDaoImpl.getAdminUsersAgentList();
  AdminUsersDAO.getAdminUsersAgentList(obj, callback);
}

const getAdminUsrsTotalList = (reqBody, tData, callback) => {
  const obj = AdminUsersDaoImpl.totalListQuery(reqBody, tData);
  AdminUsersDAO.getAdminUsrsTotalList(obj, callback);
}

module.exports = {
  getAdminUsersList, adminUserCreate, updateAdminUser, getAdminUserView, AdminUserStatusUpdate,
  AdminUserPwsdChange, getAdminUsersCount, getAdminUsersAgentList, getAdminUsrsTotalList
};

const createAdminUsr = (reqBody, file, tokenData, callback) => {
  AdminUsersDaoImpl.setUserData(reqBody, file, tokenData, (obj) => {
    const createUsrData = new AdmnUsrs(obj);
    AdminUsersDAO.createUser(createUsrData, (resObj) => {
      const data = resObj.resData.result;
      if (data && data._id) {
        const sucess = SetRes.successRes(data);
        callback(sucess);
      } else if (resObj.status == '101') {
        callback(resObj);
      } else {
        const noData = SetRes.createFailed({});
        callback(noData);
      }
    });
  });
}