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

// --- Begin: Admin Organizations Schema --- //
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

  oName: {type: String, required: true, index: true, unique: true}, // Organization Name
  oCode: {type: String, required: true, index: true, unique: true}, // Organization Code
  cPerson: {type: String, required: false}, // Contact Person
  mobCc: {type: String, required: true}, // cc - Country Code: +91
  mobNum: {type: String, required: true}, // Mobile Number
  mobCcNum: {type: String, required: true}, // Mobile Number with Country Code
  emID: {type: String, required: true, trim: true}, // Email ID
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

  eCount: {type: Number, default: 0}, // entities-Count
  eNames: {type: [String], required: false}, // Entities Names
  about: {type: String, required: false}, // About Organization

  oIcon: {type: String, required: false}, // Org Icon
  oiActualName: {type: String, required: false},
  oiPath: {type: String, required: false},
  oFIcon: {type: String, required: false}, // Org Fav Icon
  oFiActualName: {type: String, required: false},
  oFiPath: {type: String, required: false},

  oPlan: {type: String, required: true}, // Org Subscription Plan: Basic, Standard, Advanced, Premium
  oeLimit: {type: Number, default: 1}, // Org Entities Limit
  oebLimit: {type: Number, default: 1}, // Org Entity Branches Limit
  oauLimit: {type: Number, default: 1}, // Org Admin Users Limit
  oeuLimit: {type: Number, default: 2}, // Org Employees Users Limit
  osmsPrice: {type: Number, required: false}, // Org Per SMS Price
  oEmLimit: {type: Number, default: 100}, // Org Free Emails Limit per Day
  oEmPrice: {type: Number, required: false}, // Org Per Email Price
  oEmMinPrice: {type: Number, required: false}, // Org Minimum Email Price per Day
  oStatus: {type: String, required: true}, // Org Status: Active, Inactive
  obType: {type: String, required: true}, // Org Business Type: Restaurant, Hotel, Cafe, Lounge, Pub, Dining Venue, Other

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

schema.index({oName: 'text', oCode: 'text', obType: 'text', mobCcNum: 'text', emID: 'text', oPlan: 'text', district: 'text'});
schema.index({delFlag: -1, oStatus: 1, oPlan: 1});
schema.index({cDtStr: -1, uDtStr: -1});

module.exports = mongoose.model(config.collAdminOrgs, schema);
// --- End: Admin Orgs Schema --- //
