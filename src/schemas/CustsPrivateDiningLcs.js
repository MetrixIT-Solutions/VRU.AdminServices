
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

// --- Begin: Customers Private Dining Lifecycles Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},
  pdId: {type: String, required: true, trim: true},
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
  bStatus: {type: String, required: true}, // Booking Status: Confirmed, Closed, Cancelled

  // Contact Detatils
  bookingId: {type: String, required: true}, // (CurrYear-2022) + DayofYear + CurrTime in Seconds + Last 4 digits of Mobile Number
  name: {type: String, required: true, trim: true}, // Full Name
  mobCc: {type: String, required: true}, // cc - Country Code: +91
  mobNum: {type: String, required: true}, // Mobile Number
  mobCcNum: {type: String, required: true}, // Mobile Number with Country Code
  emID: {type: String, required: false, trim: true}, // Email ID
  bookInfo: {type: String, required: false, trim: true},
  bookingFor: {type: String, required: true, trim: true}, // Lunch or Dinner
  occassion: {type: String, required: false},
  oType: {type: String, required: false}, // Occassion Type

  vegCount: {type: Number, default: 0}, // Veg Diners Count
  nonVegCount: {type: Number, default: 0}, // Non Veg Diners Count
  kidsCount: {type: Number, default: 0}, // Kids Count(6 to 10 Years)
  tDinersCount: {type: Number, required: false}, // Total Diners Count*
  vegAmt: {type: Number, default: 0}, // Veg Amount Per Person
  nonVegAmt: {type: Number, default: 0}, // Non Veg Amount Per Person
  kidAmt: {type: Number, default: 0}, // Amount Per Kid
  tDineAmt: {type: Number, required: false}, // Total Dine Amount(vegAmt * vegCount + nonVegAmt * nonVegCount + kidAmt * kidsCount)

  // Location & Date Time
  bDtTm: {type: Date, required: true}, // Date & Time - Format = YYYY-MM-DD HH:mm
  bDt: {type: String, required: true}, // Date - Format = YYYY-MM-DD
  bTm: {type: String, required: true},
  bDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm
  country: {type: String, required: true},
  countryCode: {type: String, required: true}, // Country Code: IND
  state: {type: String, required: false}, // TS
  stateCode: {type: String, required: false}, // TS
  city: {type: String, required: true}, // City or District
  cityCode: {type: String, required: true}, // HYD
  location: {type: String, required: true},
  plusCode: {type: Object, required: false},
  geocoordinates: { // geocoordinates
    type: {type: String, default: 'Point'},
    coordinates: {type: [Number], required: false} // <longitude>(-180 and 180), <latitude>(-90 and 90)
  },

  delFlag: {type: Boolean, default: false}, // Deleted Flag
  cuType: {type: String, required: true}, // Created User Type: Customer, Admin
  cUser: {type:String, required: true}, // Created Users._id
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

schema.index({delFlag: -1, pdId: 1});
schema.index({cDtStr: -1});

module.exports = mongoose.model(config.collCustsPrivateDiningLcs, schema);
// --- End: Customers Private Dining Lifecycles Schema --- //

