/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

var config = require('config');
var mongoose = require('mongoose');
var {v4: uuidv4} = require('uuid');

mongoose.createConnection(config.mongoDBConnection);
const Schema = mongoose.Schema;

// --- Begin: Admin User Roles Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},
  orgId: {type: String, required: true, trim: true}, // Admin Organizations Record ID(_id) - config.collAdminOrgs 
  oCode: {type: String, required: true, trim: true}, // Organization Code
  oName: {type: String, required: true, trim: true}, // Organization Name

  rType: {type: String, required: true, trim: true}, // Role Type: Board, Entity, Branch; VRU(Super User)
  rName: {type: String, required: true, trim: true}, // Role Name
  rCode: {type: String, required: true}, // Role Code
  rSeq: {type: Number, required: true},
  rStatus: {type: String, required: true}, // Role Status: Active, Inactive

  delFlag: {type: Boolean, default: false}, // Deleted Flag
  cuType: {type: String, required: true}, // Created User Type: Customer, Admin
  cUser: {type: String, required: true}, // Created Users._id
  cuName: {type: String, required: true}, // Created Users.name
  cDtTm: {type: Date, required: true}, // Date & Time - Format = YYYY-MM-DD HH:mm:ss
  cDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
  uuType: {type: String, required: true}, // Updated User Type: Customer, Admin
  uUser: {type: String, required: true}, // Updated Users._id
  uuName: {type: String, required: true}, // Updated Users.name
  uDtTm: {type: Date, required: true}, // Date & Time - Format = YYYY-MM-DD HH:mm:ss
  uDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
});

schema.index({oName: 'text', rType: 'text', rName: 'text', rCode: 'text'});
schema.index({orgId: 1, rType: 1, rName: 1}, {unique: true});
schema.index({orgId: 1, rType: 1, rCode: 1}, {unique: true});
schema.index({orgId: 1, delFlag: -1, rSeq: 1});

module.exports = mongoose.model(config.collAdUserRoles, schema);
// --- End: Admin User Roles Schema --- //
