/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');
const config = require('config');

const AdminOrgsDaoImpl = require('../daosimplements/AdminOrgsDaoImpl');
const AdminOrgsDao = require('../daos/AdminOrgsDao');
const SetRes = require('../SetRes');
const AdminUserLoginDaoImpl = require('../daosimplements/AdmnUserLoginDaoImpl');
const AdminUsersLoginDao = require('../daos/AdminUsersLoginDao');
const AdminUsersDaoImpl = require('../daosimplements/AdminUsersDaoImpl');
const AdminUsersDao = require('../daos/AdminUsersDao');
const AdminOrgsOnBoardingsDao = require('../daos/AdminOrgsOnBoardingsDao');
const AdminOrgsOnBoardingsLcs = require('../schemas/AdminOrgsOnBoardingsLcs');
const CommonFileForNms = require('./CommonFileForNms');
const cs = require('./CommonSrvc');

const postAdminOrgCreate = async(req, tData, callback) => {
  if (tData.ut == 'VRU') {
    const body = JSON.parse(req.body.orgData);
    const files = req.files || [];
    const type = 'orgentitylogos';
    const filePaths = {};
    Object.keys(files).forEach(key => {
      filePaths[key] = files[key].map(file => {
        const finalName = buildOrgFileName(req.params.ocode, key, file.originalname);
        return {
          originalname: file.originalname,
          icon: finalName,
          path: `${config.apiDomain}assets/files/${type}/${finalName}`
        };
      });
    });
    const orgObj = AdminOrgsDaoImpl.orgCreateData(body, filePaths, tData);
    AdminOrgsDao.postAdminOrgCreate(orgObj.org, callback);
    AdminOrgsDao.postAdminOrgCreate(orgObj.oob, resObj1 => {});
    AdminOrgsDao.postAdminOrgCreate(orgObj.oobLc, resObj2 => {});
  } else {
    const cF = SetRes.accessDenied({});
    callback(cF);
  }
}

const getAdminOrgsList = (reqBody, tData, callback) => {
  if (tData.ut == 'VRU') {
    const obj = AdminOrgsDaoImpl.orgsList(reqBody);
    AdminOrgsDao.getAdminOrgsList(obj, reqBody.actPgNum, reqBody.rLimit, callback);
  } else {
    let resultObj = { orgsListCount: 0, orgsList: [] };
    const noData = SetRes.noData(resultObj);
    callback(noData);
  }
}

const postAdminOrgView = (reqBody, tData, callback) => {
  if (tData.ut == 'VRU') {
    const obj = AdminOrgsDaoImpl.orgView(reqBody.id);
    AdminOrgsDao.postAdminOrgView(obj, callback);
  } else {
    const noData = SetRes.noData({});
    callback(noData);
  }
}

const postAdminOrgStatusUpdate = (reqBody, tData, callback) => {
  if (tData.ut == 'VRU') {
    const query = AdminOrgsDaoImpl.orgView(reqBody.id);
    const updateObj = AdminOrgsDaoImpl.orgStatusUpdate(reqBody, tData);
    AdminOrgsDao.postAdminOrgUpdate(query, updateObj, (resObj) => {
      callback(resObj);
      if (resObj.status == '200') {
        const qry = AdminUsersDaoImpl.updateOEBStatus('org', reqBody.id, reqBody.status, tData);
        AdminUsersDao.updateMultipleAdminUsersData(qry.obj, qry.upObj, (resObj1) => {});
        if (reqBody.status == 'Inactive') {
          AdminUsersLoginDao.adUserSsnMultipleDelete(qry.obj, (resObj1) => { });
        }
      }
    });
  } else {
    const uf = SetRes.updateFailed({});
    callback(uf);
  }
}

