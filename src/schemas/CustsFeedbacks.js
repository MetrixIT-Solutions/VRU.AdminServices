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

// --- Begin: Customers Feedbacks Schema --- //
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
  user: {type: String, required: false, ref: config.collCustsUsers}, // CustsUsers._id
  refUID: {type: String, required: false}, // CustsUsers.refUID
  booking: {type: String, required: false, ref: config.collCustsTableBookings},
  bookingId: {type: String, required: false},

  name: {type: String, required: true, trim: true}, // Full Name
  mobCc: {type: String, required: true}, // cc - Country Code: +91
  mobNum: {type: String, required: true}, // Mobile Number
  mobCcNum: {type: String, required: true}, // Mobile Number with Country Code
  emID: {type: String, required: false, trim: true}, // Email ID

  rating: {type: Number, required: true},
  fRating: {type: Number, required: false}, // Food rating
  sRating: {type: Number, required: false}, // service rating
  aRating: {type: Number, required: false}, // Ambience rating
  pRating: {type: Number, required: false}, // Price rating
  ratingStr: {type: String, required: true},
  feedback: {type: String, required: false},
  dob: {type: Date, required: false},
  dobStr: {type: String, required: false},
  anvsrDt: {type: Date, required: false}, // Anniversory
  anvsrDtStr: {type: String, required: false}, // Anniversory
  fgDt: {type: Date, required: false}, // Family Gathering
  fgDtStr: {type: String, required: false}, // Family Gathering
  opDt: {type: Date, required: false}, // Office Party
  opDtStr: {type: String, required: false}, // Office Party
  ccDt: {type: Date, required: false}, // Corporate Celebrations
  ccDtStr: {type: String, required: false}, // Corporate Celebrations

  // qa: [{
  //   _id: {type: String, default: uuidv4()},
  //   question: {type: String, required: false},
  //   answer: {type: [String], required: false}, // Non Veg Amount Per Person
  // }],

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

schema.index({idSeq: 'text', bookingId: 'text', name: 'text', mobCcNum: 'text', emID: 'text', dobStr: 'text', anvsrDtStr: 'text', fgDtStr: 'text', opDtStr: 'text', ccDtStr: 'text'});
schema.index({user: 1, booking: 1, mobCcNum: 1, emID: 1});
schema.index({idSeq: 1, branch: 1, user: 1, booking: 1, delFlag: -1});
schema.index({cDtTm: -1, cDtStr: -1, uDtTm: -1, uDtStr: -1});

module.exports = mongoose.model(config.collCustsFeedbacks, schema);
// --- End: Customers Feedbacks Schema --- //
