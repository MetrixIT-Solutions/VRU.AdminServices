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

// --- Begin: Customers Table Bookings Canceled Schema --- //
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
  bName: {type: String, required: false},
  user: {type: String, required: true, ref: config.collCustsUsers}, // CustsUsers._id
  refUID: {type: String, required: true}, // CustsUsers.refUID

  // Contact Detatils
  rFor: {type: String, required: false}, // Reservation For: Lunch, Dinner
  bookingId: {type: String, required: true, index: true, unique: true},
  name: {type: String, required: true, trim: true}, // Full Name
  altCntPerson: {type: String, required: false, trim: true}, // Atlernate Contact Person
  mobCc: {type: String, required: true}, // cc - Country Code: +91
  mobNum: {type: String, required: true}, // Mobile Number
  mobCcNum: {type: String, required: true}, // Mobile Number with Country Code
  altMobCc: {type: String, required: false}, // Alternate cc - Country Code: +91
  altMobNum: {type: String, required: false}, // Alternate Mobile Number
  altMobCcNum: {type: String, required: false}, // Alternate Mobile Number with Country Code
  emID: {type: String, required: false, trim: true}, // Email ID
  bookInfo: {type: String, required: false, trim: true},
  occassion: {type: String, required: false},
  oType: {type: String, required: false}, // Occassion Type
  bookType: {type: String, required: true}, // Booking Type

  vegCount: {type: Number, default: 0}, // Veg Guests Count
  vegAmt: {type: Number, default: 0}, // Veg Amount Per Person
  nonVegCount: {type: Number, default: 0}, // Non Veg Guests Count
  nonVegAmt: {type: Number, default: 0}, // Non Veg Amount Per Person
  kidsCount: {type: Number, default: 0}, // Kids Count(6 to 10 Years)
  kidAmt: {type: Number, default: 0}, // Amount Per Kid
  infantsCount: {type: Number, default: 0}, // Infants Count(0 to 5 Years)
  infantAmt: {type: Number, default: 0}, // Amount Per Infant
  totalAmt: {type: Number, required: true}, // (vegCount * vegAmt + nonVegCount * nonVegAmt + kidsCount * kidAmt + infantsCount * infantAmt)
  dAmount: {type: Number, required: false}, // Discount Amount (From offers and restaurant discount)
  netAmt: {type: Number, required: true}, // totalAmt - dAmount
  gst: {type: Number, default: 0},
  gstAmt: {type: Number, default: 0}, // netAmt * gst/100
  serTax: {type: Number, default: 0}, // Service Tax(%)
  serTaxAmt: {type: Number, default: 0}, // (netAmt * 0.4 * serTax)/100
  netTotalAmt: {type: Number, required: true}, // netAmt + gstAmt + serTaxAmt

  actGstAmt: {type: Number, default: 0}, // totalAmt * gst/100
  actSerTaxAmt: {type: Number, default: 0}, //  (totalAmt * 0.4 * serTax)/100
  actTotalNetAmt: {type: Number, required: true}, // totalAmt + actGstAmt + actSerTaxAmt
  totalSaving: {type: Number, default: 0}, // actTotalNetAmt - netTotalAmt

  // Offer Details
  offer: {type: String, required: false, ref: config.collCustsOffers}, // CustsOffers._id
  coupon: {type: String, required: false,}, // Coupon
  dp: {type: Number, required: false}, // Discount in percentage(10%)

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
}, {collection: config.collCustsTableBookingsCanceled});

schema.index({idSeq: 'text', bookingId: 'text', name: 'text', mobCcNum: 'text', emID: 'text', occassion: 'text', bStatus: 'text', bDtStr: 'text', location: 'text'});
schema.index({user: 1, mobCcNum: 1, emID: 1});
schema.index({idSeq: 1, branch: 1, user: 1, delFlag: -1, bStatus: 1, offer: 1});
schema.index({cDtTm: -1, cDtStr: -1, uDtTm: -1, uDtStr: -1});

module.exports = mongoose.model(config.collCustsTableBookingsCanceled, schema);
// --- End: Customers Table Bookings Canceled Schema --- //
