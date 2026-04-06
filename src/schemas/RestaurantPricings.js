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

// --- Begin: Restaurant Pricings Schema --- //
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

  dType: {type: String, default: 'Regular'}, // Day Type: Regular, Special
  sdStDt: {type: String, required: false}, // Special Day Start Date: YYYY-MM-DD
  sdEdDt: {type: String, required: false}, // Special Day End Date: YYYY-MM-DD
  day: { type: String, required: false},
  vegAmt: {type: Number, required: false}, // Veg Amount Per Person
  nonVegAmt: {type: Number, required: false}, //  Non Veg Amount Per Person
  kidAmt: {type: Number, default: 0}, // Amount Per Kid
  infantAmt: {type: Number, default: 0}, // Amount Per Infant
  vTotalAmt: {type: Number, default: 0}, // Veg Total Amount
  nvTotalAmt: {type: Number, default: 0}, // Non Veg Total Amount
  kTotalAmt: {type: Number, default: 0}, // Kid Total Amount
  iTotalAmt: {type: Number, default: 0}, // Infont Total-Amount
  gst: {type: Number, default: 0}, // GST in Persontage
  serTax: {type: Number, default: 0}, // Service Tax in Persontage

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

schema.index({branch: 1, entId: 1, delFlag: -1, dType: 1});
schema.index({branch: 1, entId: 1, delFlag: -1, dType: 1, sdStDt: 1, sdEdDt: 1});
schema.index({cDtStr: -1, uDtStr: -1});

module.exports = mongoose.model(config.collRestaurantPricings, schema);
// --- End: Restaurant Pricings Schema --- //
