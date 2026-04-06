/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const config = require('config');
var { v4: uuidv4 } = require('uuid');
var moment = require('moment');

const AdminOrgs = require('../schemas/AdminOrgs');
const AdminOrgsDao = require('../daos/AdminOrgsDao');
const CommonSrvc = require('../services/CommonSrvc');
const AdUsersDao = require('../daos/AdminUsersDao');
const AdOrgsOnBrdngDaoImpl = require('../daosimplements/AdminOrgsOnBoardingDaoImpl');
const AdminUsers = require('../schemas/AdminUsers');
const logger = require('../lib/logger');
const AdmnUserLoginDaoImpl = require('../daosimplements/AdmnUserLoginDaoImpl');
const AdminUsersLoginDao = require('../daos/AdminUsersLoginDao');
const tokens = require('../tokens');
const Mail = require('../../config/mail');
const roles = require('../../config/roles.json');
const AdUserRoles = require('../schemas/AdUserRoles');
const AdUserRolesDao = require('../daos/AdminuRolesDaos');
const AdUserRolesDaoImpl = require('../daosimplements/AdminuRolesDaosImpl'); 
const SetRes = require('../SetRes');
const AdUserSsns = require('../schemas/AdUserSsns');

const sendOnBrdngRqstMail = (reqBody) => {
let mailSub = 'Confirmation of Onboarding Request Receipt';

let htmlContent = `
  <p>Hi <b>${reqBody.cPerson || 'there'},</b></p>

  <p>Thanks for submitting the onboarding request.It's now <b>pending approval</b>. No action is required from you right now.</p>

  <p>As soon as it's approved, you’ll receive an email with your login credentials and the steps to get started.</p>

  <p>For any questions in the meantime, please contact 
  <a href="mailto:${config.contactMail}">${config.contactMail}</a>.
  </p>

  <p><b>Note:</b> This is a system-generated email. Please do not reply to this message.</p>

  <p>Regards,<br/><b>V Reserve U Team</b></p>
`;

  Mail.sendEMail(reqBody.emID, mailSub, htmlContent, (err, resObj) => { });
};

const createOrg = (resData, res, devInfo, tData) => {
  const curUtc = CommonSrvc.currUTCObj();
  const num = curUtc.currUTCDtTmNum;
  const createObj1 = new AdminOrgs({ ...resData, oStatus: 'Active', cDtNum: num, uDtNum: num });
  AdminOrgsDao.postAdminOrgCreate(createObj1, (resObj) => { });
  const obj = AdOrgsOnBrdngDaoImpl.setUserData(resData);
  const uObj = new AdminUsers(obj);
  AdUsersDao.createUser(uObj, (resObj1) => {
    if (resObj1.status == '200') {
      rolesCreate(resData);
      sendMail(resData, resObj1.resData.result, devInfo)
    } 
  });
}

const sendRejectedMail = (resData) => {
  let mailSub = 'Access Onboarding Request — Declined';

  let htmlContent = `
  <p>Hi <b>${resData.cPerson || 'there'},</b></p>

  <p>Thank you for your interest in <b>V Reserve U - ${resData.oPlan}</b> plan. After careful consideration, we're unable to move forward with the onboarding at this time.</p>

  <p>If you have any questions or would like to discuss further, please contact 
  <a href="mailto:${config.contactMail}>${config.contactMail}</a> 
  </p>

  <p>For any questions in the meantime, please contact 
  <a href="mailto:${config.contactMail}">${config.contactMail}</a>.
  </p>

  <p><b>Note:</b> This is a system-generated email. Please do not reply to this message.</p>

  <p>Regards,<br/><b>V Reserve U Team</b></p>
`;
  Mail.sendEMail(resData.emID, mailSub, htmlContent, (err, resObj) => {});
};


module.exports = {
  sendOnBrdngRqstMail, createOrg, sendRejectedMail
}

const sendMail = (resData, uRes, devInfo) => {
  const token = CommonSrvc.generateAccessToken();
  if (token) {
    const obj = AdmnUserLoginDaoImpl.setSessionData(uRes, devInfo, token);
    const crObj = new AdUserSsns(obj);
    AdminUsersLoginDao.createAdUserSsnData(crObj, (resObj) => {
      if (resObj.status == '200') {
        sendPasswrdEmail(resData, resObj.resData.result._id);
      }
    })
  } 
}

const sendPasswrdEmail = (resData, id) => {
  const email = resData.emID;
  const mailSub = 'Access Approval & Credential Issuance';
  const link = config.uiAdminDomain + 'org/admin/set-password/' + id;
  const aprvd = resData.aprvdDtStr ? moment(resData.aprvdDtStr, "YYYY-MM-DD hh:mm A").format("DD MMM YYYY"): "";
  let mailContent = `
  <p>Hi <b>${resData.cPerson || 'there'},</b></p>

  <p>Your request for <b>${resData.oPlan}</b> access has been <b>approved</b> as of <b>${aprvd || 'today'}</b>.</p>

  <p><b>Account Details:</b></p>
  <ul>
    <li><b>User ID / Email:</b> ${email || 'N/A'}</li>
    <li><b>Set password link:</b> <a target="_blank" href="${link}">Click here</a> or ${link} (valid for 24 hours)</li>
    <li><b>Login URL:</b> <a href=${config.uiAdminDomain}>${config.uiAdminDomain}</a></li>
    <li><b>Assigned role(s): </b>Admin</li>
  </ul>

  <p><b>Required Actions:</b></p>
  <ol>
    <li>Set your password.</li>
    <li>Sign in with the above.</li>
    <li>Re-login to confirm access to <b>Admin</b>.</li>
  </ol>

  <p>For any questions, please contact 
  <a href="mailto:${config.contactMail}">${config.contactMail}</a>.
  </p>

  <p><b>Note:</b> This is a system-generated email. Please do not reply to this message.</p>

  <p>Regards,<br/><b>V Reserve U Team</b></p>
`;
  Mail.sendEMail(email, mailSub, mailContent, (err, resObj) => { });
}

const sendApproveMail = (resData) => {
  let mailSub = 'V Reserve U - Onboarding Approve';
  let htmlContent = `
  <p>Hello ${resData.cPerson || 'there'},</p>
  <p>Your organization <b>${resData.oName}</b> has been Approved for <b>${resData.oPlan}</b> plan under <b>${resData.obType}</b> business type.</p>

  <p>Thank you for Onboarding with <b>V Reserve U</b>.</p>
  <p>Regards<br/><b>V Reserve U</b></p>
`;
  Mail.sendEMail(resData.emID, mailSub, htmlContent, (err, resObj) => { });
}

const rolesCreate = (resData) => {
  for (const role of roles) {
    const obj = AdOrgsOnBrdngDaoImpl.setRolesData(resData, role);
    const newRole = new AdUserRoles({ ...obj, _id: uuidv4() });
    AdUserRolesDao.postAdminUsrRlsCreate(newRole, (roleRes) => { });
  }
}
