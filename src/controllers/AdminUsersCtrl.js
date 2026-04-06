/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var fs = require('fs');
var multer = require('multer');
var { v4: uuidv4 } = require('uuid');
const AdminUsersSrvc = require('../services/AdminUsersSrvc');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');
const token = require('../tokens');
const util = require('../lib/util');
const { log } = require('winston');


var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const uid = req.params.userId || uuidv4();
    const uplLoc = 'assets/files/profiles/' + uid;
    if (!fs.existsSync(uplLoc)) {
      fs.mkdirSync(uplLoc);
    }
    callback(null, uplLoc);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage: storage }).single('profileImage');

//----------------------BEGIN ADMIN USER APIS----------------------//


const postAdminUsersList = (req, res) => {
  const vldRes = CommonCtrlVldns.postAdminListVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        AdminUsersSrvc.getAdminUsersList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const postAdminUsersAgentList = (req, res) => {
  const vldRes = CommonCtrlVldns.postAdminAgentListVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        AdminUsersSrvc.getAdminUsersAgentList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const createAdminUsers = (req, res, next) => {
  upload(req, res, (err) => {
    const reqValid = CommonCtrlVldns.admnUsrCreateVldtns(req);
    if (reqValid.flag) {
      token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
        const tokenVldn = CommonCtrlVldns.tokenVldn(tData);
        if (tokenVldn.flag) {
          const reqBody = JSON.parse(req.body.userData);
          AdminUsersSrvc.adminUserCreate(reqBody, req.file, tData, (resObj) => {
            util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
          });
        } else {
          const admnResObj = tokenVldn.result;
          util.sendApiResponse(res, admnResObj);
        }
      });
    } else {
      const valResObj = reqValid.result;
      util.sendApiResponse(res, valResObj);
    }
  });
}


const updateAdminUser = (req, res, next) => {
  const reqEditValid = CommonCtrlVldns.adminUsrEditVldtns(req);
  if (reqEditValid.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenVldn = CommonCtrlVldns.tokenVldn(tData);
      if (tokenVldn.flag) {
        AdminUsersSrvc.updateAdminUser(req.body, req.params.recordId, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else {
        const bResObj = tokenVldn.result;
        util.sendApiResponse(res, bResObj);
      }
    });
  } else {
    const valResObj = reqEditValid.result;
    util.sendApiResponse(res, valResObj);
  }
}

const getAdminUserView = (req, res, next) => {
  const getAdminUserView = CommonCtrlVldns.getAdminUserView(req);
  if (getAdminUserView.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenVldn = CommonCtrlVldns.tokenVldn(tData);
      if (tokenVldn.flag) {
        AdminUsersSrvc.getAdminUserView(req.params.recordId, req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else {
        const tokenRes = tokenVldn.result;
        util.sendApiResponse(res, tokenRes);
      }
    });
  } else {
    const reqRes = getAdminUserView.result;
    util.sendApiResponse(res, reqRes);
  }
}

const AdminUserStatusUpdate = (req, res, next) => {
  const reqEditValid = CommonCtrlVldns.adminUsrStatusEditVldtns(req);
  if (reqEditValid.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenVldn = CommonCtrlVldns.tokenVldn(tData);
      if (tokenVldn.flag) {
        AdminUsersSrvc.AdminUserStatusUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else {
        const bResObj = tokenVldn.result;
        util.sendApiResponse(res, bResObj);
      }
    });
  } else {
    const valResObj = reqEditValid.result;
    util.sendApiResponse(res, valResObj);
  }
}

const AdminUserPwsdChange = (req, res, next) => {
  const reqEditValid = CommonCtrlVldns.adminUsrStatusEditVldtns(req);
  if (reqEditValid.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenVldn = CommonCtrlVldns.tokenVldn(tData);
      if (tokenVldn.flag) {
        AdminUsersSrvc.AdminUserPwsdChange(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else {
        const bResObj = tokenVldn.result;
        util.sendApiResponse(res, bResObj);
      }
    });
  } else {
    const valResObj = reqEditValid.result;
    util.sendApiResponse(res, valResObj);
  }
}
const getAdminUsersCount = (req, res) => {
  const vldtn = CommonCtrlVldns.vldtAdUsrsCount(req);
  if (vldtn.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenVldn = CommonCtrlVldns.tokenVldn(tData);
      if (tokenVldn.flag) {
        AdminUsersSrvc.getAdminUsersCount(req.params.orgId, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else {
        const bResObj = tokenVldn.result;
        util.sendApiResponse(res, bResObj);
      }
    });
  } else util.sendApiRes(res, vldtn.result);
}

const getAdminUsrsTotalList = (req, res) => {
  if (req.headers.vruadatoken) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenVldn = CommonCtrlVldns.tokenVldn(tData);
      if (tokenVldn.flag) {
        AdminUsersSrvc.getAdminUsrsTotalList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else {
        const bResObj = tokenVldn.result;
        util.sendApiResponse(res, bResObj);
      }
    });
  } else util.sendApiRes(res, SetRes.mandatory());
}

module.exports = {
  postAdminUsersList, createAdminUsers, updateAdminUser, getAdminUserView, AdminUserStatusUpdate, AdminUserPwsdChange, postAdminUsersAgentList, getAdminUsersCount, getAdminUsrsTotalList
};