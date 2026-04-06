/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustFranchiseDaoImpl = require('../daosimplements/CustFranchiseDaoImpl');
const CustFranchiseDao = require('../daos/CustFranchiseDao');
const SetRes = require('../SetRes');
const DashbrdAnltcsSrvc = require('./DashbrdAnltcsSrvc');
const AdminOrgDaosImpl = require('../daosimplements/AdminOrgsDaoImpl');
const AdminOrgsDao = require('../daos/AdminOrgsDao');
const Mail = require('../../config/mail');

const postAdminUserFrnchList = (reqBody, tokenData, callback) => {
    const qry = CustFranchiseDaoImpl.userfrnchQry(reqBody, tokenData);
    CustFranchiseDao.getfrnchList(qry, reqBody, callback);
}

const postAdminUserfrnchStsUpdate = (reqBody, tData, callback) => {
  const qry = CustFranchiseDaoImpl.userfrnchViewQry(reqBody, tData);
  const updObj = CustFranchiseDaoImpl.frnchStsUpdObj(reqBody, tData);
  CustFranchiseDao.custfrnchStsUpdate(qry, updObj, (res) => {
    callback(res);
    if (res.status === '200') {
      DashbrdAnltcsSrvc.upsertAnltcsFrmFranchise(res.resData.result, tData, 'status', {fStatus: reqBody.oldStatus});
    }
  }); 
}

const postAdminUserfrnchCountByStatus = (reqBody, tData, callback) => {
  const qry = CustFranchiseDaoImpl.postAdminUserfrnchCountByStatus(reqBody, tData);
  CustFranchiseDao.custFranchiseCommonAggregateFunc(qry, callback);
}

const postAdminUserFrnchCreate = (reqBody, tData, callback) => {
  if (tData.ut === 'VRU' && (!reqBody.orgId || !reqBody.oCode || !reqBody.oName || !reqBody.entId || !reqBody.eName || !reqBody.eCode)) {
    const ad = SetRes.msdReqFields();
    callback(ad);
  } else if (tData.ut === 'Board' && (!reqBody.entId || !reqBody.eName || !reqBody.eCode)) {
    const ad = SetRes.msdReqFields();
    callback(ad);
  } else {
    const newObj = CustFranchiseDaoImpl.setFrnchCreateObj(reqBody, tData);
    CustFranchiseDao.custfrnchCreate(newObj, (resObj) => {
      if (resObj.status === '200') {
        const data = resObj.resData.result;
        const qry = AdminOrgDaosImpl.orgView(data.orgId);
        AdminOrgsDao.postAdminOrgView(qry, (resObj1) => {
          if(resObj1.status == '200'){
            sendFrnchMail(resObj1.resData.result.emID, data);
          }
        });
        DashbrdAnltcsSrvc.upsertAnltcsFrmFranchise(resObj.resData.result, tData, 'create');
      }
      callback(resObj);
    });
  }
}

module.exports = {
  postAdminUserFrnchList, postAdminUserfrnchStsUpdate, postAdminUserfrnchCountByStatus, postAdminUserFrnchCreate
};

const sendFrnchMail = (mailId, data) => {
  const date1 = new Date();
  const month = date1.toLocaleString('en-US', { month: 'long' });
  const date = date1.getDate();
  const yr = date1.getFullYear();
  const smth = month.slice(0, 3);
  let fReq = `<p>Request for: <b>${data.eName}</b></p>`
  let name = `<p>Name: <b>${data.name}</b></p>`;
  let mb = `<p>Mobile #: <b> +91 ${data.mobNum}</b></p>`;
  let em = `<p>Email: <b>${data.emID}</b></p>`;
  let st = ` <p>Streat/Area: <b>${data.fArea}</b></p>`;
  let pnc = `<p>Pincode: <b>${data.fPincode}</b></p>`;
  let ct = `<p>City: <b>${data.fCity}</b></p>`;
  let state = `<p>State: <b>${data.fState}</b></p>`;

  let mailSub = `${data.eName}-FranchiseRequest-${date}${smth}${yr}`;
  let htmlContent = `<p>Hello,</p><p>Following are the Franchise request information: </p> ${fReq} ${name} ${mb}  ${em} ${st} ${pnc} ${ct} ${state}`;
  Mail.sendEMail(mailId, mailSub, htmlContent, (err, resObj) => { });
}