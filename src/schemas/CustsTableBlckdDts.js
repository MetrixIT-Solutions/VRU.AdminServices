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

// --- Begin: Customers Table Blocked Dates Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},

  orgId: {type: String, required: true, trim: true}, // Admin Organizations Record ID(_id) - config.collAdminOrgs 
  oCode: {type: String, required: true, trim: true}, // Organization Code
  oName: {type: String, required: true, trim: true}, // Organization Name
  entId: {type: String, required: true, trim: true}, // Entities Record ID(_id) - config.collAdminEntis 
  eName: {type: String, required: true, trim: true}, //  Entity/Brand Name
  eCode: {type: String, required: true, trim: true}, // Entity Code
  branch: {type: String, required: false}, // Admin Branchs Record ID(_id) - config.collAdminBranches
  bName: {type: String, required: false}, // Admin BranchName
  bCode: {type: String, required: false},

  // Blocked Date
  blckdFor: {type: String, required: true}, // Booking, Private Dining
  blckdDt: {type: String, required: true}, // Date - Format = YYYY-MM-DD
  blckdDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mms
  blckdSlotType: {type: String, required: true}, // Lunch, Dinner
  blckdStatus: {type: String, required: true}, 

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
});

schema.index({'$**': 'text'});
schema.index({ branch: 1, bCode: 1, blckdFor: 1, blckdDt: 1, blckdSlotType: 1, blckdStatus: 1, delFlag: -1});
schema.index({ branch: 1, blckdFor: 1, blckdDt: 1, blckdSlotType: 1 }, {unique: true});
schema.index({cDtTm: -1, uDtStr: -1});

module.exports = mongoose.model(config.collCustsTableBlckdDts, schema);
// --- End: Customers Table Blocked Dates Schema --- //
