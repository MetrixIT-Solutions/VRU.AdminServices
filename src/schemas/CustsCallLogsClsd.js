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

// --- Begin: Customers Call Logs Closed Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},
  idSeq: {type: String, required: true}, // Year(2022) Moth(10) Day(10)
  orgId: {type: String, required: true, trim: true}, // Admin Organizations Record ID(_id) - config.collAdminOrgs 
  oCode: {type: String, required: true, trim: true}, // Organization Code
  oName: {type: String, required: true, trim: true}, // Organization Name
  entId: {type: String, required: true, trim: true}, // Entities Record ID(_id) - config.collAdminEntis 
  eName: {type: String, required: true, trim: true}, //  Entity/Brand Name
  eCode: {type: String, required: true, trim: true}, // Entity Code
  branch: {type: String, required: false}, // Admin Branchs Record ID(_id) - config.collAdminBranches
  bCode: {type: String, required: false},
  bName: {type: String, required: false},
  aUser: {type: String, required: true, ref: config.collAdminUsers}, // AdminUsers._id
  aRefUID: {type: String, required: true}, // AdminUsers.refUID
  aName: {type: String, required: true}, // AdminUsers.name
  cCategory: {type: String, required: false}, // Call Category: Inbound, Outbound
  cType: {type: String, required: false}, // Call Type: Table Booking, Private Dining, Franchise, Feedback, Contactus, Other
  cFor: {type: String, required: false}, // Call For: Followup, Reminder, Confirmation, Other
  cStatus: {type: String, required: true}, // Call Status: Closed, Callback, Not Answered, Other, Missed Call
  cNum: {type: String, required: true, index: true, unique: true}, // SMPRKMSD_<cnum> Missed Call Number from Sampark

  // Cust Details
  cuUser: {type: String, required: false, ref: config.collCustsUsers}, // CustsUsers._id
  cRefUID: {type: String, required: false}, // CustsUsers.refUID
  cName: {type: String, required: false}, // CustsUsers.name

  name: {type: String, required: true, trim: true}, // Full Name
  mobCc: {type: String, required: true}, // cc - Country Code: +91
  mobNum: {type: String, required: true}, // Mobile Number
  mobCcNum: {type: String, required: true}, // Mobile Number with Country Code
  altMobCc: {type: String, required: false},
  altMobNum: {type: String, required: false},
  altMobCcNum: {type: String, required: false},
  emID: {type: String, required: false, trim: true}, // Email ID
  altEmID: {type: String, required: false, trim: true},
  callogs: {type: String, required: true},
  notes: {type: String, required: false},

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

schema.index({idSeq: 'text', bName: 'text', aName: 'text', name: 'text', mobCcNum: 'text', emID: 'text', cStatus: 'text', cCategory: 'text', cType: 'text', cFor: 'text'});
schema.index({idSeq: 1, mobCcNum: 1, aUser: 1, aRefUID: 1, cCategory: 1, cType: 1, cFor: 1, cStatus: 1, delFlag: -1});
schema.index({cDtTm: -1, cDtStr: -1, uDtTm: -1, uDtStr: -1});

module.exports = mongoose.model(config.collCustsCallLogsClsd, schema);
// --- End: Customers Call Logs Closed Schema --- //
