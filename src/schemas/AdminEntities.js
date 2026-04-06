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

// --- Begin: Admin Entities Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},
  idSeq: {
    seq: {type: String, required: true}, // Country, State and Dist Code and Year(2022) Moth(10) Day(10)
    countryCode: {type: String, required: false}, // Country Code: IND
    stateCode: {type: String, required: false}, // TS
    year: {type: Number, required: true},
    month: {type: Number, required: true},
    day: {type: Number, required: true}
  },
  orgId: {type: String, required: true, trim: true}, // Admin Organizations Record ID(_id) - config.collAdminOrgs 
  oCode: {type: String, required: true, trim: true}, // Organization Code
  obType: {type: String, required: true}, // Org Business Type: Restaurant, Hotel, Cafe, Lounge, Pub, Dining Venue, Other
  oName: {type: String, required: true, trim: true}, // Organization Name

  eName: {type: String, required: true}, //  Entity/Brand Name
  eCode: {type: String, required: true}, // Entity Code
  rType: {type: String, required: true, trim: true}, // Restaurant Type: Buffet, Alacarte, Other
  appPerson: {type: Number, required: false}, // Average Price Per Person
  seatCapacity: {type: Number, required: false},
  bcLaps: {type: Number, required: false}, // Booking Capacity Laps: in minutes
  cPerson: {type: String, required: false}, // Contact Person
  mobCc: {type: String, required: true}, // cc - Country Code: +91
  mobNum: {type: String, required: true}, // Mobile Number
  mobCcNum: {type: String, required: true}, // Mobile Number with Country Code
  emID: {type: String, required: false, trim: true}, // Email ID
  altMobCc: {type: String, required: false}, // cc - Country Code
  altMobNum: {type: String, required: false},
  altMobCcNum: {type: String, required: false},
  altEmID: {type: String, required: false, trim: true},
  doi: {type: String, required: false, trim: true}, // Date Of Incorporation
  gst: {type: String, required: false, trim: true}, // GST Number
  pan: {type: String, required: false, trim: true}, // PAN Number
  cin: {type: String, required: false, trim: true}, // Corporate Identification Number
  tan: {type: String, required: false, trim: true}, // Tax Deduction Account Number

  houseNum: {type: String, required: true}, // House Number, Building Name
  area: {type: String, required: true}, // Street / Area
  zip: {type: String, required: true}, // Pincode
  country: {type: String, default: 'India'},
  countryCode: {type: String, default: 'IND'},
  state: {type: String, required: true},
  stateCode: {type: String, required: true},
  district: {type: String, required: true},
  mandal: {type: String, required: false},  // Mandal / Area Locality
  geocoordinates: { // geocoordinates
    type: {type: String, default: 'Point'},
    coordinates: {type: [Number], required: false} // <longitude>(-180 and 180), <latitude>(-90 and 90)
  },
  bCount: {type: Number, default: 1}, // branch-Count
  rbNames: {type: [String], required: false}, // Restaurant Branch Names

  bSlots: [{ 
    _id: {type: String, required: false}, // Lunch, Dinner
    slots: {type: String, required: false}  // 12:00 PM, 1:00 PM
  }],

  eIcon: {type: String, required: false}, // Entity Icon
  eiActualName: {type: String, required: false},
  eiPath: {type: String, required: false},
  eFIcon: {type: String, required: false}, // Entity Fav Icon
  eFiActualName: {type: String, required: false},
  eFiPath: {type: String, required: false},

  eStatus: {type: String, required: true}, // Entities Status: Active, Inactive

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
schema.index({eName: 'text', eCode: 'text', obType: 'text', rType: 'text', cPerson: 'text', mobCcNum: 'text', emID: 'text', district: 'text'});
schema.index({orgId: 1, eName: 1}, {unique: true});
schema.index({orgId: 1, eCode: 1}, {unique: true});
schema.index({orgId: 1, delFlag: -1, eStatus: 1});
schema.index({cDtStr: -1, uDtStr: -1});

module.exports = mongoose.model(config.collAdminEntis, schema);
// --- End: Admin Entities Schema --- //
