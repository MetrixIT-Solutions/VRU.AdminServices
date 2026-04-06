/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const config = require('config');

const SetRes = require('../SetRes');
const AdminEntis = require('../schemas/AdminEntities');
const AdminEntiDaoImpl = require('../daosimplements/AdminEntiDaoImpl');
const AdminEntisDao = require('../daos/AdminEntisDao ');
const AdminOrgsDao = require('../daos/AdminOrgsDao');
const AdminOrgsDaoImpl = require('../daosimplements/AdminOrgsDaoImpl');
const AdminUsersDaoImpl = require('../daosimplements/AdminUsersDaoImpl');
const AdminUsersDao = require('../daos/AdminUsersDao');
const AdminUsersLoginDao = require('../daos/AdminUsersLoginDao');
const CommonFileForNms = require('./CommonFileForNms');
const awsS3Bucket = require('../AwsS3Bucket');
const cs = require('./CommonSrvc');

const postAdminEntiCreate = async (req, tData, callback) => {
    const body = JSON.parse(req.body.entData);
  if ((tData.ut !== 'VRU') || (tData.ut === 'VRU' && body.orgId && body.oCode && body.oName)) {
    const files = req.files || [];
    const type = 'orgentitylogos';
    const filePaths = {};
    Object.keys(files).forEach(key => {
      filePaths[key] = files[key].map(file => {
        const finalName = buildOrgFileName(req.params.ecode.toUpperCase(), key, file.originalname);
        return {
          originalname: file.originalname,
          icon: finalName,
          path: `${config.apiDomain}assets/files/${type}/${finalName}`
        };
      });
    });
      const entData = AdminEntiDaoImpl.entiCreateData(body, filePaths, tData);
      const createObj = new AdminEntis(entData);
      AdminEntisDao.postAdminEntiCreate(createObj, (resObj) => {
        callback(resObj);
        if (resObj.status == '200') {
          const data = resObj.resData.result;
          const obj = AdminOrgsDaoImpl.getOrganistionId(data, body, tData, 'create');
          AdminOrgsDao.postAdminOrgUpdate(obj.query, obj.updateObj, () => { });
        }
      });
    } else {
      callback(SetRes.msdReqFields({}));
    }
};


const postAdminEntisList = (reqBody, tData, callback) => {
  const obj = AdminEntiDaoImpl.entisList(reqBody, tData);
  AdminEntisDao.postAdminEntisList(obj, reqBody.actPgNum, reqBody.rLimit, callback);
}

const getAdminEntisListByOrg = (reqBody, tData, callback) => {
  if(tData.ut !== 'VRU' || (tData.ut === 'VRU' && reqBody.orgId)) {
    const obj = AdminEntiDaoImpl.setEntisListByOrgQuery(reqBody, tData);
    AdminEntisDao.getAdminEntisListByOrg(obj.query, obj.sortObj, callback);
  } else {
    const rf = SetRes.msdReqFields();
    callback(rf); 
  }
}

const postAdminEntiView = (reqBody, tData, callback) => {
  const obj = AdminEntiDaoImpl.postEntiView(reqBody, tData);
  AdminEntisDao.postAdminEntisView(obj, callback);
}

const postAdminEntiStatusUpdate = (reqBody, tData, callback) => {
  const obj = AdminEntiDaoImpl.postEntiView(reqBody, tData);
  const updateObj = AdminEntiDaoImpl.entiStatusUpdate(reqBody, tData);
  AdminEntisDao.postAdminEntiUpdate(obj, updateObj, (resObj) => {
    callback(resObj);
    if (resObj.status == '200') {
      const qry = AdminUsersDaoImpl.updateOEBStatus('ent', reqBody.id, reqBody.status, tData);
      AdminUsersDao.updateMultipleAdminUsersData(qry.obj, qry.upObj, (resObj1) => { });
      if (reqBody.status == 'Inactive') {
        AdminUsersLoginDao.adUserSsnMultipleDelete(qry.obj, (resObj1) => { });
      }
    }
  });
}

const postAdminEntiUpdate = async (req, tData, callback) => {
  const reqBody = JSON.parse(req.body.entData);
  const files = req.files || [];
  const type = 'orgentitylogos';
  const filePaths = {};
  Object.keys(files).forEach(key => {
    filePaths[key] = files[key].map(file => {
      const finalName = buildOrgFileName(req.params.ecode.toUpperCase(), key, file.originalname);
      return {
        originalname: file.originalname,
        icon: finalName,
        path: `${config.apiDomain}assets/files/${type}/${finalName}`
      };
    });
  });
  const obj = AdminEntiDaoImpl.postEntiView(reqBody, tData);
  const updateObj = AdminEntiDaoImpl.entiUpdate(reqBody, filePaths, tData);
  AdminEntisDao.postAdminEntiUpdate(obj, updateObj, (resObj) => {
    callback(resObj);
    if (resObj.status == '200' && reqBody.eFlag) {
      const data = resObj.resData.result;
      const obj = AdminOrgsDaoImpl.getOrganistionId(data, reqBody, tData, 'update');
      AdminOrgsDao.postAdminOrgUpdate(obj.query, obj.updateObj, (resObj1) => {
        const obj1 = AdminOrgsDaoImpl.getOrganistionId(data, reqBody, tData, 'pull');
        AdminOrgsDao.postAdminOrgUpdate(obj1.query, obj1.updateObj, (resObj1) => { });
        CommonFileForNms.updateNamesInAllColls(reqBody.id, reqBody, 'ent');
      });
    };
    if (!reqBody.icon && reqBody.filePath) {
      deleteFolder({ filePath: reqBody.filePath });
    }
    if (!reqBody.ficon && reqBody.fFilePath) {
      deleteFolder({ filePath: reqBody.fFilePath });
    }
  });
}

const getAdminEntiTotalList = (reqBody, tData, callback) => {
  if (tData.ut == 'Board') {
    const query = AdminEntiDaoImpl.entisTotalList(reqBody, tData);
    AdminEntisDao.getAdminEntiTotalList(query, callback);
  } else {
    const noData = SetRes.noData([]);
    callback(noData);
  }
}

module.exports = {
  postAdminEntiCreate, postAdminEntisList, getAdminEntisListByOrg, postAdminEntiView,
  postAdminEntiStatusUpdate, postAdminEntiUpdate, getAdminEntiTotalList
}

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
  if (reqBody.filePath.includes(config.awsS3Bucket)) {
    const exPath = reqBody.filePath.split(`${config.awsS3Cklst}/entities/`);
    exPath.length > 1 && awsS3Bucket.awsS3Delete(`${config.awsS3Cklst}/entities/${exPath[1]}`);
  } else if (reqBody.filePath.includes(config.lclPath)) {
    const extpath = reqBody.filePath.split('assets');
    const path = 'assets' + extpath[1];
    if (file) {
      if (fs.existsSync(path))
        fs.unlink(path, (err) => {
          err && logger.error('Un-Known Error in services/AdminEntitiesSrvc.js, at deleteFolder - fs.unlink:' + err);
        });
    } else {
      const path1 = extpath.length > 1 ? [{ destination: path }] : '';
      path1 && cs.dltFolder(path1);
    }
  }
}