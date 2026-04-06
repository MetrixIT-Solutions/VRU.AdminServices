
/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const util = require('../lib/util');
const RstrntCategoriesCtrlVldns = require('../ctrlvldtns/RstrntCategoriesCtrlVldns');
const RstrntCategoriesSrvc = require('../services/RstrntCategoriesSrvc');
const token = require('../tokens');
const CommonCtrlVldns = require('../ctrlvldtns/CommonCtrlVldns');

//----------------------BEGIN Restaurant Category Apis----------------------//\

const postRstrntCategoryCreate = (req, res, next) => {
  const createVldn = RstrntCategoriesCtrlVldns.createVldn(req);
  if (createVldn.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        RstrntCategoriesSrvc.postRstrntCategoryCreate(req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, createVldn.result);
}

const getRstrntCategoriesList = (req, res, next) => {
  const createVldn = RstrntCategoriesCtrlVldns.listVldn(req);
  if (createVldn.flag) {
    token.adUsrRefreshToken(req.headers.vruadatoken, res, tData => {
      const tokenValid = CommonCtrlVldns.tokenVldn(tData);
      if (tokenValid.flag) {
        RstrntCategoriesSrvc.getRstrntCategoriesList(req.params, req.body, tData.tokenData, (resObj) => {
          util.sendApiResponse(res, { ...resObj, resData: { ...resObj.resData, rAccObj: tData?.rolesObj, oPlan: tData.tokenData?.op || 'Basic' }});
        });
      } else util.sendApiResponse(res, tokenValid.result);
    });
  } else util.sendApiResponse(res, createVldn.result);
}

//----------------------END Restaurant Category Apis----------------------//\

module.exports = {
  postRstrntCategoryCreate, getRstrntCategoriesList
};
