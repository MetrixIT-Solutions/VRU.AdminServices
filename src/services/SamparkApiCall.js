/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const axios = require('axios');
const sids = {
  '4018': '18',
  '4019': '18',
  '4020': '15',
};

const samparkLogin = (uRes, ipv4, callback) => {
  const agentData = uRes.agentInfo;
  const url = `http://119.235.48.238:9899/?reqtype=login&user=${agentData.id}&pass=${agentData.password}&exten=${agentData.extension}&host=${ipv4+'_'+agentData.id}&service=${sids[agentData.extension]}&login=SF`;
  axios.get(url).then((res) => callback(res.data)).catch((err) => { callback({}) });
}

const samparkLogout = (reqBody, ipv4, callback) => {
  const url = ` http://119.235.48.238:9899/?reqtype=logout&user=${reqBody.agentId}&host=${ipv4 + '_' + reqBody.agentId}`;
  axios.get(url).then((res) => callback(res.data)).catch((err) => { callback({}) });
}

const postAdminUserAgentCall = (reqBody, ipv4, callback) => {
  const url = `http://119.235.48.238:9899/?reqtype=manual_dial&user=${reqBody.agentId}&exten=${reqBody.exten}&number=${reqBody.mobNum}&sid=${sids[reqBody.exten]}&host=${ipv4 + '_' + reqBody.agentId}&call_number=0&refid=0&batchname=0&batchid=0&sessionsid=${sids[reqBody.exten]}`;
  axios.get(url).then((res) => callback(res.data)).catch((err) => { callback({}) });
}

const postAdminUserAgentCallClose = (reqBody, ipv4, callback) => {
  const url = `http://119.235.48.238:9899/?reqtype=closecall&user=${reqBody.agentId}&disposition=CDC&callnumber=${reqBody.cNum}&remarks=&cbkdate=&main_dispstn_code=0&sub_dispstn_code=0&host=${ipv4+'_'+reqBody.agentId}`;
  axios.get(url).then((res) => callback(res.data)).catch((err) => {callback({})});
}

const postAdminUserAgentCallHangup = (reqBody, ipv4, callback) => {
  const url = `http://119.235.48.238:9899/?reqtype=hangupcall&user=${reqBody.agentId}&host=${ipv4+'_'+reqBody.agentId}`;
  axios.get(url).then((res) => callback(res.data)).catch((err) => {callback({})});
}

const postAdminUserAgentBreakStart = (reqBody, ipv4, callback) => {
  const url = `http://119.235.48.238:9899/?reqtype=break_start&user=${reqBody.agentId}&breaktype=${reqBody.breakType}&host=${ipv4+'_'+reqBody.agentId}&call_number=null`;
  axios.get(url).then((res) => callback(res.data)).catch((err) => {callback({})});
}

const postAdminUserAgentBreakEnd = (reqBody, ipv4, callback) => {
  const url = `http://119.235.48.238:9899/?reqtype=break_end&user=${reqBody.agentId}&host=${ipv4+'_'+reqBody.agentId}&call_number=null`;
  axios.get(url).then((res) => callback(res.data)).catch((err) => {callback({})});
}

const postAdminUserAgentCallHoldStart = (reqBody, ipv4, callback) => {
  const url = `http://119.235.48.238:9899/?reqtype=hold_start&user=${reqBody.agentId}&host=${ipv4+'_'+reqBody.agentId}&call_number=null`;
  axios.get(url).then((res) => callback(res.data)).catch((err) => {callback({})});
}

const postAdminUserAgentCallHoldStop = (reqBody, ipv4, callback) => {
  const url = `http://119.235.48.238:9899/?reqtype=hold_stop&user=${reqBody.agentId}&host=${ipv4+'_'+reqBody.agentId}&call_number=null`;
  axios.get(url).then((res) => callback(res.data)).catch((err) => {callback({})});
}

const postAdminUserAgentCallRedial = (reqBody, ipv4, callback) => {
  const url = `http://119.235.48.238:9899/?reqtype=closendial&user=${reqBody.agentId}&disposition=REDIAL&callnumber=${reqBody.cNumber}&remarks=REDIAL&cbkdate=&num=${reqBody.number}&lrefid=&dialindex=1&host=${ipv4 + '_' + reqBody.agentId}`;
  axios.get(url).then((res) => callback(res.data)).catch((err) => {callback({})});
}

const getUserAgentInfo = (reqBody, ipv4, callback) => {
  const url = `http://119.235.48.238:9898/?reqtype=agentstatus&user=${reqBody.agentId}&host=${ipv4+'_'+reqBody.agentId}&call_number=null`;
  axios.get(url).then((res) => callback(res)).catch((err) => {callback({})});
}

const postCustsMissedCallsApi = (startDay, endDay, branchId, callback) => {
  const url = `http://119.235.48.238:6565/rptMIS/getMIS?rptype=Missed_call&dd2=&dd1=${branchId}&sdate=${startDay}&edate=${endDay}`;
  axios.get(url).then((res) => callback(res)).catch((err) => {callback({})});
}

module.exports = {
  samparkLogin, samparkLogout, postAdminUserAgentCall, postAdminUserAgentCallClose, 
  postAdminUserAgentCallHangup, postAdminUserAgentBreakStart, postAdminUserAgentBreakEnd,
  postAdminUserAgentCallHoldStart, postAdminUserAgentCallHoldStop, postAdminUserAgentCallRedial,
  getUserAgentInfo, postCustsMissedCallsApi
};
