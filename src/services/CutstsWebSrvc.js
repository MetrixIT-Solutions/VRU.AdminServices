/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsWebDaosImpl = require('../daosimplements/CustsWebDaosImpl');
const CustsWebDaos = require('../daos/CustsWebDaos');
const CustsUsers = require('../schemas/CustsUsers');
const CustsTableBookings = require('../schemas/CustsTableBookings');
const CustsWebSrvcImpl = require('./CustsWebSrvcImpl');
const CustsTableBookingsConfirmed = require('../schemas/CustsTableBookingsConfirmed');
const CustsContacts = require('../schemas/CustsContacts');
const AdminOrgDaosImpl = require('../daosimplements/AdminOrgsDaoImpl');
const AdminOrgsDao = require('../daos/AdminOrgsDao');
const DashbrdAnltcsSrvc = require('../services/DashbrdAnltcsSrvc');

const getCustsBranchesList = (reqBody, callback) => {
  const query = CustsWebDaosImpl.getCustsBranchesList(reqBody);
  CustsWebDaos.getCustsBranchesList(query, callback);
};

const createCateringSrvc = (reqBody, callback) => {
  const query = CustsWebDaosImpl.getBranchQuery(reqBody);
  CustsWebDaos.getCustsBranchData(query, bRes => {
    if (bRes.status == '200') {
      const bData = bRes.resData.result;
      reqBody['orgId'] = bData.orgId;
      const query = CustsWebDaosImpl.findUserWithMobNum(reqBody)
      CustsWebDaos.getCustUserData(query, (resObj) => {
        if (resObj.status == '200') CustsWebSrvcImpl.cateringSrvcCreate(reqBody, resObj.resData.result, bData, callback);
        else {
          const query1 = CustsWebDaosImpl.postCustUserSignupCreate(reqBody, {}, bData);
          const createObj = new CustsUsers(query1);
          CustsWebDaos.commonCreateFunc(createObj, (resObj1) => {
            if (resObj1.status == '200') CustsWebSrvcImpl.cateringSrvcCreate(reqBody, resObj1.resData.result, bData, callback);
            else callback(resObj1);
          })
        }
      });
    } else callback(bRes);
  });
}

const createCustsContact = (reqBody, callback) => {
  const query = CustsWebDaosImpl.getBranchQuery(reqBody);
  CustsWebDaos.getCustsBranchData(query, bRes => {
    if (bRes.status == '200') {
      const obj = CustsWebDaosImpl.createCustsContact(reqBody, bRes.resData.result);
      const createObj = new CustsContacts(obj);
      CustsWebDaos.commonCreateFunc(createObj, (resObj) => {
        if (resObj.status == '200') {
          CustsWebSrvcImpl.contactUsMail(reqBody,  bRes.resData.result.emID);
          callback(resObj);
        } else {
          callback(resObj)
        }
      });
    } else {
      callback(bRes)
    }
  });
};

const getCustsOffersList = (reqBody, callback) => {
  const query = CustsWebDaosImpl.getCustsOffersList(reqBody);
  CustsWebDaos.getCustsOffersList(query, callback);
};

const createTableBkg = (reqBody, tData, callback) => {
  const query = CustsWebDaosImpl.getBranchQuery(reqBody);
  CustsWebDaos.getCustsBranchData(query, bRes => {
    if (bRes.status == '200') {
      const obj = CustsWebDaosImpl.createTableBkg(reqBody, bRes.resData.result, tData);
      const createObj = new CustsTableBookings(obj);
      CustsWebDaos.commonCreateFunc(createObj, (resObj) => {
        if (resObj.status == '200') {
          const createObj = new CustsTableBookingsConfirmed(obj);
          CustsWebDaos.commonCreateFunc(createObj, (resObj1) => { });
          reqBody['orgId'] = bRes.resData.result.orgId;
          const obj2 = CustsWebDaosImpl.updateUserInfoBkngsCount(reqBody);
          CustsWebDaos.updateUserInfoBkngsCount(obj2.query, obj2.updateObj, (resobj2) => { });
          CustsWebSrvcImpl.sendBranchMails(resObj.resData.result, bRes.resData.result.emID, () => { });
          CustsWebSrvcImpl.sendBkngConfirmationSms(reqBody);
          callback(resObj);
          DashbrdAnltcsSrvc.upsertAnltcsFrmBkg(resObj.resData.result, tData, 'create');
        } else callback(resObj);
      });
    } else callback(bRes);
  });
}

const createPrivateDining = (reqBody, callback) => {
  const query1 = CustsWebDaosImpl.getBranchQuery(reqBody);
  CustsWebDaos.getCustsBranchData(query1, bRes => {
    if (bRes.status == '200') {
      const bData = bRes.resData.result;
      reqBody['orgId'] = bData.orgId;
      const query = CustsWebDaosImpl.findUserWithMobNum(reqBody);
      CustsWebDaos.getCustUserData(query, (resObj) => {
         CustsWebSrvcImpl.prvtDngCreate(query, reqBody, bData, resObj, callback);
      });
    } else {
      callback(bRes)
    }
  });
};

