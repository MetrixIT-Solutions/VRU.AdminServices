/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const BranchCtrl = require('../../controllers/BranchCtrl');

module.exports.controller = (app, passport) => {
  app.post('/swit/admin/branchs/list' , BranchCtrl.postBbqhBranchList);
  app.post('/swit/admin/branchs/create' , BranchCtrl.postBbqhBranchCreate);
  app.post('/swit/admin/branch/update' , BranchCtrl.postBbqhBranchUpdate);
  app.post('/swit/admin/all/branchs/list' , BranchCtrl.postBbqhAllBranchList);
  app.post('/swit/admin/total/branches/list', BranchCtrl.getAdminBranchTotalList);
  app.post('/swit/admin/branch/status/update' , BranchCtrl.postBbqhBranchStatusUpdate);
};
