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

// --- Begin: Customers Catering Services Schema --- //
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
  user: {type: String, required: true}, // CustsUsers._id
  refUID: {type: String, required: true}, // CustsUsers.refUID

  eStatus: {type: String, required: true}, // Event Status: Requested, Confirmed, Closed, Cancelled
  eventId: {type: String, required: true, index: true, unique: true}, // (CurrYear-2022) + DayofYear + CurrTime in Seconds + Last 4 digits of Mobile Number
  name: {type: String, required: true, trim: true}, // Full Name
  mobCc: {type: String, required: true}, // cc - Country Code: +91
  mobNum: {type: String, required: true}, // Mobile Number
  mobCcNum: {type: String, required: true}, // Mobile Number with Country Code
  emID: {type: String, required: false, trim: true}, // Email ID
  numPersons: {type: String, required: false}, // Number of Persons
  serviceFor: {type: String, required: true, trim: true}, // Breakfast, Lunch, Dinner, All
  eDt: {type: Date, required: true}, // Event Date
  eDtStr: {type: String, required: true, trim: true}, // Event Date String
  eLocation: {type: String, required: true, trim: true}, // Event Location
  eInfo: {type: String, required: false, trim: true}, // Event Information
  occassion: {type: String, required: false},
  esNotes: {type: String, required: false}, // Event Status Notes
  esLogs: [{ // Event Status Logs
    _id: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
    cuType: {type: String, required: true}, // Created User Type: Customer, Admin
    cUser: {type: String, required: true}, // Created Users._id
    cuName: {type: String, required: true}, // Created Users.name
    status: {type: String, required: true},
    notes: {type: String, required: false}
  }],

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

schema.index({name: 'text', mobCcNum: 'text', eLocation: 'text', eventId: 'text'});
schema.index({user: 1, orgId: 1, entId: 1, branch: 1, delFlag: -1, eStatus: 1});
schema.index({eDtStr: 1, uDtStr: -1});

module.exports = mongoose.model(config.collCustsCateringSrvcs, schema);
// --- End: Customers Catering Services Schema --- //
