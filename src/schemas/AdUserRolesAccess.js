/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

var config = require('config');
var mongoose = require('mongoose');
var {v4: uuidv4} = require('uuid');

mongoose.createConnection(config.mongoDBConnection);
const Schema = mongoose.Schema;

// --- Begin: Admin User Roles Access Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},
  orgId: {type: String, required: true}, // Admin Organizations Record ID(_id) - config.collAdminOrgs 
  oCode: {type: String, required: true}, // Organization Code
  oName: {type: String, required: true}, // Organization Name
  entId: {type: String, required: false}, // Entities Record ID(_id) - config.collAdminEntis 
  eName: {type: String, required: false}, //  Entity/Brand Name
  eCode: {type: String, required: false}, // Entity Code
  branch: {type: String, required: false}, // Admin Branchs Record ID(_id) - config.collAdminBranches
  bCode: {type: String, required: false},

  raSeq: {type: Number, required: true},
  role: {type: String, required: true}, // Role ID(_id)
  rType: {type: String, required: true}, // Role Type: Role Type: Board, Restaurant, Branch; App(Super User)
  rName: {type: String, required: true}, // Role Name
  rCode: {type: String, required: true}, // Role Code

  user: {type: String, required: false},
  uName: {type: String, required: false},
  urefUID: {type: String, required: false},
  uPrimary: {type: String, required: false},

  access: [{
    _id: {type: String, required: true}, // Page Name: 101.pName
    pName: {type: String, required: true}, // Page Name
    isAlwd: {type: Boolean, required: true},
    actions: [{
      _id: {type: String, required: true}, // Action Name: 101.aName
      aName: {type: String, required: true}, // Action Name
      isAlwd: {type: Boolean, required: true},
    }],
  }],

  delFlag: {type: Boolean, default: false}, // Deleted Flag
  cuType: {type: String, required: true}, // Created User Type: Customer, Admin
  cUser: {type: String, required: true}, // Created Users._id
  cuName: {type: String, required: true}, // Created Users.name
  cDtTm: {type: Date, required: true}, // Date & Time - Format = YYYY-MM-DD HH:mm:ss
  cDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
  uuType: {type: String, required: true}, // Updated User Type: Customer, Admin
  uUser: {type: String, required: true}, // Updated Users._id
  uuName: {type: String, required: true}, // Updated Users.name
  uDtTm: {type: Date, required: true}, // Date & Time - Format = YYYY-MM-DD HH:mm:ss
  uDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
});

schema.index({rType: 'text', rName: 'text', uName: 'text', uPrimary: 'text'});
schema.index({orgId: 1, entId: 1, branch: 1, user: 1, rType: 1, rName: 1}, {unique: true});

module.exports = mongoose.model(config.collAdUserRolesAccess, schema);
// --- End: Admin User Roles Access Schema --- //
