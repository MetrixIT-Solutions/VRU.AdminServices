/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const RestaurantMenuCtrl = require('../../controllers/RstrntMenuCtrl');

module.exports.controller = (app, passport) => {

  app.post('/swit/restaurant/menu/item/create/:code', RestaurantMenuCtrl.postRstrntMenuItemCreate);
  app.post('/swit/restaurant/menu/items/list', RestaurantMenuCtrl.getRstrntMenuItemsList);
  app.post('/swit/restaurant/menu/item/status/update', RestaurantMenuCtrl.postRstrntMenuItemStatusUpdate);
  app.post('/swit/restaurant/menu/item/delete', RestaurantMenuCtrl.postRstrntMenuItemDelete);
  app.post('/swit/restaurant/menu/item/update/:id', RestaurantMenuCtrl.postRstrntMenuItemUpdate);

};
