/**
 * Copyright (C) Skillworks IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Jan 2023
 */

const SetRes = require('../SetRes');
const cuDaoImpl = require('../daosimplements/CustUsersDaoImpl');
const ccsDaoImpl = require('../daosimplements/CustsCateringSrvcsDaoImpl');
const cuDao = require('../daos/CustUsersDao');
const cbDaoImpl = require('../daosimplements/CustsBookingsDaoImpl');
const CustsUsers = require('../schemas/CustsUsers');
const ccsDao = require('../daos/CustsCateringSrvcsDao');
// const config = require('config');
// const moment = require('moment');
// const toMailsJson = require('../../config/toMails.json');
// const Mail = require('../../config/mail');

//----------------------BEGIN Catering Srvcs Apis----------------------//

const createCateringSrvc = (reqBody, tData, callback) => {
  if (tData.ut === 'VRU' && (reqBody.orgId && reqBody.entId && reqBody.branch)) {
  } else if (tData.ut === 'Board' && (reqBody.entId && reqBody.branch)) {
    reqBody.orgId = tData.oid; reqBody.oName = tData.on; reqBody.oCode = tData.oc;
  } else if (tData.ut === 'Entity' && (reqBody.branch)) {
    reqBody.orgId = tData.oid; reqBody.oName = tData.on; reqBody.oCode = tData.oc;
    reqBody.entId = tData.ent; reqBody.eName = tData.en; reqBody.eCode = tData.ec;
  } else if (tData.ut === 'Branch') {
    reqBody.orgId = tData.oid; reqBody.oName = tData.on; reqBody.oCode = tData.oc;
    reqBody.entId = tData.ent; reqBody.eName = tData.en; reqBody.eCode = tData.ec;
    reqBody.branch = tData.bid; reqBody.bName = tData.bn; reqBody.bCode = tData.bc;
  } else {
    const ma = SetRes.msdReqFields();
    callback(ma);
    return;
  }
  const cuQuery = cuDaoImpl.userViewQry({ mobNum: reqBody.mobileNum, orgId: reqBody.orgId }, tData);
  cuDao.postCustuserView(cuQuery, cuRes => {
    if (cuRes.status === '200' && cuRes.resData && cuRes.resData.result) {
      reqBody.user = cuRes.resData.result._id;
      reqBody.refUID = cuRes.resData.result.refUID;
      const createObj = ccsDaoImpl.createCateringSrvc(reqBody, tData);
      ccsDao.commonCreateFunc(createObj, (resObj) => {
        // resObj.status == '200' && sendMail(reqBody);
        callback(resObj);
      });
    } else {
      const obj = cbDaoImpl.createUser({...reqBody, userID: '+91' + reqBody.mobileNum}, tData);
      const cuObj = new CustsUsers(obj);
      ccsDao.commonCreateFunc(cuObj, (cuResObj) => {
        if (cuResObj.status === '200' && cuResObj?.resData?.result) {
          reqBody.user = cuResObj.resData.result._id;
          reqBody.refUID = cuResObj.resData.result.refUID;
          const createObj = ccsDaoImpl.createCateringSrvc(reqBody, tData);
          ccsDao.commonCreateFunc(createObj, (resObj) => {
            // resObj.status == '200' && sendMail(reqBody);
            callback(resObj);
          });
        } else callback(cuResObj);
      });
    }
  });
}

const getCateringSrvcsList = (reqBody, tData, callback) => {
  const obj = ccsDaoImpl.getCateringSrvcsList(tData, reqBody);
  ccsDao.getCateringSrvcsList(obj, reqBody, callback);
}

const cateringSrvcView = (id, tData, callback) => {
  const query = ccsDaoImpl.cateringSrvcView(id, tData);
  ccsDao.cateringSrvcView(query, callback);
}

const cateringSrvcStatusUpdate = (reqBody, tData, callback) => {
  const obj = ccsDaoImpl.cateringSrvcStatusUpdate(reqBody, tData);
  ccsDao.cateringSrvcUpdate(obj.query, obj.updateObj, callback);
}

const postCustsCateringSrvcUpdate = (reqBody, tData, callback) => {
  const query = ccsDaoImpl.cateringSrvcView(reqBody.id, tData);
  const updateObj = ccsDaoImpl.updateCateringSrvcs(reqBody, tData);
  ccsDao.cateringSrvcUpdate(query, updateObj, callback);
}

//----------------------END Catering Srvcs Apis----------------------//

module.exports = {
  createCateringSrvc, getCateringSrvcsList, cateringSrvcView, cateringSrvcStatusUpdate, postCustsCateringSrvcUpdate
};

// const sendMail = (reqBody) => {
//   const date = moment(reqBody.eDt).format('DD MMM, YYYY');
//   let name = reqBody.name, mobileNum = reqBody.mobNum;
//   let mailSub = `${reqBody.bCode} - Catering Service - ${date}`;
//   const toMails = toMailsJson[reqBody.bCode]?.toMails ? toMailsJson[reqBody.bCode]?.toMails : config.toMails;
//   let htmlContent = `
//         <p>Hello,</p>
//         <h3>You have a Catering service request</h3>
//         <p><strong>Customer:</strong> ${name}</p>
//         <p><strong>Phone #: </strong> +91 ${mobileNum}</b></p>
//         <p><strong>Number Of Persons: </strong> ${reqBody.numPersons} </p>
//         <p><strong>Service For:</strong> ${reqBody.serviceFor}</p>
//         <p><strong>Event Date:</strong> ${date}</p>
//         <p><strong>Event Location:</strong> ${reqBody.eLocation}</p>
//         <p><strong>Occasion:</strong> ${reqBody.occassion}</p>
//         ${reqBody.eInfo ? `<p><strong>Info:</strong> ${reqBody.eInfo}</p>` : ''}`;
//   Mail.sendEMail(toMails, mailSub, htmlContent, (err, resObj) => { });
// }