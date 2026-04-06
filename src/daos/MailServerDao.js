/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const MailServers = require('../schemas/MailServers');
const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const mailServerCreate = (data, callback) => {
    data.save().then((resObj) => {
      if (resObj && resObj._id) {
        const sr = SetRes.successRes(resObj);
        callback(sr);
      } else {
        const uf = SetRes.createFailed({});
        callback(uf);
      }
    }).catch((error) => {
      logger.error('Un-konwn Error in daos/BranchDao.js, at mailServerCreate:' + error);
      const err = SetRes.unKnownErr();
      callback(err);
    });
  }

const getMailServerList = (query, callback) => {
  MailServers.find(query).then((resObj) => {
    if (resObj) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/MailServerDao.js, at getMailServerList:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

module.exports = {
    mailServerCreate, getMailServerList
};
