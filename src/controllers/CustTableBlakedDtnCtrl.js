/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustTableBlakedDtnVldns = require('../ctrlvldtns/CustTableBlakedDtnVldns');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');
const CustTableBlakedDtnVldnSrvc = require('../services/AdminCustBlckedDtnSrvc');
const token = require('../tokens');
const util = require('../lib/util');

const tableBolckedCreate = (req, res, next) => {
  const reqValid = CustTableBlakedDtnVldns.custTableBlakedDtnCreate(req);
  if (reqValid.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenVldn = CommonCtrlVldns.tokenVldn(tData);
      if (tokenVldn.flag) {
        CustTableBlakedDtnVldnSrvc.tableBolckedCreate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenVldn.result);
    });
  } else {
    const valResObj = reqValid.result;
    util.sendApiResponse(res, valResObj);
  }
}

const tableBolckedList = (req, res) => {
  const vldRes = CustTableBlakedDtnVldns.custTableBlakedDtnListVldtn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenVldn = CommonCtrlVldns.tokenVldn(tData);
      if (tokenVldn.flag) {
        CustTableBlakedDtnVldnSrvc.tableBolckedList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenVldn.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const tableBolckedStatusUpdate = (req, res, next) => {
  const reqEditValid = CustTableBlakedDtnVldns.adminUsrEditVldtns(req);
  if (reqEditValid.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenVldn = CommonCtrlVldns.tokenVldn(tData);
      if (tokenVldn.flag) {
        CustTableBlakedDtnVldnSrvc.tableBolckedStatusUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenVldn.result);
    });
  } else {
    const valResObj = reqEditValid.result;
    util.sendApiResponse(res, valResObj);
  }
}

module.exports = {
  tableBolckedCreate, tableBolckedList, tableBolckedStatusUpdate
};
