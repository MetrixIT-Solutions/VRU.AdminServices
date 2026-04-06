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

// --- Begin: Customers Franchise Schema --- //
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
  entId: {type: String, required: true, trim: true}, // Entities Record ID(_id) - config.collAdminEntis 
  eName: {type: String, required: true, trim: true}, //  Entity/Brand Name
  eCode: {type: String, required: true, trim: true}, // Entity Code
  branch: {type: String, required: false}, // Admin Branchs Record ID(_id) - config.collAdminBranches
  bCode: {type: String, required: false},
  user: {type: String, required: false, ref: config.collCustsUsers}, // CustsUsers._id
  refUID: {type: String, required: false}, // CustsUsers.refUID

  // Contact Details
  name: {type: String, required: true, trim: true}, // Full Name
  mobCc: {type: String, required: true}, // cc - Country Code: +91
  mobNum: {type: String, required: true}, // Mobile Number
  mobCcNum: {type: String, required: true}, // Mobile Number with Country Code
  emID: {type: String, required: false, trim: true}, // Email ID

  fReqID: {type: String, required: true}, // Franchise Request ID:
  fRegion: {type: String, required: false}, // Franchise Region:
  fType: {type: String, required: false}, // Franchise Type:
  location: {type: String, required: false}, //
  fState: {type: String, required: true}, //
  fStateCode: {type: String, required: true}, //
  fCity: {type: String, required: true}, //
  fCityCode: {type: String, required: false}, //
  fArea: {type: String, required: true}, //
  fPincode: {type: String, required: true}, //
  fStatus: {type: String, required: true}, // New, Inreview, Approved, Rejected
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

schema.index({name: 'text', mobCcNum: 'text', emID: 'text', fCity: 'text'});
schema.index({orgId: 1, entId: 1, delFlag: -1, fStatus: 1});
schema.index({cDtStr: -1, uDtStr: -1});

module.exports = mongoose.model(config.collCustsFranchise, schema);
// --- Begin: Customers Franchise Schema --- //
