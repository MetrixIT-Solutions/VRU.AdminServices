/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Nov 2025
 */

var config = require('config');
var mongoose = require('mongoose');
var {v4: uuidv4} = require('uuid');

mongoose.createConnection(config.mongoDBConnection);
const Schema = mongoose.Schema;

// --- Begin: Customers Table Bookings Lifecycles Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},
  orgId: {type: String, required: true, trim: true}, // Admin Organizations Record ID(_id) - config.collAdminOrgs 
  oCode: {type: String, required: true, trim: true}, // Organization Code
  oName: {type: String, required: true, trim: true}, // Organization Name
  entId: {type: String, required: true, trim: true}, // Entities Record ID(_id) - config.collAdminEntis 
  eName: {type: String, required: true, trim: true}, //  Entity/Brand Name
  eCode: {type: String, required: true, trim: true}, // Entity Code
  branch: {type: String, required: false}, // Admin Branchs Record ID(_id) - config.collAdminBranches
  bCode: {type: String, required: false},
  bName: {type: String, required: false},
   
  bId: {type: String, required: true, trim: true}, // Booking Record ID
  bookingId: {type: String, required: true}, // Booking ID
  bStatus: {type: String, required: true}, // Booking Status: Booked, Confirmed, Waiting, Seated, Closed, Cancelled, Missed/Absent

  // Contact Detatils
  rFor: {type: String, required: false}, // Reservation For: Lunch, Dinner
  name: {type: String, required: true, trim: true}, // Full Name
  mobCc: {type: String, required: true}, // cc - Country Code: +91
  mobNum: {type: String, required: true}, // Mobile Number
  mobCcNum: {type: String, required: true}, // Mobile Number with Country Code
  emID: {type: String, required: false, trim: true}, // Email ID
  bookInfo: {type: String, required: false, trim: true},
  occassion: {type: String, required: false},
  oType: {type: String, required: false}, // Occassion Type
  bookType: {type: String, required: true}, // Booking Type
  
  vegCount: {type: Number, default: 0}, // Veg Guests Count
  nonVegCount: {type: Number, default: 0}, // Non Veg Guests Count
  kidsCount: {type: Number, default: 0}, // Kids Count(6 to 10 Years)
  infantsCount: {type: Number, default: 0}, // Infants Count(0 to 5 Years)
  totalAmt: {type: Number, required: true},
  dAmount: {type: Number, required: false}, // Discount Amount
  netAmt: {type: Number, required: true},

  // Location & Date Time
  bDtTm: {type: Date, required: true}, // Date & Time - Format = YYYY-MM-DD HH:mm
  bDt: {type: String, required: true}, // Date - Format = YYYY-MM-DD
  bTm: {type: String, required: true},
  bDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm

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

schema.index({delFlag: -1, bId: 1, bookingId: 1});
schema.index({cDtStr: -1});

module.exports = mongoose.model(config.collCustsTableBookingsLcs, schema);
// --- End: Customers Table Bookings Lifecycles Schema --- //
