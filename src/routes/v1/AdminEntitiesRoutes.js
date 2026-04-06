/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const passport = require("passport");

const AndimEntitiesCntrl = require('../../controllers/AndimEntitiesCntrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/admin/ents/create/:ecode', AndimEntitiesCntrl.postAdminEntiCreate);
  app.post('/swit/admin/ents/list', AndimEntitiesCntrl.postAdminEntisList);
  app.post('/swit/admin/ents/list/byorg', AndimEntitiesCntrl.getAdminEntisListByOrg);
  app.post('/swit/admin/ents/view', AndimEntitiesCntrl.postAdminEntiView);
  app.post('/swit/admin/ents/status/update', AndimEntitiesCntrl.postAdminEntiStatusUpdate);
  app.post('/swit/admin/ents/update/:ecode', AndimEntitiesCntrl.postAdminEntiUpdate);
  app.post('/swit/admin/ents/total/list', AndimEntitiesCntrl.getAdminEntiTotalList);

}