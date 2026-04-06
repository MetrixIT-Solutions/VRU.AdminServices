/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

var config = require('config');
var mongoose = require('mongoose');
var { v4: uuidv4 } = require('uuid');

mongoose.createConnection(config.mongoDBConnection);
const Schema = mongoose.Schema;

// --- Begin: SMS Settings Schema --- //
const schema = new Schema({
  _id: { type: String, default: uuidv4() },
  orgId: { type: String, required: true, trim: true }, // Admin Organizations Record ID(_id) - config.collAdminOrgs 
  oCode: { type: String, required: true, trim: true }, // Organization Code
  oName: { type: String, required: true, trim: true }, // Organization Name
  entId: { type: String, required: true, trim: true }, // Entities Record ID(_id) - config.collAdminEntis 
  eName: { type: String, required: true, trim: true }, //  Entity/Brand Name
  eCode: { type: String, required: true, trim: true }, // Entity Code

  smsAuthKey: { type: String, required: true }, // Authorization Key
  smsApi: { type: String, required: true }, // Api
  smsShortUrl: { type: String, required: false }, // Short Url

  tempType: { type: String, required: true }, // Template Type: Booking Confirmation, Feed Back, Booking Cancelled
  tempId: { type: String, required: true }, // Template Id
  tempVars: [{
    _id: { type: String, required: false }, // Variables {_id: 'Name', varKey: 'var'}, {_id: 'Count', varKey: 'var1'}, {_id: 'Reservation Date', varKey: 'var2'}, {_id: 'Reservation Time', varKey: 'var3'}
    varKey: { type: String, required: false }
  }],

  delFlag: { type: Boolean, default: false }, // Deleted Flag
  cuType: { type: String, required: true }, // Created User Type: Customer, Admin
  cUser: { type: String, required: true }, // Created Users._id
  cuName: { type: String, required: true }, // Created Users.name
  cDtTm: { type: Date, required: true }, // Date & Time - Format = YYYY-MM-DD HH:mm:ss
  cDtStr: { type: String, required: true }, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
  uuType: { type: String, required: true }, // Updated User Type: Customer, Admin
  uUser: { type: String, required: true }, // Updated Users._id
  uuName: { type: String, required: true }, // Updated Users.name
  uDtTm: { type: Date, required: true }, // Date & Time - Format = YYYY-MM-DD HH:mm:ss
  uDtStr: { type: String, required: true } // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
});

schema.index({ orgId: 1, entId: 1, smsAuthKey: 1, delFlag: -1 });
schema.index({ cDtStr: -1, uDtStr: -1 });

module.exports = mongoose.model(config.collSmsSettings, schema);
// --- End: SMS Settings Schema --- //