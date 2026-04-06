
/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var fs = require('fs');
var multer = require('multer');
var { v4: uuidv4 } = require('uuid');

const util = require('../lib/util');
const RstrntMenuCntlVldns = require('../ctrlvldtns/RstrntMenuCntlVldns');
const RstrntMenuSrvc = require('../services/RstrntMenuSrvc');
const token = require('../tokens');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');
const CommonSrvc = require('../services/CommonSrvc');
const logger = require('../lib/logger');
const SetRes = require('../SetRes');

//----------------------BEGIN Restaurant Menu Apis----------------------//\

var storage = multer.diskStorage({
  destination: async (req, file, callback) => {
    const id = req.params.code ? req.params.code : req.params.id ? req.params.id : '';
    var uplLoc = 'assets/files/menu-items/' + id;
    if (!fs.existsSync(uplLoc)) {
      fs.mkdirSync(uplLoc);
    }
    callback(null, uplLoc);
  },

  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage }).array('icon', 10);

const postRstrntMenuItemCreate = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      logger.error('Multer error:' + err);
      util.sendApiResponse(res, SetRes.unKnownErr());
    } else {
      const vds = RstrntMenuCntlVldns.createVldn(req);
      if (vds.flag) {
        token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
          const tokenValid = CommonCtrlVldns.tokenVldn(tData);
          if (tokenValid.flag) {
            if (req.files) {
              const uuid = uuidv4();
              var oldFldr = 'assets/files/menu-items/' + req.params.code;
              var uplLoc = 'assets/files/menu-items/' + uuid;
              fs.rename(oldFldr, uplLoc, (err1) => {
                if (err1) logger.error('There was an Error in RstrntMenuCtrl.js, at postRstrntMenuItemCreate function:' + err1);
                RstrntMenuSrvc.postRstrntMenuItemCreate(!err1 ? uplLoc : oldFldr, !err1 ? uuid : req.params.code, req, req.files, tData.tokenData, (resObj) => {
                  util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
                });
              });
            } else {
              RstrntMenuSrvc.postRstrntMenuItemCreate('', '', req, [], tData.tokenData, (resObj) => {
                util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
              });
            }
          } else {
            if (req.files) {
              const filesPath = req.files;
              CommonSrvc.dltFolder(filesPath);
            }
            util.sendApiResponse(res, tData.result);
          }
        });
      } else {
        if (req.files) {
          const filesPath = req.files;
          CommonSrvc.dltFolder(filesPath);
        }
        util.sendApiResponse(res, vds.result);
      }
    }
  });
}

const getRstrntMenuItemsList = (req, res, next) => {
  const listVldn = RstrntMenuCntlVldns.listVldn(req);
  if (listVldn.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        RstrntMenuSrvc.getRstrntMenuItemsList(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, listVldn.result);
}

const postRstrntMenuItemStatusUpdate = (req, res, next) => {
  const listVldn = RstrntMenuCntlVldns.statusUpdateVldn(req);
  if (listVldn.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        RstrntMenuSrvc.postRstrntMenuItemStatusUpdate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, listVldn.result);
}

const postRstrntMenuItemDelete = (req, res, next) => {
  const listVldn = RstrntMenuCntlVldns.menuDeleteVldn(req);
  if (listVldn.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        RstrntMenuSrvc.postRstrntMenuItemDelete(req.body, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, listVldn.result);
}

const postRstrntMenuItemUpdate = (req, res, next) => {
  upload(req, res, (err) => {
    const vds = RstrntMenuCntlVldns.updateVldn(req);
    if (vds.flag) {
      token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
        const tokenValid = CommonCtrlVldns.tokenVldn(tData);
        if (tokenValid.flag) {
          if (req.files) {
            RstrntMenuSrvc.postRstrntMenuItemUpdate(req, tData.tokenData, (resObj) => {
              util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
            });
          } else {
            RstrntMenuSrvc.postRstrntMenuItemUpdate(req, tData.tokenData, (resObj) => {
              util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
            });
          }
        } else {
          if (req.files) {
            const filesPath = req.files;
            CommonSrvc.dltFolder(filesPath);
          }
          util.sendApiResponse(res, tData.result);
        }
      });
    } else {
      if (req.files) {
        const filesPath = req.files;
        CommonSrvc.dltFolder(filesPath);
      }
      util.sendApiResponse(res, vds.result);
    }
  });
}
//----------------------END Restaurant Menu Apis----------------------//\

module.exports = {
  postRstrntMenuItemCreate, getRstrntMenuItemsList, postRstrntMenuItemStatusUpdate,
  postRstrntMenuItemDelete, postRstrntMenuItemUpdate
};