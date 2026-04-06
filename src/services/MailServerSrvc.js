/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const MailServers = require('../schemas/MailServers');
const MailServerDaoImpl = require('../daosimplements/MailServerDaoImpl');
const MailServerDao = require('../daos/MailServerDao');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');


const postMailServerCreate = (reqBody, decodeData, callback) => {
    if((decodeData.ut === 'VRU' && reqBody.orgId && reqBody.oCode && reqBody.oName)) {
      try {
        const obj = MailServerDaoImpl.MailServerData(reqBody, decodeData);
          const MailSrverData = new MailServers(obj);
          MailServerDao.mailServerCreate(MailSrverData, (resObj) => {
            const data = resObj.resData.result;
            if (data && data._id) {
              const sucess = SetRes.successRes(data);
              callback(sucess);
            } else {
              const noData = SetRes.createFailed({});
              callback(noData);
            }
          });
        // });
      } catch (error) {
        logger.error('Un-known Error in service/MailServerSrvc.js at postMailServerCreate' + error);
        const errorMsg = SetRes.unKnownErr({});
        callback(errorMsg);
      }
    } else {
      const rf = SetRes.msdReqFields();
      callback(rf);
    }
  }

const postMailServerList = (reqBody, tData, callback) => {
  const qry = MailServerDaoImpl.mailServerListQry(reqBody, tData);
  MailServerDao.getMailServerList(qry, callback);
}

module.exports = {
    postMailServerCreate, postMailServerList,
}