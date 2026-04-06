/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var axios = require('axios');
// const domain = 'http://localhost:3005/';
const domain = 'https://bbqh.skillworksit.com/cadmin/';

const getBkgsData = async (body) => {
  try {
    const headers = { headers: {} };
    const res = await axios.post(`${domain}get/bkgs/data`, body, headers);
    return res.data;
  } catch (err) {
    return {};
  }
};

const getData = async (body) => {
  try {
    const headers = { headers: {} };
    const res = await axios.post(`${domain}get/data`, body, headers);
    return res.data;
  } catch (err) {
    return {};
  }
}


const getGsiData = async(body) => {
    try {
    const headers = { headers: {} };
    const res = await axios.post(`${domain}get/gsi/data`, body, headers);
    return res.data;
  } catch (err) {
    return {};
  }
}

module.exports = {
  getBkgsData, getData, getGsiData
};
