/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var multer = require('multer');
var fs = require('fs');
var path = require('path');

const AdminOrgsSrvc = require('../services/AdminOrgsSrvc');
const AdminOrgsCtrlVldns = require('../ctrlvldtns/AdminOrgsCtrlVldns');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');
const token = require('../tokens');
const util = require('../lib/util');
const SetRes = require('../SetRes');

const logger = require('../lib/logger');
const CommonSrvc = require('../services/CommonSrvc');

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const uplLoc = 'assets/files/orgentitylogos/';
    if (!fs.existsSync(uplLoc)) {
      fs.mkdirSync(uplLoc, { recursive: true });
    }
    callback(null, uplLoc);
  },
  filename: function (req, file, callback) {
    const oCode = req.params.ocode;
    const ext = path.extname(file.originalname);
    let suffix = 'File';
    if (file.fieldname === 'icon' || file.fieldname === 'logo') suffix = 'Logo';
    if (file.fieldname === 'favicon') suffix = 'FavIcon';
    const finalName = `${oCode}_${suffix}${ext}`;
    callback(null, finalName);
  }
});

const pngFileFilter = (req, file, cb) => {
  const isPngExt = path.extname(file.originalname).toLowerCase() === '.png';
  if (isPngExt) {
    cb(null, true);
  } else {
    cb(new Error('Only PNG files are allowed'), false);
  }
};

var upload = multer({ storage, fileFilter: pngFileFilter }).fields([{ name: 'icon', maxCount: 1 },{ name: 'favicon', maxCount: 1 }]);

const postAdminOrgCreate = (req, res) => {
  upload(req, res, (err) => {
    if (!err) {
      const vldRes = AdminOrgsCtrlVldns.postOrgCreateVldn(req);
      if (vldRes.flag) {
        token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
          const tokenValid = CommonCtrlVldns.tokenVldn(tData);
          if (tokenValid.flag) {
            AdminOrgsSrvc.postAdminOrgCreate(req, tData.tokenData, (resObj) => {
              util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
            });
          } else {
            if (req.files) cleanupFiles(req.files);
            util.sendApiResponse(res, tokenValid.result);
          }
        });
      } else {
        if (req.files) cleanupFiles(req.files);
        util.sendApiResponse(res, vldRes.result);
      }
    } else {
      logger.error('Multer error:' + err);
        if (req.files) cleanupFiles(req.files);
      util.sendApiResponse(res, SetRes.unKnownErr({}));
    }
  });
}

const getAdminOrgsList = (req, res) => {
  const vldRes = AdminOrgsCtrlVldns.postOrgListVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        AdminOrgsSrvc.getAdminOrgsList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminOrgView = (req, res) => {
  const vldRes = AdminOrgsCtrlVldns.postOrgViewVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        AdminOrgsSrvc.postAdminOrgView(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminOrgStatusUpdate = (req, res) => {
  const vldRes = AdminOrgsCtrlVldns.postOrgStatusUpdateVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        AdminOrgsSrvc.postAdminOrgStatusUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

const postAdminOrgUpdate = (req, res) => {
  upload(req, res, (err) => {
    if (!err) {
      const vldRes = AdminOrgsCtrlVldns.postAdminOrgUpdateVldn(req);
      if (vldRes.flag) {
        token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
          const tokenValid = CommonCtrlVldns.tokenVldn(tData);
          if (tokenValid.flag) {
              AdminOrgsSrvc.postAdminOrgUpdate(req, tData.tokenData, (resObj) => {
                util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
              });
          } else {
            if (req.files) cleanupFiles(req.files);
            util.sendApiResponse(res, tokenValid.result);
          }
        });
      } else {
        if (req.files) cleanupFiles(req.files);
        util.sendApiResponse(res, vldRes.result);
      }
    } else {
      logger.error('Multer error:' + err);
      if (req.files) cleanupFiles(req.files);
      util.sendApiResponse(res, SetRes.unKnownErr({}));
    }
  });
}

const getAdminOrgsTotalList = (req, res) => {
  if (req.headers.vruadatoken) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        AdminOrgsSrvc.getAdminOrgsTotalList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    const te = SetRes.tokenRequired();
    util.sendApiResponse(res, te);
  }
}

const putAdOrgSubscription = (req, res) => {
  const vldRes = AdminOrgsCtrlVldns.putOrgSubPlanVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        AdminOrgsSrvc.putAdOrgSubscription(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, vldRes.result);
}

module.exports = {
  postAdminOrgCreate, getAdminOrgsList, postAdminOrgView, postAdminOrgStatusUpdate, postAdminOrgUpdate, getAdminOrgsTotalList, putAdOrgSubscription
};

const cleanupFiles = (files) => {
  Object.values(files).flat().forEach(f => {
    CommonSrvc.dltFolder([{ destination: f.destination }]);
  });
}
