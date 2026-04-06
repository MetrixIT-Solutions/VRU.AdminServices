/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var multer = require('multer');
var fs = require('fs');
var path = require('path');

const token = require('../tokens');
const util = require('../lib/util');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');;
const AdminEntisSrvc = require('../services/AdminEntitiesSrvc');
const AdminEntCntrlVldns = require('../ctrlvldtns/AdminEntCntrlVldns');
const SetRes = require('../SetRes');
const CommonSrvc = require('../services/CommonSrvc')
const logger = require('../lib/logger');

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const uplLoc = 'assets/files/orgentitylogos/';
    if (!fs.existsSync(uplLoc)) {
      fs.mkdirSync(uplLoc, { recursive: true });
    }
    callback(null, uplLoc);
  },
  filename: function (req, file, callback) {
    const eCode = req.params.ecode;
    const ext = path.extname(file.originalname);
    let suffix = 'File';
    if (file.fieldname === 'icon' || file.fieldname === 'logo') suffix = 'Logo';
    if (file.fieldname === 'favicon') suffix = 'FavIcon';
    const finalName = `${eCode}_${suffix}${ext}`;
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

var upload = multer({ storage, fileFilter: pngFileFilter }).fields([{ name: 'icon', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]);

const postAdminEntiCreate = (req, res) => {
  upload(req, res, (err) => {
    if (!err) {
      const vldRes = AdminEntCntrlVldns.postEntiCreateVldtn(req);
      if (vldRes.flag) {
        token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
          const tokenValid = CommonCtrlVldns.tokenVldn(tData);
          if (tokenValid.flag) {
            AdminEntisSrvc.postAdminEntiCreate(req, tData.tokenData, (resObj) => {
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

const postAdminEntisList = (req, res) => {
  const vldRes = AdminEntCntrlVldns.postEntListVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        AdminEntisSrvc.postAdminEntisList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const getAdminEntisListByOrg = (req, res) => {
  const vldRes = AdminEntCntrlVldns.postEntOrgVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        AdminEntisSrvc.getAdminEntisListByOrg(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const postAdminEntiView = (req, res) => {
  const vldRes = AdminEntCntrlVldns.postEntiViewVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        AdminEntisSrvc.postAdminEntiView(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const postAdminEntiStatusUpdate = (req, res) => {
  const vldRes = AdminEntCntrlVldns.postEntiStatusUpdateVldn(req);
  if (vldRes.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        AdminEntisSrvc.postAdminEntiStatusUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    util.sendApiResponse(res, vldRes.result);
  }
}

const postAdminEntiUpdate = (req, res) => {
  upload(req, res, (err) => {
    if (!err) {
      const vldRes = AdminEntCntrlVldns.postEntiUpdateVldn(req);
      if (vldRes.flag) {
        token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
          const tokenValid = CommonCtrlVldns.tokenVldn(tData);
          if (tokenValid.flag) {
            if (tokenValid.flag) {
              AdminEntisSrvc.postAdminEntiUpdate(req, tData.tokenData, (resObj) => {
                util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' } });
              });
            } else {
              if (req.files) cleanupFiles(req.files);
              util.sendApiResponse(res, tokenValid.result);
            }
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

const getAdminEntiTotalList = (req, res) => {
  if (req.headers.vruadatoken) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        AdminEntisSrvc.getAdminEntiTotalList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else {
    const te = SetRes.tokenRequired();
    util.sendApiResponse(res, te);
  }
}

module.exports = {
  postAdminEntiCreate, postAdminEntisList, getAdminEntisListByOrg, postAdminEntiView,
  postAdminEntiStatusUpdate, postAdminEntiUpdate, getAdminEntiTotalList
};

const cleanupFiles = (files) => {
  Object.values(files).flat().forEach(f => {
    CommonSrvc.dltFolder([{ destination: f.destination }]);
  });
}
