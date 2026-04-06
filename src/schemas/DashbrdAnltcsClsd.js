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

// --- Begin: Dashbrd Anltcs Clsd Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()},
  orgId: {type: String, required: true, trim: true}, // Admin Organizations Record ID(_id) - config.collAdminOrgs 
  oCode: {type: String, required: true, trim: true}, // Organization Code
  oName: {type: String, required: true, trim: true}, // Organization Name
  entId: {type: String, required: true, trim: true}, // Entities Record ID(_id) - config.collAdminEntis 
  eName: {type: String, required: true, trim: true}, //  Entity/Brand Name
  eCode: {type: String, required: true, trim: true}, // Entity Code
  branch: {type: String, required: true}, // Admin Branchs Record ID(_id) - config.collAdminBranches
  bCode: {type: String, required: true},
  bName: {type: String, required: true}, // Full Name
  rDate: {type: Date, required: true}, // Reservation Date: YYYY-MM-DD
  rDtStr: {type: String, required: true}, // Reservation Date String: YYYY-MM-DD HH:mm:ss
  slot: {type: String, required: true}, // Booking Slot Lunch, Dinner

  // Bookings Analytics (Combined Table & Private Dining)
  tBkngs: {type: Number, default: 0}, // Total Bookings
  tPaxB: {type: Number, default: 0}, // Total Pax
  cnfrmdBCount: {type: Number, default: 0}, // Confirmed Bookings Count
  cnfrmdPCount: {type: Number, default: 0}, // Confirmed Pax Count
  wtngBCount: {type: Number, default: 0},   // Waiting Count
  wtngPCount: {type: Number, default: 0},   // Waiting Pax Count
  stdBCount: {type: Number, default: 0},   // Seated Count
  stdPCount: {type: Number, default: 0},   // Seated Pax Count
  clsdBCount: {type: Number, default: 0}, // Closed Count
  clsdPCount: {type: Number, default: 0}, // Closed Pax Count
  cncldBCount: {type: Number, default: 0},   // Cancelled Count
  cncldPCount: {type: Number, default: 0},   // Cancelled Pax Count
  nsBCount: {type: Number, default: 0},  // No Show Count
  nsPCount: {type: Number, default: 0},  // No Show Pax Count
  vpBCount: {type: Number, default: 0}, // Veg Pax Count
  nvpBCount: {type: Number, default: 0}, // Non Veg Pax Count
  kidsBCount: {type: Number, default: 0}, // Kids Pax Count
  infantsBCount: {type: Number, default: 0}, // Infants Pax Count

  // Private Dining Specific Analytics
  pdtBkngs: {type: Number, default: 0}, // Private Dining Total Bookings
  tPaxPd: {type: Number, default: 0},  // Total Pax Count
  cnfrmdPdCount:{type: Number, default: 0}, // Confirmed Private Dining Count
  cnfrmdPdPCount: {type: Number, default: 0}, // Confirmed Private Dining Pax Count
  clsdPdCount: {type: Number, default: 0}, // Closed Private Dining Count
  clsdPdPCount: {type: Number, default: 0}, // Closed Private Dining Pax Count
  cncldPdCount: {type: Number, default: 0}, // Cancelled Private Dining Count
  cncldPdPCount: {type: Number, default: 0}, // Cancelled Private Dining Pax Count
  vpPdCount: {type: Number, default: 0}, // Veg Pax Count
  nvpPdCount: {type: Number, default: 0}, // Non Veg Pax Count
  kidsPdCount: {type: Number, default: 0}, // Kids Pax Count
  infantsPdCount: {type: Number, default: 0}, // Infants Pax Count

  // Feedback Analytics
  tfbCount: {type: Number, default: 0}, // Total Feedbacks Countss
  ratings: [{
    _id: { type: String, required: true }, // Food, Service, Ambience, Overall
    s1: { type: Number, default: 0 }, // 1 Star
    s2: { type: Number, default: 0 }, // 2 Star
    s3: { type: Number, default: 0 },
    s4: { type: Number, default: 0 },
    s5: { type: Number, default: 0 }
  }],
  avgFdRtg: {type: Number, default: 0},
  avgSrvcRtg: {type: Number, default: 0},
  avgAmbncRtg: {type: Number, default: 0},
  avgOvrlRtg: {type: Number, default: 0},

  //Franchise Analytics
  frTCount: {type: Number, default: 0}, // Total Counts
  frqCount: {type: Number, default: 0}, // Requested Count
  firCount: {type: Number, default: 0}, // In Review Count
  fapCount: {type: Number, default: 0}, // Approved Count
  frjCount: {type: Number, default: 0}, // Rejected Count

  // GSI Analytics
  captain: {type: String, required: false}, // Restaurant Captain: AdminUsers._id
  gsiSlot: {type: String, required: false}, // GSI Slot 
  gsiTCount: {type: Number, default: 0}, // Total GSI Count
  avgOExp: {type: Number, default: 0}, // Overall Experience
  avgClean: {type: Number, default: 0}, // Ambiance & Hygiene - Clean & Crisp
  avgCmfrt: {type: Number, default: 0}, // Ambiance & Hygiene - Relaxing & Comfortable
  avgBExp: {type: Number, default: 0}, // Reservation Experience - Booking
  avgBvrgs: {type: Number, default: 0}, // Food & Beverages - Beverages
  avgBuffet: {type: Number, default: 0},// Food & Beverages - Buffet
  avgStrs: {type: Number, default: 0}, // Food & Beverages - Starters
  avgDsrts: {type: Number, default: 0}, // Food & Beverages - Desserts
  avgLCntr: {type: Number, default: 0}, // Live Counter
  avgAtntv: {type: Number, default: 0}, // Service - Attentive
  avgCrts: {type: Number, default: 0}, // Service - Courteous & Concern
  avgBilExp: {type: Number, default: 0},  // Billing Experience

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
}, {collection: config.collDashboardsClsd});

schema.index({rDtStr: 1, delFlag: -1});
schema.index({orgId: 1, entId: 1, branch: 1, rDtStr: 1, slot: 1}, {unique: true});
schema.index({cDtStr: -1, uDtStr: -1});

module.exports = mongoose.model(config.collDashboardsClsd, schema);
// --- End: Dashbrd Anltcs Clsd Schema --- //