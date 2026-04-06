/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */
  

var axios = require('axios');
var config = require('config');

const commonSms = (data, callback) => {
  const headers = {headers: {authkey: config.smsAuthKey}};
  axios.post(config.smsApi, data, headers).then((res) => callback(res.data)).catch((err) => {callback({})});
};

module.exports = {
  commonSms
};
