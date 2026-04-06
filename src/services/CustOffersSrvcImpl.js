/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var moment = require('moment');
const config = require('config');

const CustOffersDaoImpl = require('../daosimplements/CustOffersDaoImpl');
const CustOffersDao = require('../daos/CustOffersDao');
const CustsOffersClsd = require('../schemas/CustsOffersClsd');
const Mail = require('../../config/mail');

const deleteCustOffers = (reqBody, tData, callback) => {
  const qry = CustOffersDaoImpl.custOfrsViewQry(reqBody, tData);
  CustOffersDao.custOfrsDelete(qry, resObj => {
    if (resObj.status == '200') {
      const ofrsClsdObj = CustOffersDaoImpl.setOfferClsdData(resObj.resData.result, tData);
      const data = new CustsOffersClsd(ofrsClsdObj);
      CustOffersDao.createData(data, callback);
      const eCode =  ofrsClsdObj?.eCode || ofrsClsdObj?.oCode || 'VRU';
      const hc = `<p>Following are the offer delete information: </p>`
      const ms = `${eCode}-OfferDelete(${data.coupon})`;
      sendEmailOffer(hc, ms, data);
    } else {
      callback(resObj);
    }
  });
}

const sendOfferCreateEmail = (data) => {
  const hc = `<p>Following are the offer create information: </p>`
  const eCode = data?.eCode || data?.oCode || 'VRU';
  const ms = `${eCode}-OfferCreate(${data.coupon})`;
  sendEmailOffer(hc, ms, data);
}

const sendOfferUpdateEmail = (data) => {
  const hc = `<p>Following are the offer update information: </p>`
  const eCode = data?.eCode || data?.oCode || 'VRU';
  const ms = `${eCode}-OfferCreate(${data.coupon})`;
  sendEmailOffer(hc, ms, data);
}

const sendOfferStsUpdateEmail = (data) => {
  const hc = `<p>Following are the offer status update information: </p>`
  const eCode = data?.eCode || data?.oCode || 'VRU';
  const ms = `${eCode}-OfferCreate(${data.coupon})`;
  sendEmailOffer(hc, ms, data);
}

module.exports = {
  deleteCustOffers, sendOfferCreateEmail,  sendOfferUpdateEmail, sendOfferStsUpdateEmail
}

const sendEmailOffer = (hc, ms, data) => {
  const date1 = new Date();
  const month = date1.toLocaleString('en-US', { month: 'long' });
  const date = date1.getDate();
  const yr = date1.getFullYear();
  const sDate = moment(data.sDt).format('D MMM, YYYY');
  const eDate = moment(data.eDt).format('D MMM, YYYY');
  const smth = month.slice(0, 3);
  let ot = `<p>Offer Type: <b>${data.oType}</b></p>`
  let cpn = `<p>Coupon: <b>${data.coupon}</b></p>`
  let tlte = `<p>Title: <b>${data.title}</b></p>`
  let mb = data.oType == 'Min Booking Value' ? `<p>Min Booking: <b>${data.minbValue}/-</b></p>` : '';
  let mm = data.oType == 'Min Members' ? `<p>Min Members: <b>${data.minMem}</b></p>` : '';
  let disc = data.oType == 'Percentage' ? `<p>Disc(%): <b>${data.dp}</b></p>` : '';
  let amt = `<p>Amount: <b>${data.amount}/-</b></p>`
  let oSD = `<p>Start Date: <b>${sDate}</b></p>`
  let oED = `<p>End Date: <b>${eDate}</b></p>`
  let sts = `<p>Status: <b>${data.oStatus}</b></p>`
  let desc = `<p>Description: <b>${data.desc}</b></p>`
  let mailSub = `${ms}-${date}${smth}${yr}`;
  let note = `<p><b>Note:</b> This is a system-generated email. Please do not reply to this message.</p>`
  const eName = data?.eName || data?.oName || 'V Reserve U';
  let regards = `<p>Regards,<br/><b>${eName} Team</b></p>`;
  let htmlContent = `${hc} ${ot} ${cpn} ${tlte} ${mb} ${mm} ${disc} ${amt} ${oSD} ${oED} ${sts} ${desc} ${note} ${regards}`;
  Mail.sendEMail(config.toMails, mailSub, htmlContent, (resObj3) => { });
}