const postAdminOrgUpdate = async (req, tData, callback) => {
  if (tData.ut == 'VRU') {
    const body = JSON.parse(req.body.orgData);
    const query = AdminOrgsDaoImpl.orgView(body.id);
    const files = req.files || [];
    const type = 'orgentitylogos';
    const filePaths = {};
    Object.keys(files).forEach(key => {
      filePaths[key] = files[key].map(file => {
        const finalName = buildOrgFileName(req.params.ocode, key, file.originalname);
        return {
          originalname: file.originalname,
          icon: finalName,
          path: `${config.apiDomain}assets/files/${type}/${finalName}`
        };
      });
    });
    const updateObj = AdminOrgsDaoImpl.orgUpdate(body, filePaths, tData);
    AdminOrgsDao.postAdminOrgUpdate(query, updateObj, (resObj) => {
      callback(resObj);
      if (resObj.status == '200') {
        AdminOrgsOnBoardingsDao.putAdminOrgsOnBrdngUpdate(query, updateObj, (resObj1) => {
          if (resObj.status == '200') {
            const data = Object.assign({}, resObj1.resData.result.toObject());
            const createObj1 = new AdminOrgsOnBoardingsLcs({ ...data, orgId: data._id, _id: uuidv4() });
            AdminOrgsOnBoardingsDao.postAdminOrgsOnBrdngCreate(createObj1, (resObj1) => { });
          }
        });
      };
      body.orgsFlag && CommonFileForNms.updateNamesInAllColls(body.id, body, 'org');
      if (!body.icon && body.filePath) {
        deleteFolder({ filePath: body.filePath });
      }
      if (!body.ficon && body.fFilePath) {
        deleteFolder({ filePath: body.fFilePath });
      }
    });
  } else {
    const uf = SetRes.updateFailed({});
    callback(uf);
  }
}

const getAdminOrgsTotalList = (reqBody, tData, callback) => {
  if (tData.ut == 'VRU') {
    const query = AdminOrgsDaoImpl.orgsTotalList(reqBody);
    AdminOrgsDao.getAdminOrgsTotalList(query, callback);
  } else {
    const noData = SetRes.noData([]);
    callback(noData);
  }
}

const putAdOrgSubscription = (reqBody, tData, callback) => {
  if (tData.ut == 'VRU') {
    const query = AdminOrgsDaoImpl.orgView(reqBody.id);
    const updateObj = AdminOrgsDaoImpl.orgSubPlanUpdate(reqBody, tData);
    AdminOrgsDao.postAdminOrgUpdate(query, updateObj, (resObj) => {
      callback(resObj);
      if (resObj.status == '200') {
        const data = Object.assign({}, resObj.resData.result.toObject());
        const query = AdminUserLoginDaoImpl.getSsnDataByOrgCode(data.oCode);
        AdminUsersLoginDao.adUserSsnMultipleDelete(query, (resObj1) => {});
        const upObj = AdminUsersDaoImpl.updateOrgPlan(data.oPlan, tData);
        AdminUsersDao.updateMultipleAdminUsersData(query, upObj, (resObj1) => {});
      }
    });
  } else {
    const uf = SetRes.updateFailed({});
    callback(uf);
  }
}

module.exports = {
  postAdminOrgCreate, getAdminOrgsList, postAdminOrgView, postAdminOrgStatusUpdate, postAdminOrgUpdate, getAdminOrgsTotalList, putAdOrgSubscription
};

const buildOrgFileName = (code, fieldname, originalname) => {
  const ext = originalname.split('.').pop();
  if (fieldname === 'icon') {
    return `${code}_Logo.${ext}`;
  }
  if (fieldname === 'favicon') {
    return `${code}_FavIcon.${ext}`;
  }
  return `${code}_${Date.now()}.${ext}`;
};

const deleteFolder = (reqBody, file) => {
  if (reqBody.filePath.includes(config.lclPath)) {
    const extpath = reqBody.filePath.split('assets');
    const path = 'assets' + extpath[1];
    if (file) {
      if (fs.existsSync(path))
        fs.unlink(path, (err) => {
          err && logger.error('Un-Known Error in services/AdminOrgsSrvc.js, at deleteFolder - fs.unlink:' + err);
        });
    } else {
      const path1 = extpath.length > 1 ? [{ destination: path }] : '';
      path1 && cs.dltFolder(path1);
    }
  }
}
