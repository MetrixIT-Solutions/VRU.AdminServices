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

// --- Begin: Customers Users GSI(Guest Satisfaction Index) Analysis Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},
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

  dType: {type: String, required: true}, // Date Type: 2025M01, 2025M02, ...2025M12, 2025Q1, 2025Q2, 2025Q3, 2025Q4, 2025H1, 2025H2, 2025Y, TY
  oExpCnt: {type: Number, required: true}, // 1000
  oExpVal: {type: Number, required: true}, // Overall Experience Value 
  cleanCnt: {type: Number, required: true},
  cleanVal: {type: Number, required: true}, // Ambiance & Hygiene - Clean & Crisp Value
  cmfrtCnt: {type: Number, required: true},
  cmfrtVal: {type: Number, required: true}, // Ambiance & Hygiene - Relaxing & Comfortable Value
  bExpCnt: {type: Number, required: true},
  bExpVal: {type: Number, required: true}, // Reservation Experience - Booking Value
  bvrgsCnt: {type: Number, required: true},
  bvrgsVal: {type: Number, required: true}, // Food & Beverages - Beverages Value
  buffetCnt: {type: Number, required: true},
  buffetVal: {type: Number, required: true}, // Food & Beverages - Buffet Value
  strsCnt: {type: Number, required: true},
  strsVal: {type: Number, required: true}, // Food & Beverages - Starters Value
  dsrtsCnt: {type: Number, required: true},
  dsrtsVal: {type: Number, required: true}, // Food & Beverages - Desserts Value
  lveCntrCnt: {type: Number, required: true}, // 
  lveCntrVal: {type: Number, required: true}, // Live Counter Value
  atntvCnt: {type: Number, required: true},
  atntvVal: {type: Number, required: true}, // Service - Attentive Value
  crtsCnt: {type: Number, required: true},
  crtsVal: {type: Number, required: true}, // Service - Courteous & Concern Value
  bilExpCnt: {type: Number, required: true}, 
  bilExpVal: {type: Number, required: true},  // Billing Experience Value
});

schema.index({bName: 'text', cEmail: 'text', cName: 'text', tNum: 'text'});
schema.index({branch: 1, captain: 1, dType: 1}, {unique: true});

module.exports = mongoose.model(config.collCustsUsersGSIAns, schema);
// --- End: Customers Users GSI(Guest Satisfaction Index) Analysis Schema --- //
