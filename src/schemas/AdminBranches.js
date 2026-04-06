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

// --- Begin: Admin Branches Schema --- //
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

  isPrimary: {type: Boolean, default: false},
  orgId: {type: String, required: true, trim: true}, // Admin Organizations Record ID(_id) - config.collAdminOrgs 
  oCode: {type: String, required: true, trim: true}, // Organization Code
  oName: {type: String, required: true, trim: true}, // Organization Name
  entId: {type: String, required: true, trim: true}, // Entities Record ID(_id) - config.collAdminEntis 
  eName: {type: String, required: true, trim: true}, //  Entity/Brand Name
  eCode: {type: String, required: true, trim: true}, // Entity Code
  bName: {type: String, required: true, index: true, unique: true}, // Full Name
  bCode: {type: String, required: true, index: true, unique: true}, // Short Name
  rType: {type: String, required: true, trim: true}, // Restaurant Type: Buffet, Alacatte, Other
  appPerson: {type: Number, required: false}, // Average Price Per Person
  seatCapacity: {type: Number, required: true},
  bcLaps: {type: Number, required: true}, // Booking Capacity Laps: in minutes

  cPerson: {type: String, required: true}, // Contact Person
  mobCc: {type: String, required: true}, // cc - Country Code: +91
  mobNum: {type: String, required: true}, // Mobile Number
  mobCcNum: {type: String, required: true}, // Mobile Number with Country Code
  emID: {type: String, required: true, trim: true}, // Email ID
  altMobCc: {type: String, required: false}, // cc - Country Code
  altMobNum: {type: String, required: false},
  altMobCcNum: {type: String, required: false},
  altEmID: {type: String, required: false, trim: true},
  fDt: {type: Date, required: false}, // Founded Date - Format = YYYY-MM-DD
  fDtStr: {type: String, required: false}, // Founded Date String - Format = YYYY-MM-DD
  gPeriod: {type: String, default: '15'}, // Grace Period in minutes: 15, 30

  blName: {type: String, required: true}, // Branch Location Name
  houseNum: {type: String, required: true}, // Building Name, House Number, Floor
  area: {type: String, required: true}, // Street / Area
  mandal: {type: String, required: true},  // Mandal / Area Locality
  zip: {type: String, required: true}, // Pincode
  country: {type: String, default: 'India'},
  countryCode: {type: String, default: 'IND'},
  state: {type: String, required: true},
  stateCode: {type: String, required: true},
  district: {type: String, required: true},
  plusCode: {type: Object, required: false},
  geocoordinates: { // geocoordinates
    type: {type: String, default: 'Point'},
    coordinates: {type: [Number], required: false} // <longitude>(-180 and 180), <latitude>(-90 and 90)
  },

  bSlots: [{ 
    _id: {type: String, required: false}, // Lunch, Dinner
    slots: {type: String, required: false}  // 12:00 PM, 1:00 PM
  }],

  bStatus: {type: String, required: true}, // Branch Status: Active, Inactive
  bIcon: {type: String, required: false}, // Branch Icon
  biActualName: {type: String, required: false},
  biPath: {type: String, required: false},

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
schema.index({eName: 'text', bName: 'text', bCode: 'text', cPerson: 'text', mobCcNum: 'text', emID: 'text', blName: 'text'});
schema.index({idSeq: 1, mobCcNum: 1, emID: 1, fDt: 1});
schema.index({idSeq: 1, delFlag: -1, bStatus: 1});
schema.index({delFlag: -1, oCode: 1, eCode: 1, bCode: 1});
schema.index({cDtStr: -1, uDtStr: -1});

module.exports = mongoose.model(config.collAdminBranches, schema);
// --- End: Admin Branches Schema --- //