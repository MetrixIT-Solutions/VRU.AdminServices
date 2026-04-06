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

// --- Begin: Customers Offers Schema --- //
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
  bName: {type: String, required: false}, // Full Name

  oType: {type: String, required: true}, // General, Booking Value, Members, Percentage
  coupon: {type: String, required: true, index: true, unique: true}, // Coupon
  title: {type: String, required: true}, // Offer Title
  desc: {type: String, required: true}, // Offer Description
  minbValue: {type: Number, required: false}, // Customer Table Booking - Minimum Value
  minMem: {type: Number, required: false}, // Customers Minimum Members
  dp: {type: Number, required: false}, // Discount in percentage(10%)
  amount: {type: Number, required: false}, // Offer Amount
  sDt: {type: Date, required: false}, // Offer Start Date - Format = YYYY-MM-DD
  sDtStr: {type: String, required: false}, // Offer Start Date - Format = YYYY-MM-DD
  eDt: {type: Date, required: false}, // Offer End Date - Format = YYYY-MM-DD
  eDtStr: {type: String, required: false}, // Offer End Date - Format = YYYY-MM-DD
  oStatus: {type: String, required: true}, // Offer Status: Active, Inactive

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

schema.index({'$**': 'text'});
schema.index({oType: 1, title: 1, desc: 1}, {unique: true});
schema.index({branch: 1, delFlag: -1, oStatus: 1, oType: 1});
schema.index({cDtTm: -1, cDtStr: -1, uDtTm: -1, uDtStr: -1});

module.exports = mongoose.model(config.collCustsOffers, schema);
// --- End: Customers Offers Schema --- //
