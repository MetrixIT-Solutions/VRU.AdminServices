/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var fs = require('fs');

var config = require('config');
const SetRes = require('../SetRes');
const RestaurantMenu = require('../schemas/RestaurantMenu');
const RstrntMenuDaoImpl = require('../daosimplements/RstrntMenuDaoImpl');
const RstrntMenuDao = require('../daos/RstrntMenuDao');

var logger = require('../lib/logger');
const awsS3bucket = require('../AwsS3Bucket');
const cs = require('../services/CommonSrvc');

const postRstrntMenuItemCreate = (upLoc, uuid, req, files, tData, callback) => {
  const reqBody = JSON.parse(req.body.menuData); const code = req.params.code;
  if (tData.ut !== 'VRU' || (tData.ut === 'VRU' && reqBody.orgId && reqBody.oCode && reqBody.oName)) {
    uploadFilesToS3Bucket(upLoc, uuid, code, files, (resObj) => {
      createMenu(0, upLoc, uuid, code, reqBody, resObj.files, [], tData, callback);
    })
  } else {
    if (files?.length) {
      cs.dltFolder([{ destination: upLoc }]);
    }
    const rf = SetRes.msdReqFields();
    callback(rf);
  }
}

const getRstrntMenuItemsList = (reqBody, tData, callback) => {
  const obj = RstrntMenuDaoImpl.menuList(reqBody, tData);
  RstrntMenuDao.getRstrntMenuItemsList(obj, reqBody.actPgNum, reqBody.rLimit, callback);
}

const postRstrntMenuItemStatusUpdate = (reqBody, tData, callback) => {
  const obj = RstrntMenuDaoImpl.menuStatusUpdate(reqBody, tData);
  RstrntMenuDao.postRstrntMenuItemUpdate(obj.query, obj.updateObj, callback);
}

const postRstrntMenuItemDelete = (reqBody, callback) => {
  const obj = RstrntMenuDaoImpl.menuItemDelete(reqBody.id);
  RstrntMenuDao.postRstrntMenuItemDelete(obj, (resObj) => {
    if (resObj.status == '200') {
      if (reqBody.filePath) {
        deleteFolder(reqBody, {});
      }
    }
    callback(resObj);
  });
}

const postRstrntMenuItemUpdate = async (req, tData, callback) => {
  const reqBody = JSON.parse(req.body.menuData);
  const fileData = req.files.length > 0 ? req.files[0] : {};
  const s3fp = reqBody.code; const type = 'menu-items'; const uuid = req.params.id;
  const uplRes = req.files.length > 0 && await awsS3bucket.awsS3Upload(s3fp, uuid, type);
  uplRes && cs.dltFolder([fileData]);
  var uplLoc = 'assets/files/menu-items/' + uuid;
  const iPath = uplRes ? config.awsS3Bucket + 'vru/menu-items/' + s3fp + '/' + uuid + '/' + fileData.filename : config.apiDomain + uplLoc + '/' + fileData.filename;
  const obj = RstrntMenuDaoImpl.itemUpdate(reqBody, fileData, iPath, tData);
  RstrntMenuDao.postRstrntMenuItemUpdate(obj.query, obj.updateObj, (resObj) => {
    callback(resObj);
    if (resObj.status == '200') {
      if (req.files.length && reqBody.filePath) {
        deleteFolder(reqBody, fileData);
      } else if (!reqBody.icon && reqBody.filePath) {
        deleteFolder(reqBody, {});
      }
    } else {
      if (req.files.length && reqBody.filePath) {
        deleteFolder(reqBody, fileData);
      } else if (!reqBody.icon && reqBody.filePath) {
        deleteFolder(reqBody, {});
      }
    }
  });
}

module.exports = {
  postRstrntMenuItemCreate, getRstrntMenuItemsList, postRstrntMenuItemStatusUpdate,
  postRstrntMenuItemDelete, postRstrntMenuItemUpdate
}

const uploadFilesToS3Bucket = async (upLoc, uuid, code, files, callback) => {
  if (files.length) {
    const s3fp = code;
    const type = 'menu-items';
    const uplRes = await awsS3bucket.awsS3Upload(s3fp, uuid, type);
    const arr = files.map(item => {
      const prfPath = uplRes ? config.awsS3Bucket + `${config.awsS3Cklst}/menu-items/` + s3fp + '/' + uuid + '/' + item.filename : config.apiDomain + upLoc + '/' + item.filename;
      return { path: prfPath, filename: item.filename, originalname: item.originalname, s3: uplRes }
    });
    uplRes && cs.dltFolder([{ destination: upLoc }]);
    callback({ files: arr, s3fp });
  } else {
    callback({ files: [], s3fp: '' });
  }
}

const createMenu = (i, upLoc, uuid, code, reqBody, files, resArray, tData, callback) => {
  const itemData = reqBody.itemData;
  if (i < itemData.length) {
    const data = itemData[i];
    const fileData = files && files.length ? files.find(item => item.originalname == data.fileName) : {};
    const obj = RstrntMenuDaoImpl.createMenuData(reqBody, data, fileData, tData);
    const createObj = new RestaurantMenu(obj);
    RstrntMenuDao.commonCreateFunc(createObj, (resObj) => {
      if (resObj.status == '200') {
        resArray.push(resObj.resData.result);
        createMenu(i + 1, upLoc, uuid, code, reqBody, files, resArray, tData, callback)
      } else {
        logger.error('Un-konwn Error in daos/RstrntMenuSrvc.js, at createMenu:' + resObj.resData.message);
        createMenu(i + 1, upLoc, uuid, code, reqBody, files, resArray, tData, callback)
      }
    })
  } else {
    if (resArray && resArray.length) {
      const resData = SetRes.successRes(resArray);
      callback(resData)
    } else {
      const cf = SetRes.createFailed({});
      callback(cf);
      if (files && files.length) {
        const s3Files = files.filter(item => item.s3 == true);
        if (s3Files.length) s3Files.forEach(async (item) => await awsS3bucket.awsS3Delete(code + '/' + uuid + '/' + item.filename));
        else cs.dltFolder([{ destination: upLoc }]);
      }
    }
  }
}

const deleteFolder = (reqBody, file) => {
  if (reqBody.filePath.includes(config.awsS3Bucket)) {
    const exPath = reqBody.filePath.split(`${config.awsS3Cklst}/menu-items/`);
    exPath.length > 1 && awsS3bucket.awsS3Delete(`${config.awsS3Cklst}/menu-items/${exPath[1]}`);
  } else if (reqBody.filePath.includes(config.lclPath)) {
    const extpath = reqBody.filePath.split('assets');
    const path = 'assets' + extpath[1];
    if (file) {
      if (fs.existsSync(path))
        fs.unlink(path, (err) => {
          err && logger.error('Un-Known Error in services/EuIntrvwsSrvcImpls.js, at updateIntrvwImage - fs.unlink:' + err);
        });
    } else {
      const path1 = extpath.length > 1 ? [{ destination: path }] : '';
      path1 && cs.dltFolder(path1);
    }
  }
}