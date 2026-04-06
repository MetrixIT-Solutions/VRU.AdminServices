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

// --- Begin: Customers Contacts Schema --- //
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

  // Contact Detatils
  cName: {type: String, required: true, trim: true}, // Full Name
  cMobCc: {type: String, required: true}, // cc - Country Code: +91
  cMobNum: {type: String, required: true}, // Mobile Number
  cMobCcNum: {type: String, required: true}, // Mobile Number with Country Code
  cEmID: {type: String, required: false, trim: true}, // Email ID
  cMsg: {type: String, required: false, trim: true},
  cStatus: {type: String, required: false, trim: true}, // New, Contacted
  cNotes: {type: String, required: false, trim: true}, // Contact Notes
  cCmnts: {type: String, required: false, trim: true}, // Contact Comments
  cType: {type: String, required: false}, // Contact Type: Contact, Demo

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

schema.index({cName: 'text', cMobCcNum: 'text', cEmID: 'text',  cStatus: 'text'});
schema.index({branch: 1, delFlag: -1, cMobCcNum: 1, cEmID: 1, cStatus: 1});
schema.index({cDtTm: -1, cDtStr: -1, uDtTm: -1, uDtStr: -1});

module.exports = mongoose.model(config.collCustsContacts, schema);
// --- End: Customers Contacts Schema --- //
