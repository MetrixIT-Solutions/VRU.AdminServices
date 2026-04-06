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

// --- Begin: Admin User Sessions Closed Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},  // Access Token
  orgId: {type: String, required: true}, // Admin Organizations Record ID(_id) - config.collAdminOrgs 
  oCode: {type: String, required: true}, // Organization Code
  oName: {type: String, required: true}, // Organization Name
  entId: {type: String, required: false}, // Entities Record ID(_id) - config.collAdminEntis 
  eName: {type: String, required: false}, //  Entity/Brand Name
  eCode: {type: String, required: false}, // Entity Code
  branch: {type: String, required: false}, // Admin Branchs Record ID(_id) - config.collAdminBranches
  bName: {type: String, required: false},
  bCode: {type: String, required: false},

  adUser: {type: String, required: true}, // ref: config.collAdminUsers
  aduName: {type: String, required: true}, // Full Name
  aduMobCcNum: {type: String, required: true}, // Mobile Number with Country Code
  aduEmID: {type: String, required: false}, // Email ID
  aduRefUID: {type: String, required: true}, // Reference Unique ID
  aduPrimary: {type: String, required: true}, // Mobile Number or Email

  at: {type: String, required: true}, // App Type: Web App, Mobile App
  dt: {type: String, required: true}, // Device Type: Desktop, Mobile, Tab
  dos: {type: String, required: true}, // Device OS
  dosv: {type: String, required: true}, // Device OS Version
  dvndr: {type: String, required: false}, // Device Vendor(For Mobile / Tab)
  dmodel: {type: String, required: false}, // Device Model(For Mobile / Tab)
  duId: {type: String, required: false}, // Device Unique Id
  ma: {type: String, required: false}, // Mac Address
  ipa: {type: String, required: true}, // IP Address
  ipv: {type: String, required: true}, // IP Version
  bn: {type: String, required: false}, // Browser Name
  bv: {type: String, required: false}, // Browser Version
  ua: {type: String, required: true}, // USer Agent
  uaObj: {type: Object},

  delFlag: {type: Boolean, default: false}, // Deleted Flag
  cDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
  uDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
}, {collection: config.collAdUserSsnsClsd});

schema.index({adUser: 1, orgId: 1, entId: 1, branch: 1, delFlag: -1});
schema.index({uDtStr: -1});

module.exports = mongoose.model(config.collAdUserSsnsClsd, schema);
// --- End: Admin User Sessions Closed Schema --- //
