/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const RstrntCategoriesCtrl = require('../../controllers/RstrntCategoriesCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/restaurant/category/create', RstrntCategoriesCtrl.postRstrntCategoryCreate);
  app.post('/swit/restaurant/categories/list/:type/:category?', RstrntCategoriesCtrl.getRstrntCategoriesList);

};
