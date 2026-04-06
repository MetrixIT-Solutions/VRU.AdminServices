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

// --- Begin: Customers Users Schema --- //
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
  oeIds: {type: [String], required: false},
  oebIds: {type: [String], required: false},
  oebInfo: [{
    _id: {type: String, default: uuidv4()},
    entId: {type: String, required: false}, // Entities Record ID(_id) - config.collAdminEntis 
    eName: {type: String, required: false}, //  Entity/Brand Name
    eCode: {type: String, required: false}, // Entity Code
    branch: {type: String, required: false}, // Admin Branchs Record ID(_id) - config.collAdminBranches
    bCode: {type: String, required: false},
    bName: {type: String, required: false}, //  Entity/Brand Name
  }],

  name: {type: String, required: true, trim: true}, // Full Name
  sName: {type: String, required: true, trim: true}, // Short Name
  mobCc: {type: String, required: true}, // cc - Country Code: +91
  mobNum: {type: String, required: true}, // Mobile Number
  mobCcNum: {type: String, required: true}, // Mobile Number with Country Code
  emID: {type: String, required: false, trim: true}, // Email ID
  refUID: {type: String, required: true, index: true, unique: true}, // Reference Unique ID
  myPrimary: {type: String, required: true, index: true, unique: true}, // Mobile Number or Email
  mpType: {type: String, required: true}, // My Primary Type:  Email or Mobile
  mpVerifyFlag: {type: Boolean, default: false},
  altMobCc: {type: String, required: false}, // cc - Country Code
  altMobNum: {type: String, required: false},
  altMobCcNum: {type: String, required: false},
  altEmID: {type: String, required: false, trim: true},
  dob: {type: Date, required: false}, // Date of Birth - Format = YYYY-MM-DD
  dobStr: {type: String, required: false}, // Date of Birth String - Format = YYYY-MM-DD
  gender: {type: String, required: false},

  uStatus: {type: String, required: true}, // User Status: Active, Inactive(Contact Support), Hold(24Hrs), Blocked(1Hr)
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
schema.index({name: 'text', sName: 'text', mobCcNum: 'text', emID: 'text', refUID: 'text', uStatus: 'text'});
schema.index({delFlag: -1, orgId: 1, oeIds: 1});
schema.index({delFlag: -1, orgId: 1, oebIds: 1});
schema.index({cDtStr: -1, uDtStr: -1});

module.exports = mongoose.model(config.collCustsUsers, schema);
// --- End: Customers Users Schema --- //
