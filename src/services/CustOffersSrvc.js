/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const config = require('config');

const CustsOffers = require('../schemas/CustsOffers');
const CustOffersDaoImpl = require('../daosimplements/CustOffersDaoImpl');
const CustOffersDao = require('../daos/CustOffersDao');
const CustOffersSrvcImpl = require('../services/CustOffersSrvcImpl');

const postOffersUpdate  = () => {
  const qry = CustOffersDaoImpl.getOffersData();
  CustOffersDao.getOffersData(qry, (resObj) => {
    resObj.status === '200' && UpdateOfferStatusToInActv(0, resObj.resData.result, (resObj) => {});
  });
}

const postCustOffersList = (reqBody, tData, callback) => {
  const qry = CustOffersDaoImpl.custOfrsQry(reqBody, tData);
  CustOffersDao.getCustOfrsList(qry, reqBody, callback);
}

const postCustOffersCreate = (reqBody, tData, callback) => {
  if (tData.ut !== 'VRU' || (tData.ut === 'VRU' && reqBody.orgId && reqBody.oCode && reqBody.oName)) {
    const crtObj = CustOffersDaoImpl.setCustOffers(reqBody, tData);
    const data = new CustsOffers(crtObj);
    CustOffersDao.createData(data, callback);
    CustOffersSrvcImpl.sendOfferCreateEmail(data);
  } else {
    const rf = SetRes.msdReqFields();
    callback(rf);
  }
}

const postCustOffersUpdate = (reqBody, tData,  callback) => {
  if (tData.ut !== 'VRU' || (tData.ut === 'VRU' && reqBody.orgId && reqBody.oCode && reqBody.oName)) {
    const qry = CustOffersDaoImpl.custOfrsViewQry(reqBody, tData);
    const updObj = CustOffersDaoImpl.setOfrsUpdObj(reqBody, tData);
    CustOffersDao.custOfrsUpdate(qry, updObj, callback);
    // CustOffersSrvcImpl.sendOfferUpdateEmail(updObj);
  } else {
    const rf = SetRes.msdReqFields();
    callback(rf);
  }
}

const postCustOffersStsUpdate = (reqBody, tData,  callback) => {
  const qry = CustOffersDaoImpl.custOfrsViewQry(reqBody, tData);
  const updObj = CustOffersDaoImpl.setOfrsStsUpdObj(reqBody, tData);
  CustOffersDao.custOfrsUpdate(qry, updObj, resObj => {
    CustOffersSrvcImpl.sendOfferStsUpdateEmail(resObj.resData.result);
    callback(resObj);
  });
}

const postCustOffersDelete = (reqBody, tData,  callback) => {
  const bOfr = CustOffersDaoImpl.custBOfrsQry(reqBody, tData);
  CustOffersDao.custBkngCount(bOfr, resObj => {
    if(resObj.status == '202') {
      callback(resObj);
    } else if (resObj.status == '204') {
      CustOffersSrvcImpl.deleteCustOffers(reqBody, tData, callback);
    } else {
      callback(resObj);
    }
  });
}
module.exports = {
  postOffersUpdate, postCustOffersList, postCustOffersCreate, postCustOffersUpdate, 
  postCustOffersStsUpdate, postCustOffersDelete
};

const UpdateOfferStatusToInActv = (i, resData, callback) => {
  if(i < resData.length){
    const data = resData[i];
    const reqBody = {id: data._id, oStatus: 'Inactive'};
    const qry = CustOffersDaoImpl.custOfrsViewQry(reqBody, tData);
    const tData = {iss: config.vruId, un: 'Superadmin'}
    const updObj = CustOffersDaoImpl.setOfrsStsUpdObj(reqBody, tData);
    CustOffersDao.custOfrsUpdate(qry, updObj, (resObj) => {
      UpdateOfferStatusToInActv(i + 1, resData, callback);
    });
  } else {
    callback('');
  }
}