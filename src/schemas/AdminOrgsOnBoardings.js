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

// --- Begin: Admin Orgs On-Boardings Schema --- //
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
  mobCcNum: {type: String, required: true, index: true, unique: true}, // Mobile Number with Country Code
  emID: {type: String, required: true, index: true, unique: true, trim: true}, // Email ID
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
  about: {type: String, required: false}, // About Organization
  isActive: {type: Boolean, default: false}, 

  oPlan: {type: String, required: true}, // Org Subscription Plan: Basic, Standard, Advanced, Premium
  oeLimit: {type: Number, default: 1}, // Org Entities Limit
  oebLimit: {type: Number, default: 1}, // Org Entity Branches Limit
  oauLimit: {type: Number, default: 1}, // Org Admin Users Limit
  oeuLimit: {type: Number, default: 2}, // Org Employees Users Limit
  osmsPrice: {type: Number, required: false}, // Org Per SMS Price
  oEmLimit: {type: Number, default: 100}, // Org Free Emails Limit per Day
  oEmPrice: {type: Number, required: false}, // Org Per Email Price
  oEmMinPrice: {type: Number, required: false}, // Org Minimum Email Price per Day
  oobStatus: {type: String, required: true}, // Org "On Board" Status: Requested, Approved, Rejected
  oobsMsg: {type: String, required: false}, // On Board Status Message for Organization
  oobsNotes: {type: String, required: false}, // On Board Status Notes for Internal
  obType: {type: String, required: true}, // Org Business Type: Restaurant, Hotel, Cafe, Lounge, Pub, Dining Venue, Other
   
  aprvdDtStr: {type: String, required: false}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
  rjctdDtStr: {type: String, required: false}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss

  delFlag: {type: Boolean, default: false}, // Deleted Flag
  cuType: {type: String, required: true}, // Created User Type: Customer, Admin
  cUser: {type: String, required: true}, // Created Users._id
  cuName: {type: String, required: true}, // Created Users.name
  cDtTm: {type: Date, required: true}, // Date & Time - Format = YYYY-MM-DD HH:mm:ss
  cDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
  uuType: {type: String, required: true}, // Updated User Type: Customer, Admin
  uUser: {type: String, required: true}, // Updated Users._id
  uuName: {type: String, required: true}, // Updated Users.name
  uDtTm: {type: Date, required: true}, // Date & Time - Format = YYYY-MM-DD HH:mm:ss
  uDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
});

schema.index({oName: 'text', oCode: 'text', obType: 'text', mobCcNum: 'text', emID: 'text',  oPlan: 'text', cPerson: 'text', district: 'text'});
schema.index({delFlag: -1, oPlan: 1, oobStatus: 1});
schema.index({delFlag: -1, zip: 1, district: 1, state: 1});
schema.index({cDtStr: -1, uDtStr: -1, doi: 1});

module.exports = mongoose.model(config.collAdminOrgsOnBoardings, schema);
// --- End: Admin Orgs On-Boardings Schema --- //
