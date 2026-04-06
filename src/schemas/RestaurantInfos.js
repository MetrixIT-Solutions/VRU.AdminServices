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

// --- Begin: Restaurant Informations Schema --- //
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

  seatCapacity: {type: Number, required: true},
  bcLaps: {type: Number, required: true}, // Booking Capacity Laps: in minutes

  title: {type: String, required: false}, // Special Day Title: event, occusion
  dType: {type: String, default: 'Regular'}, // Day Type: Regular, Special
  sdStDt: {type: String, required: false}, // Special Day Start Date: YYYY-MM-DD
  sdEtDt: {type: String, required: false}, // Special Day End Date: YYYY-MM-DD
  wVegAmt: {type: Number, required: true}, // Week Day - Veg Amount Per Person
  wNonVegAmt: {type: Number, required: true}, // Week Day - Non Veg Amount Per Person
  wKidAmt: {type: Number, default: 0}, // Week Day - Amount Per Kid
  wInfantAmt: {type: Number, default: 0}, // Week Day - Amount Per Infant
  wGst: {type: Number, default: 0}, // Week Day in Persontage
  wSerTax: {type: Number, default: 0}, // Week Day - Service Tax in Persontage
  wvTotalAmt: {type: Number, required: true}, // Week Day Veg Total Amount
  wnvTotalAmt: {type: Number, required: true}, // Week Day Non Veg Total Amount
  wkTotalAmt: {type: Number, default: 0}, // Week Day Kid Total Amount
  wiTotalAmt: {type: Number, default: 0}, // Week Day Infant Total Amount

  weVegAmt: {type: Number, required: true}, // Week End - Veg Amount Per Person
  weNonVegAmt: {type: Number, required: true}, // Week End - Non Veg Amount Per Person
  weKidAmt: {type: Number, default: 0}, // Week End - Amount Per Kid
  weInfantAmt: {type: Number, default: 0}, // Week End - Amount Per Infant
  weGst: {type: Number, default: 0}, // Week End in Persontage
  weSerTax: {type: Number, default: 0}, // Week End - Service Tax in Persontage
  wevTotalAmt: {type: Number, required: true}, // Week End Veg Total Amount
  wenvTotalAmt: {type: Number, required: true}, // Week End Non Veg Total Amount
  wekTotalAmt: {type: Number, default: 0}, // Week End Kid Total Amount
  weiTotalAmt: {type: Number, default: 0}, // Week End Infant Total Amount

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

schema.index({branch: 1, delFlag: -1, dType: 1});
schema.index({branch: 1, delFlag: -1, dType: 1, sdStDt: 1, sdEtDt: 1});
schema.index({cDtTm: -1, cDtStr: -1, uDtTm: -1, uDtStr: -1});

module.exports = mongoose.model(config.collRestaurantInfos, schema);
// --- End: Restaurant Informations Schema --- //
