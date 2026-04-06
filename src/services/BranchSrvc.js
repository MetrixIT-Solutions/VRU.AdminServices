/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const AdminBranches = require('../schemas/AdminBranches');
const BranchDaoImpl = require('../daosimplements/BranchDaoImpl');
const BranchDao = require('../daos/BranchDao');
const RestaurantInfos = require('../schemas/RestaurantInfos');
const SetRes = require('../SetRes');
const AdminEntisDao = require('../daos/AdminEntisDao ');
const AdminUsersDaoImpl = require('../daosimplements/AdminUsersDaoImpl');
const AdminUsersDao = require('../daos/AdminUsersDao');
const AdminUsersLoginDao = require('../daos/AdminUsersLoginDao');
const CommonFileForNms = require('./CommonFileForNms');

const postBbqhBranchList = (reqBody, tData, callback) => {
  const qry = BranchDaoImpl.userBrncQhry(reqBody, tData);
  BranchDao.getBrnchList(qry, reqBody, callback);
}

const postBbqhBranchCreate = (reqBody, tData, callback) => {
  if(tData.ut !== 'VRU' || (tData.ut === 'VRU' && reqBody.orgId && reqBody.oCode && reqBody.oName)) {
    const brnchData = BranchDaoImpl.admnBranchCreateData(reqBody, tData);
    // const rstObj = BranchDaoImpl.setResturantObj(reqBody, brnchData._id, tData);
    const data = new AdminBranches(brnchData);
    // const rstData = new RestaurantInfos(rstObj);
    // BranchDao.createData(rstData, resObj => {});
    BranchDao.createData(data, (resObj2) => {
      callback(resObj2);
      if(resObj2.status == '200') {
        // callback(resObj2);
        if(reqBody.bFlag){
          const data = resObj2.resData.result;
          const obj = BranchDaoImpl.getRestaurantId(data, reqBody, tData, 'create');
          AdminEntisDao.postAdminEntiCountUpdate(obj.query, obj.updateObj, (resObj1) => {
          });
        }
      }else {
        callback(resObj2);
      }
    });
    // BranchDao.createData(rstData, resObj => {});
  } else {
    const rf = SetRes.msdReqFields();
    callback(rf);
  }
}

const postBbqhBranchUpdate = (reqBody, tData, callback) => {
  const qry = BranchDaoImpl.admnBranchView(reqBody, tData);
  const uObj = BranchDaoImpl.setAdmnBranchUpdate(reqBody, tData);
  BranchDao.branchUpdate(qry, uObj, (resObj) => {
    callback(resObj);
    if (reqBody.bFlag) {
      const data = resObj.resData.result;
      const obj = BranchDaoImpl.getRestaurantId(data, reqBody, tData, 'update');
      AdminEntisDao.postAdminEntiCountUpdate(obj.query, obj.updateObj, (resObj1) => {
        const obj1 = BranchDaoImpl.getRestaurantId(data, reqBody, tData, 'pull');
        AdminEntisDao.postAdminEntiCountUpdate(obj1.query, obj1.updateObj, (resObj1) => { });
        CommonFileForNms.updateNamesInAllColls(reqBody.id, reqBody, 'branch');
      });
    }
  });
}

const postBbqhAllBranchList = (reqBody, tData, callback) => {
  const qry = BranchDaoImpl.ofrsBrnchQry(reqBody, tData);
  BranchDao.getAllBrnchList(qry, callback);
}

const getAdminBranchTotalList = (reqBody, tData, callback) => {
  if (tData.ut == 'Entity') {
    const query = BranchDaoImpl.branchesTotalList(reqBody, tData);
    BranchDao.getAdminBranchTotalList(query, callback);
  } else {
    const noData = SetRes.noData([]);
    callback(noData);
  }
}

const postBbqhBranchStatusUpdate = (reqBody, tData, callback) => {
  const qry = BranchDaoImpl.admnBranchView(reqBody, tData);
  const upObj = BranchDaoImpl.statusUpdate(reqBody, tData);
  BranchDao.branchUpdate(qry, upObj, (resObj) => {
    callback(resObj);
    if (resObj.status == '200') {
      const qry = AdminUsersDaoImpl.updateOEBStatus('branch', reqBody.id, reqBody.bStatus, tData);
      AdminUsersDao.updateMultipleAdminUsersData(qry.obj, qry.upObj, (resObj1) => { });
      if (reqBody.bStatus == 'Inactive') {
        AdminUsersLoginDao.adUserSsnMultipleDelete(qry.obj, (resObj1) => { });
      }
    }
  });
}

module.exports = {
  postBbqhBranchList, postBbqhBranchCreate, postBbqhBranchUpdate, postBbqhAllBranchList,
  getAdminBranchTotalList, postBbqhBranchStatusUpdate
}