const getCustsTableBlckDates = (reqBody, callback) => {
  const query = CustsWebDaosImpl.getCustsTableBlckDates(reqBody);
  CustsWebDaos.getCustsTableBlckDates(query, callback);
};

const postCustUserSignupCreate = (reqBody, res, callback) => {
  const query = CustsWebDaosImpl.getBranchQuery(reqBody);
  CustsWebDaos.getCustsBranchData(query, bRes => {
    if (bRes.status == '200') {
      const bData = bRes.resData.result;
      reqBody['orgId'] = bData.orgId
      const query = CustsWebDaosImpl.findUserWithMobNum(reqBody);
      CustsWebDaos.getCustUserData(query, (resObj) => {
        if (resObj.status == '200') {
          CustsWebSrvcImpl.existingCustomer(reqBody, res, resObj.resData.result, callback);
        } else if (resObj.status == '204') {
          CustsWebSrvcImpl.postCustUserSignupCreate(reqBody, res, bData, callback);
        } else callback(resObj);
      });
    } else {
      callback(bRes);
    }
  });

}

const postCustUserLoginVerifyOtp = (reqBody, tData, vrucutoken, res, callback) => {
  const query = CustsWebDaosImpl.getBranchQuery(reqBody);
  CustsWebDaos.getCustsBranchData(query, bRes => {
    if (bRes.status == '200') {
      const bData = bRes.resData.result;
      tData['userID'] = tData.mp;
      const query = CustsWebDaosImpl.findUserWithMobNum(tData);
      CustsWebDaos.getCustUserData(query, (uResObj) => {
        if (uResObj.status === '200') {
          CustsWebSrvcImpl.verifyLoginOtp(uResObj.resData.result, reqBody.otpNum, query, vrucutoken, res, callback);
        } else callback(uResObj);
      });
    } else {
      callback(bRes);
    }
  });
}



const postCustUserFeedbackCreate = (reqBody, callback) => {
  const query = CustsWebDaosImpl.getBranchQuery(reqBody);
  CustsWebDaos.getCustsBranchData(query, bRes => {
    if (bRes.status == '200') {
      const bData = bRes.resData.result;
      reqBody['orgId'] = bData.orgId;
      const query = CustsWebDaosImpl.findUserWithMobNum(reqBody);
      CustsWebDaos.getCustUserData(query, (resObj) => {
        if (resObj.status == '200') {
          const createObj = CustsWebDaosImpl.setFeedbackDataWithUserData(reqBody, resObj.resData.result, bData);
          CustsWebSrvcImpl.createFunct(createObj, callback);
        } else if (resObj.status == '204') {
          const createObj = CustsWebDaosImpl.setFeedbackDataWithOutUserData(reqBody, bData);
          CustsWebSrvcImpl.createFunct(createObj, callback);
        } else {
          callback(resObj);
        }
      });
    } else callback(bRes);
  });
}

const postCustUserFranchiseCreate = (reqBody, callback) => {
  const query = CustsWebDaosImpl.getBranchQuery(reqBody);
  CustsWebDaos.getCustsBranchData(query, bRes => {
    if (bRes.status == '200') {
      const bData = bRes.resData.result;
      reqBody['orgId'] = bData.orgId;
      const qry = AdminOrgDaosImpl.orgView(bData.orgId);
      AdminOrgsDao.postAdminOrgView(qry, (resObj1) => {
        if (resObj1.status == '200') {
          const orgMail = resObj1.resData.result.emID;
          const query = CustsWebDaosImpl.findUserWithMobNum(reqBody);
          CustsWebDaos.getCustUserData(query, (resObj) => {
            if (resObj.status == '200') {
              const createObj = CustsWebDaosImpl.setFrnchDataWithUserData(reqBody, resObj.resData.result, bData);
              CustsWebSrvcImpl.createFrnch(createObj, orgMail, callback);
            } else if (resObj.status == '204') {
              const createObj = CustsWebDaosImpl.setFrnchDataWithOutUserData(reqBody, bData);
              CustsWebSrvcImpl.createFrnch(createObj, orgMail, callback);
            } else callback(resObj);
          });
        } else callback(resObj1);
      })
    } else callback(bRes);
  });
}

const getRestaurantInformation = (reqBody, callback) => {
  const query = CustsWebDaosImpl.getRestaurantInformation(reqBody);
  CustsWebDaos.getRestaurantInformation(query, resObj => {
    if (resObj.status == '204') {
      const dQry = CustsWebDaosImpl.getRestaurantInformation({});
      CustsWebDaos.getRestaurantInformation(dQry, callback);
    } else callback(resObj);
  });
};

const getSpecialDaysPricingsList = (reqBody, callback) => {
  const query = CustsWebDaosImpl.getSplcDaysPricingList(reqBody);
  CustsWebDaos.getSpclDaysPrcngsList(query, callback);
};

module.exports = {
  getCustsBranchesList, createCateringSrvc, createCustsContact, getCustsOffersList, createTableBkg, createPrivateDining,
  getCustsTableBlckDates, postCustUserSignupCreate, postCustUserLoginVerifyOtp,
  postCustUserFeedbackCreate, postCustUserFranchiseCreate, getRestaurantInformation, getSpecialDaysPricingsList
};
