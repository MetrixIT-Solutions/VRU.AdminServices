/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var { v4: uuidv4 } = require('uuid');

const ChtbtQrsDaoImpl = require('../daosimplements/ChatbotQueriesDaoImpl');
const ChatbotQueries = require('../schemas/ChatbotQueries');
const ChatbotQueriesLcs = require('../schemas/ChatbotQueriesLcs');
const ChtbtQrsDao = require('../daos/ChatbotQueriesDao');

const postChatbotQryCreate = (reqBody, callback) => {
  const crtObj = ChtbtQrsDaoImpl.postChatbotQryCreate(reqBody);
  const crtData = new ChatbotQueries(crtObj);
  ChtbtQrsDao.createData(crtData, (resObj) => {
    if (resObj.status == '200') {
      const crtLfcData = new ChatbotQueriesLcs({...crtObj, cbQryId: crtData._id});
      ChtbtQrsDao.createData(crtLfcData, (resObj) => { });
    }
    callback(resObj);
  });
};

const getChatbotQrsList = (reqBody, tData, callback) => {
  const query = ChtbtQrsDaoImpl.chatBotListQry(reqBody, tData);
  ChtbtQrsDao.getChatbotQrsList(query, reqBody, callback);
}

const postChatbotStatusUpdate = (reqBody, tData, callback) => {
  const obj = ChtbtQrsDaoImpl.setChtbotStsUpdate(reqBody, tData);
  ChtbtQrsDao.postChatbotUpdate(obj.query, obj.updObj, (resObj) => {
    if (resObj.status == '200') {
      const data = Object.assign({}, resObj.resData.result.toObject());
      const dObj = { ...data, _id: uuidv4(), cbQryId: data._id, cUser: data.uUser, cuName: data.cuName, cDtTm: data.uDtTm, cDtStr: data.uDtStr };
      const crtLfcData = new ChatbotQueriesLcs(dObj);
      ChtbtQrsDao.createData(crtLfcData, (resObj) => { });
    }
    callback(resObj);
  });
}

const postChatbotMsgUpdate = (reqBody, callback) => {
  const obj = ChtbtQrsDaoImpl.setChtbotMsgUpdate(reqBody);
  ChtbtQrsDao.postChatbotUpdate(obj.query, obj.updObj, (resObj) => {
    if (resObj.status == '200') {
      const data = Object.assign({}, resObj.resData.result.toObject());
      const dObj = { ...data, _id: uuidv4(), cbQryId: data._id,cUser: data.uUser, cuName: data.cuName, cDtTm: data.uDtTm, cDtStr: data.uDtStr };
      const crtLfcData = new ChatbotQueriesLcs(dObj);
      ChtbtQrsDao.createData(crtLfcData, (resObj) => { });
    }
    callback(resObj);
  });
}

const getChatbotLfcsList = (id, callback) => {
  const query = ChtbtQrsDaoImpl.chatbotLfcsListQry(id);
  ChtbtQrsDao.getChatbotLfcsList(query, callback);
}

module.exports = {
  postChatbotQryCreate, getChatbotQrsList, postChatbotStatusUpdate, postChatbotMsgUpdate, getChatbotLfcsList
};
