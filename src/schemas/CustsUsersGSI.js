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

// --- Begin: Customers Users GSI(Guest Satisfaction Index) Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},

  eUser: {type: String, required: false}, // Customer User Record ID: _id
  cRefUID: {type: String, required: false}, // Customer User Reference Unique ID
  cMyPrimary: {type: String, required: false}, // Customer User Primary - Mobile Number or Email
  orgId: {type: String, required: true, trim: true}, // Admin Organizations Record ID(_id) - config.collAdminOrgs 
  oCode: {type: String, required: true, trim: true}, // Organization Code
  oName: {type: String, required: true, trim: true}, // Organization Name
  entId: {type: String, required: true, trim: true}, // Entities Record ID(_id) - config.collAdminEntis 
  eName: {type: String, required: true, trim: true}, //  Entity/Brand Name
  eCode: {type: String, required: true, trim: true}, // Entity Code
  branch: {type: String, required: true}, // Admin Branchs Record ID(_id) - config.collAdminBranches
  bCode: {type: String, required: true},
  bName: {type: String, required: true}, // Full Name

  captain: {type: String, required: true}, // Restaurant Captain: AdminUsers._id
  cEmail: {type: String, required: false}, // Restaurant Captain Email
  cName: {type: String, required: true}, // Restaurant Captain Name
  tNum: {type: String, required: true}, // Table Number
  sDtStr: {type: String, required: true}, // Food Service Date: YYYY-MM-DD

  gName: {type: String, required: true, trim: true}, // Guest Name
  gMob: {type: String, required: true}, // Guest Mobile Number with Country Code
  gEmID: {type: String, required: false}, // Guest Email ID
  occasion: {type: String, required: false}, // Birthday / Anniversary

  dineSlot: {type: String, required: true},  //Lunch Dinner / Slots
  hdyk: {type: String, required: true},  // How do you know us

  oExp: {type: String, required: true}, // Overall Experience
  oExpVal: {type: Number, required: true}, // Overall Experience Value
  clean: {type: String, required: true}, // Ambiance & Hygiene - Clean & Crisp
  cleanVal: {type: Number, required: true}, // Ambiance & Hygiene - Clean & Crisp Value
  cmfrt: {type: String, required: true}, // Ambiance & Hygiene - Relaxing & Comfortable
  cmfrtVal: {type: Number, required: true}, // Ambiance & Hygiene - Relaxing & Comfortable Value
  bExp: {type: String, required: true}, // Reservation Experience - Booking
  bExpVal: {type: Number, required: true}, // Reservation Experience - Booking Value
  bvrgs: {type: String, required: true}, // Food & Beverages - Beverages
  bvrgsVal: {type: Number, required: true}, // Food & Beverages - Beverages Value
  buffet: {type: String, required: true},// Food & Beverages - Buffet
  buffetVal: {type: Number, required: true}, // Food & Beverages - Buffet Value
  strs: {type: String, required: true}, // Food & Beverages - Starters
  strsVal: {type: Number, required: true}, // Food & Beverages - Starters Value
  dsrts: {type: String, required: true}, // Food & Beverages - Desserts
  dsrtsVal: {type: Number, required: true}, // Food & Beverages - Desserts Value
  lveCntr: {type: String, required: true}, // Live Counter
  lveCntrVal: {type: Number, required: true}, // Live Counter Value
  atntv: {type: String, required: true}, // Service - Attentive
  atntvVal: {type: Number, required: true}, // Service - Attentive Value
  crts: {type: String, required: true}, // Service - Courteous & Concern
  crtsVal: {type: Number, required: true}, // Service - Courteous & Concern Value
  bilExp: {type: String, required: true},  // Billing Experience
  bilExpVal: {type: Number, required: true},  // Billing Experience Value
  comments: {type: String, required: false}, // Suggestion & Comments  if any

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
}, {collection: config.collCustsUsersGSI});

// schema.index({'$**': 'text'});
schema.index({bName: 'text', cEmail: 'text', cName: 'text', tNum: 'text', gName: 'text', gMob: 'text'});
schema.index({branch: 1, sDtStr: 1, gMob: 1}, {unique: true});
schema.index({branch: 1, delFlag: -1});
schema.index({cDtStr: -1});

module.exports = mongoose.model(config.collCustsUsersGSI, schema);
// --- End: Customers Users GSI(Guest Satisfaction Index) Schema --- //
