/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const AdminUsersDao = require('./daos/AdminUsersDao');
const AdmnUserLoginDaoImpl = require('./daosimplements/AdmnUserLoginDaoImpl');
const AdmnUserLoginSrvc = require('./services/AdmnUserLoginSrvc');
const SetRes = require('./SetRes');

var LocalStrategy = require('passport-local').Strategy;

const invalidUsr = 'Invalid User ID / Mobile Number';

// --- Begining of passport
module.exports = (passport) => {

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  passport.use('bbqh-admin-local-login', new LocalStrategy({
    usernameField: 'userID',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, userID, password, callback) => {
    adminUserLogin(req.body, callback);
  }));
};
// --- End of passport

/**
 * @param {Object} reqBody - request body object
 * @param {Function} callback - callback function
 */
const adminUserLogin = (reqBody, callback) => {
  try {
    const query = AdmnUserLoginDaoImpl.setLoginQuery(reqBody);
    AdminUsersDao.getAdminUserData(query, uResObj => {
      if (uResObj.status == '200') {
        AdmnUserLoginSrvc.passportVerifyUserLogin(uResObj.resData.result, reqBody.password, callback);
      } else if (uResObj.status == '204') {
        const ic = SetRes.invalidCredentials(invalidUsr);
        callback(ic);
      } else {
        callback(uResObj);
      }
    });
  } catch (error) {
    logger.error('Unknown Error in src/passport.js, bbqh-admin-local-login: adminUserLogin(catch):' + error);
    const uke = SetRes.unKnownErr({});
    callback(uke);
  }
}