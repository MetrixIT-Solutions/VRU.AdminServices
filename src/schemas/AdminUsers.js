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

// --- Begin: Admin Users Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},
  idSeq: {
    seq: {type: String, required: true}, // Country, State and Dist Code and Year(2022) Moth(10) Day(10)
    countryCode: {type: String, required: false}, // Country Code: IND
    stateCode: {type: String, required: false}, // TS
    distCode: {type: String, required: false}, // HYD
    zip: {type: String, required: false},
    aLocality: {type: String, required: false}, // Area Locality, Mandal
    area: {type: String, required: false}, // Area, Village
    year: {type: Number, required: true},
    month: {type: Number, required: true},
    day: {type: Number, required: true}
  },

  orgId: {type: String, required: true, trim: true}, // Admin Organizations Record ID(_id) - config.collAdminOrgs 
  oCode: {type: String, required: true, trim: true}, // Organization Code
  oName: {type: String, required: true, trim: true}, // Organization Name
  oPlan: {type: String, required: true, trim: true}, // Organization Plan: VRU - NA
  entId: {type: String, required: false, trim: true}, // Entities Record ID(_id) - config.collAdminEntis 
  eName: {type: String, required: false, trim: true}, //  Entity/Brand Name
  eCode: {type: String, required: false, trim: true}, // Entity Code
  branch: {type: String, required: false}, // Admin Branchs Record ID(_id) - config.collAdminBranches
  bCode: {type: String, required: false},
  bName: {type: String, required: false}, 

  oStatus: {type: String, default: 'Active'},  // Organization -- Active, Inactive
  eStatus: {type: String, default: 'Active'}, //  Entity -- Active, Inactive
  bStatus: {type: String, default: 'Active'}, // Branch -- Active, Inactive

  name: {type: String, required: true, trim: true}, // Full Name
  sName: {type: String, required: true, trim: true}, // Short Name
  mobCc: {type: String, required: true}, // cc - Country Code: +91
  mobNum: {type: String, required: true}, // Mobile Number
  mobCcNum: {type: String, required: true}, // Mobile Number with Country Code
  emID: {type: String, required: true, trim: true}, // Email ID
  refUID: {type: String, required: true, index: true, unique: true}, // Reference Unique ID: oCode_MobNum
  myPrimary: {type: String, required: true, index: true, unique: true}, // Mobile Number or Email: oCode_Email
  mpType: {type: String, required: true}, // My Primary Type: Email or Mobile
  mpVerifyFlag: {type: Boolean, default: false},
  altMobCc: {type: String, required: false}, // cc - Country Code
  altMobNum: {type: String, required: false},
  altMobCcNum: {type: String, required: false},
  altEmID: {type: String, required: false, trim: true},
  dob: {type: Date, required: false}, // Date of Birth - Format = YYYY-MM-DD
  dobStr: {type: String, required: false}, // Date of Birth String - Format = YYYY-MM-DD
  gender: {type: String, required: false},

  houseNum: {type: String, required: false}, // HouseNumber 
  area: {type: String, required: false}, // Street / Area
  zip: {type: String, required: false}, // Pincode
  country: {type: String, default: 'India'},
  countryCode: {type: String, default: 'IND'},
  state: {type: String, required: false},
  stateCode: {type: String, required: false},
  district: {type: String, required: false},
  mandal: {type: String, required: false},  // Mandal / Area Locality

  uStatus: {type: String, required: true}, // User Status: Active, Inactive(Contact Support), Hold(24Hrs), Blocked(1Hr)
  uType: {type: String, required: true}, // User Type: VRU, Board, Entity, Branch
  uRole: {type: String, required: true}, // User Role: Admin, Manager, Master Chef, Head Chef, Assistant Chef, Executive
  urCode: {type: String, required: true}, // User Role Code
  urSeq: {type: Number, required: true}, // User Role Code
  mPin: {type: String, required: false},
  mPinLav: {type: String, required: false}, // Lav(Lavanam) - Salt
  logPswd: {type: String, required: false},
  logPswdLav: {type: String, required: false}, // Lav(Lavanam) - Salt
  otp: {type: String, required: false},
  otpLav: {type: String, required: false}, // Lav(Lavanam) - Salt
  mdTokens: {type: [String], required: false, default: []}, // Mobile Device Tokens
  wdTokens: {type: [String], required: false, default: []}, // Web Device Tokens

  pIcon: {type: String, required: false}, // Profile Icon
  piActualName: {type: String, required: false},
  piPath: {type: String, required: false},

  agentInfo: {
    id: {type: String, required: false}, // AgentId
    password: {type: String, required: false}, // AgentPassword
    extension: {type: String, required: false}  // Extension
  },

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
schema.index({name: 'text', sName: 'text', mobCcNum: 'text', emID: 'text', refUID: 'text'});
schema.index({refUID: 1, myPrimary: 1, delFlag: -1});
schema.index({orgId: 1, entId: 1, branch: 1, delFlag: -1, uStatus: 1, uType: 1, uRole: 1, urCode: 1, urSeq: 1});
schema.index({cDtStr: -1, uDtStr: -1});

module.exports = mongoose.model(config.collAdminUsers, schema);
// --- End: Admin User Schema --- //
