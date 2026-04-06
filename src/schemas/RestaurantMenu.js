/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');
var mongoose = require('mongoose');
var {v4: uuidv4} = require('uuid');

mongoose.createConnection(config.mongoDBConnection);
const Schema = mongoose.Schema;

// --- Begin: Restaurants Menu Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},
  orgId: {type: String, required: true, trim: true}, // Admin Organizations Record ID(_id) - config.collAdminOrgs 
  oCode: {type: String, required: true, trim: true}, // Organization Code
  oName: {type: String, required: true, trim: true}, // Organization Name
  entId: {type: String, required: true, trim: true}, // Entities Record ID(_id) - config.collAdminEntis 
  eName: {type: String, required: true, trim: true}, //  Entity/Brand Name
  eCode: {type: String, required: true, trim: true}, // Entity Code
  branch: {type: String, required: false}, // Admin Branchs Record ID(_id) - config.collAdminBranches
  bCode: {type: String, required: false},
  rType: {type: String, required: true, trim: true}, // Restaurant Type: Buffet, Allocate, Other
 
  dType: {type: String, default: 'Regular'}, // Day Type: Regular, Special
  sdStDt: {type: String, required: false}, // Special Day Start Date: YYYY-MM-DD
  sdEdDt: {type: String, required: false}, // Special Day End Date: YYYY-MM-DD
  day: { type: String, required: true}, // All, Monday, Tuesday, etc
  category: {type: String, required: true}, // Starters, Deserts
  subCategory: {type: String, required: true}, // Veg Starter, Non Veg Starter
  itemName: {type: String, required: true}, // Item Name
  itemDesc: {type: String, required: false}, // Item Description
  itemStatus: {type: String, required: true}, // Active, Inactive
  halfPlatePrice: {type: Number, required: false},
  fullPlatePrice: {type: Number, required: false},
  generalPrice: {type: Number, required: false},

  icon: {type: String, required: false}, // Icon
  iActualName: {type: String, required: false},
  iPath: {type: String, required: false},

  delFlag: {type: Boolean, default: false}, // Deleted Flag
  cuType: {type: String, required: true}, // Created User Type: Customer, Admin
  cUser: {type: String, required: true}, // Created Users._id
  cuName: {type: String, required: true}, // Created Users.name
  cDtTm: {type: Date, required: true}, // Date & Time - Format = YYYY-MM-DD HH:mm:ss
  cDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
  cDtNum: {type: Number, required: true}, // Date & Time Number
  uuType: {type: String, required: true}, // Updated User Type: Customer, Admin
  uUser: {type: String, required: true}, // Updated Users._id
  uuName: {type: String, required: true}, // Updated Users.name
  uDtTm: {type: Date, required: true}, // Date & Time - Format = YYYY-MM-DD HH:mm:ss
  uDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
  uDtNum: {type: Number, required: true}, // Date & Time Number
}, {collection: config.collRestaurantMenu});

schema.index({orgId: 1, entId: 1, branch: 1, delFlag: -1, rType: 1, dType: 1});
schema.index({orgId: 1, entId: 1, branch: 1, category: 1, subCategory: 1, itemName: 1}, {unique: true});
schema.index({cDtStr: -1, uDtStr: -1});

module.exports = mongoose.model(config.collRestaurantMenu, schema);
// --- End: Restaurants Menu Schema --- //