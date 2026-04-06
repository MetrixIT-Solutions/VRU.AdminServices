/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const config = require('config');
var { v4: uuidv4 } = require('uuid');

const CustContactsDaoImpl = require('../daosimplements/CustContactsDaoImpl');
const CustContactsDao = require('../daos/CustContactsDao');
const CustsContacts = require('../schemas/CustsContacts');
const AdminEntiDaoImpl = require('../daosimplements/AdminEntiDaoImpl');
const AdminEntisDao = require('../daos/AdminEntisDao ');
const Mail = require('../../config/mail');
const CustsContactsLfcs = require('../schemas/CustsContactsLfcs');

const postCustContactsList = (reqBody, tData, callback) => {
  const qry = CustContactsDaoImpl.custCntQry(reqBody, tData);
  CustContactsDao.getCustContactsList(qry, reqBody, callback);
}

const postCustContactsStatusUpdate = (reqBody, tData, callback) => {
  const qry = CustContactsDaoImpl.custCntViewQry(reqBody, tData);
  const updObj = CustContactsDaoImpl.setCustCntStsUpdate(reqBody, tData);
  CustContactsDao.custContactsUpdate(qry, updObj, (resObj) => {
    if(resObj.status == '200'){
      const data = Object.assign({}, resObj.resData.result.toObject());
      const obj = { ...data, _id: uuidv4(), cId: data._id, cDtTm: data.uDtTm, cDtStr: data.uDtStr, cDtNum: data.cDtNum };
      const cObj = new CustsContactsLfcs(obj);
      CustContactsDao.commonCreateFunc(cObj, (resObj1) => { });
    };
    callback(resObj);
  });
}

const postCustContactCreate = (reqBody, callback) => {
  const query = AdminEntiDaoImpl.postEntiViewByEntCode(reqBody.eCode);
  AdminEntisDao.postAdminEntisView(query, (resObj) => {
    if (resObj.status == '200') {
      const resData = Object.assign({}, resObj.resData.result.toObject());
      const obj = CustContactsDaoImpl.createCustsContact(reqBody, resData);
      const createObj = new CustsContacts(obj);
      CustContactsDao.commonCreateFunc(createObj, (resObj1) => {
        callback(resObj1);
        if (resObj1.status == '200') {
          sendMail(reqBody, () => { });
          const data = Object.assign({}, resObj1.resData.result.toObject());
          const obj =  {...data, _id: uuidv4(), cId: data._id}
          const cObj = new CustsContactsLfcs(obj);
          CustContactsDao.commonCreateFunc(cObj, (resObj1) => {});
        }
      });
    } else {
      callback(resObj);
    }
  });
};

const getCustContactLfcsList = (id, callback) => {
  const query = CustContactsDaoImpl.custContactLfcsListQry(id);
  CustContactsDao.getCustContactLfcsList(query, callback);
}


module.exports = {
  postCustContactsList, postCustContactsStatusUpdate, postCustContactCreate, getCustContactLfcsList
};

const sendMail = (reqBody, cb) => {
  const eCode = reqBody?.eCode || reqBody?.oCode || 'VRU';
  const eName = reqBody?.eName || reqBody?.oName || 'V Reserve U';
  let mailSub = reqBody?.cType ? `${eCode}-${reqBody?.cType}` : `${eCode}-ContactUs`;
  let htmlContent = `<p>Following are the ${reqBody?.cType ? reqBody?.cType : 'ContactUs'} information: </p>
  <p>Name: <b>${reqBody.name}</b></p>
  <p>Mobile #: <b>${reqBody.mobileNum}</b></p>
  <p>Email: <b>${reqBody.emID}</b></p>
  <p><b>Message</b>: ${reqBody.message}</p>
  <p><b>Note:</b> This is a system-generated email. Please do not reply to this message.</p>
  <p>Regards,<br/><b>${eName} Team</b></p>`;

  Mail.sendEMail(config.contactMail, mailSub, htmlContent, (err, resObj) => {});
  cb();
}
