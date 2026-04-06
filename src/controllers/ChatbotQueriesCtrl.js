/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const ChtbtQrsSrvc = require('../services/ChatbotQueriesSrvc');
const ChtbtQrsCv = require('../ctrlvldtns/ChatbotQueriesCtrlVldns');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');
const token = require('../tokens');
const util = require('../lib/util');

const postChatbotQryCreate = (req, res) => {
  const vldRes = ChtbtQrsCv.chtBotCreateVldn(req);
  if (vldRes.flag) {
    ChtbtQrsSrvc.postChatbotQryCreate(req.body, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const getChatbotQrsList = (req, res) => {
  const vldRes = ChtbtQrsCv.chtBotListVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        ChtbtQrsSrvc.getChatbotQrsList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const postChatbotStatusUpdate = (req, res) => {
  const vldRes = ChtbtQrsCv.chatbotStsUpdVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        ChtbtQrsSrvc.postChatbotStatusUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const postChatbotMsgUpdate = (req, res) => {
  const vldRes = ChtbtQrsCv.chatbotMsgUpdVldn(req);
  if (vldRes.flag) {
    ChtbtQrsSrvc.postChatbotMsgUpdate(req.body, (resObj) => {
      util.sendApiResponse(res, resObj);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const getChatbotLfcsList = (req, res) => {
  const vldRes = ChtbtQrsCv.chatbotLfcsVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        ChtbtQrsSrvc.getChatbotLfcsList(req.params.id, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

module.exports = {
  postChatbotQryCreate, getChatbotQrsList, postChatbotStatusUpdate, postChatbotMsgUpdate, getChatbotLfcsList
};
