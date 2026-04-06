/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustUsersDaoImpl = require('../daosimplements/CustUsersDaoImpl');
const CustUsersDao = require('../daos/CustUsersDao');

const postCustusersList = (reqBody, tData, callback) => {
  const qry = CustUsersDaoImpl.userListQry(reqBody, tData);
  CustUsersDao.getCustUsersList(qry, reqBody, callback);
}

const postCustuserView = (reqBody, tData, callback) => {
  const qry = CustUsersDaoImpl.userViewQry(reqBody, tData);
  CustUsersDao.postCustuserView(qry, callback);
}

module.exports = {
  postCustusersList, postCustuserView
};
