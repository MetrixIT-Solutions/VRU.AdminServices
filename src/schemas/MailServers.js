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

// --- Begin: Mail Settings Schema --- //
const schema = new Schema({
  _id: { type: String, default: uuidv4() },
  orgId: { type: String, required: true, trim: true }, // Admin Organizations Record ID(_id) - config.collAdminOrgs 
  oCode: { type: String, required: true, trim: true }, // Organization Code
  oName: { type: String, required: true, trim: true }, // Organization Name
  entId: { type: String, required: true, trim: true }, // Entities Record ID(_id) - config.collAdminEntis 
  eName: { type: String, required: true, trim: true }, //  Entity/Brand Name
  eCode: { type: String, required: true, trim: true }, // Entity Code

  fromMail: { type: String, required: true },
  fromMailPswd: { type: String, required: true },
  mailServerHost: { type: String, required: true },
  mailServerPort: { type: Number, required: true },
  senderAdrs: { type: String, required: true },

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

schema.index({ orgId: 1, entId: 1, delFlag: -1 });
schema.index({ cDtStr: -1, uDtStr: -1 });

module.exports = mongoose.model(config.collMailServers, schema);
// --- End: Mail Settings Schema --- //