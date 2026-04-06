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

// --- Begin: Customers User Informations Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},
  orgId: {type: String, required: true, trim: true}, // Admin Organizations Record ID(_id) - config.collAdminOrgs 
  oCode: {type: String, required: true, trim: true}, // Organization Code
  oName: {type: String, required: true, trim: true}, // Organization Name
  branch: {type: String, required: false}, // Admin Branchs Record ID(_id) - config.collAdminBranches
  bCode: {type: String, required: false},

  user: {type: String, required: true, index: true, unique: true, ref: config.collCustsUsers},
  refUID: {type: String, required: true}, // Reference Unique ID
  myPrimary: {type: String, required: true}, // Mobile Number or Email
  uStatus: {type: String, required: true}, // User Status: Active, Inactive, Hold, Blocked

  bCount: {type: Number, default: 0}, // Bookings Count
  abCount: {type: Number, default: 0}, // Absent Bookings Count
  cncldbCount: {type: Number, default: 0}, // Cancelled Bookings Count
  clsdbCount: {type: Number, default: 0}, // Closed Bookings Count
  cnfrmdbCount: {type: Number, default: 0}, // Upcoming Bookings Count

  ntfcts: {type: Number, default: 0}, // Notifications Count
  rNtfcts: {type: Number, default: 0}, // Read Notifications Count
  urNtfcts: {type: Number, default: 0}, // Unread Notifications Count
  sTckts: {type: Number, default: 0}, // Support Tickets Count
  saTckts: {type: Number, default: 0}, // Support Tickets Active Count
  scTckts: {type: Number, default: 0}, // Support Tickets Closed Count

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

// schema.index({'$**': 'text'});
schema.index({branch: 1, refUID: 1, myPrimary: 1});
schema.index({delFlag: -1, uStatus: 1});

module.exports = mongoose.model(config.collCustsUsersInfos, schema);
// --- End: Customers User Informations Schema --- //
