/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var cron = require('node-cron');

const CustsUsrsGsiSrvc = require('../services/CustsUsrsGsiSrvc');
const CustsUsrsGsiCtrlVldns = require('../ctrlvldtns/CustsUsrsGsiCtrlVldns');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');
const token = require('../tokens');
const util = require('../lib/util');

// --- Begin: CronJob for every month to delete Gsi 
cron.schedule('0 6 3 * *', () => {
  CustsUsrsGsiSrvc.deleteGsiData();
});

// --- Begin: CronJob for Creating Gsi Analysis 
cron.schedule('* 1 * * *', () => {
  CustsUsrsGsiSrvc.createGsiAnalysisData();
});

const getCustsGsiList = (req, res) => {
  const vldRes = CustsUsrsGsiCtrlVldns.gsiListVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsUsrsGsiSrvc.getCustsGsiList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else {
        util.sendApiResponse(res, tokenValid.result);
      }
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const postCustsGsiCreate = (req, res) => {
  const vldRes = CustsUsrsGsiCtrlVldns.gsiCrtVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsUsrsGsiSrvc.postCustsGsiCreate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else {
        util.sendApiResponse(res, tokenValid.result);
      }
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const getCustsGsiOExpCount = (req, res) => {
  const vldRes = CustsUsrsGsiCtrlVldns.gsiListCountVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsUsrsGsiSrvc.getCustsGsiOExpCount(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else {
        util.sendApiResponse(res, tokenValid.result);
      }
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const custsGsiUpdate = (req, res) => {
  const vldRes = CustsUsrsGsiCtrlVldns.gsiUpdateVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsUsrsGsiSrvc.custsGsiUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else {
        util.sendApiResponse(res, tokenValid.result);
      }
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const getCustsGsiView = (req, res) => {
  const vldRes = CustsUsrsGsiCtrlVldns.gsiViewVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsUsrsGsiSrvc.getCustsGsiView(req.params.id, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else {
        util.sendApiResponse(res, tokenValid.result);
      }
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const getCustsGsiAvgCountByMnth = (req, res) => {
  const vldRes = CustsUsrsGsiCtrlVldns.gsiAvgCountByMonthVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        CustsUsrsGsiSrvc.getCustsGsiAvgCountByMnth(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else {
        util.sendApiResponse(res, tokenValid.result);
      }
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

module.exports = {
  getCustsGsiList, postCustsGsiCreate, getCustsGsiOExpCount, custsGsiUpdate, getCustsGsiView, getCustsGsiAvgCountByMnth
};
