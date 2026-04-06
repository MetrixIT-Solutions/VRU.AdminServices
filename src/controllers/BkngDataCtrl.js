/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

var { v4: uuidv4 } = require('uuid');

const SetRes = require('../SetRes');
const CustsTableBookings = require('../schemas/CustsTableBookings');
const CustsTableBookingsAbsents = require('../schemas/CustsTableBookingsAbsents');
const CustsTableBookingsCanceled = require('../schemas/CustsTableBookingsCanceled');
const CustsTableBookingsClsd = require('../schemas/CustsTableBookingsClsd');
const CustsTableBookingsConfirmed = require('../schemas/CustsTableBookingsConfirmed');
const CustsTableBookingsLcs = require('../schemas/CustsTableBookingsLcs');

const logger = require('../lib/logger');
const util = require('../lib/util');
const DashbrdAnltcsSrvc = require('../services/DashbrdAnltcsSrvc');
const MergeApiCalls = require('../MergeApiCalls');

const SCHEMA_MAP = {
  CustsTableBookingsConfirmed: CustsTableBookingsConfirmed,
  CustsTableBookingsClsd: CustsTableBookingsClsd,
  CustsTableBookingsAbsents: CustsTableBookingsAbsents,
  CustsTableBookingsCanceled: CustsTableBookingsCanceled,
  CustsTableBookingsLcs: CustsTableBookingsLcs
};

const getBkgsData = async (req, res) => {
  if (req.params.sd && req.params.ed) {
    try {
      const finalResult = [];
      const body = { sd: req.params.sd + ' 00:00:00', ed: req.params.ed + ' 23:59:59' };
      const resObj = await MergeApiCalls.getBkgsData(body);
      if (resObj?.status == '200') {
        const results = resObj.resData.result;
        for (const { collection, data } of results) {
          const updatedData = await updateData(collection, data);
          if (updatedData.length) {
            finalResult.push({
              collection,
              updatedCount: updatedData.length,
              data: updatedData
            });
          }
        }
        util.sendApiResponse(res, finalResult.length ? SetRes.successRes(finalResult) : SetRes.updateFailed({}));
      } else {
        util.sendApiResponse(res, SetRes.updateFailed({}));
      }
    } catch (error) {
      logger.error('Error in getBkgsData:', error);
      util.sendApiResponse(res, SetRes.unKnownErr([]));
    }
  } else {
    util.sendApiResponse(res, SetRes.msdReqFields());
  }
};


module.exports = {
  getBkgsData
};

const updateData = async (schemaName, bkgData = []) => {
  const resData = [];
  const Model = SCHEMA_MAP[schemaName];
  if (!Model) {
    logger.error(`Invalid schema received: ${schemaName}`);
    return resData;
  }
  for (const data of bkgData) {
    try {
      const upObj = updateBkgData(data, schemaName);
      const data1 = new Model(upObj)
      const updatedDoc = await data1.save();
      if (updatedDoc) {
        resData.push(updatedDoc);
        const doc1 = new CustsTableBookings(upObj);
        await doc1.save();
        const doc = new CustsTableBookingsLcs({ ...upObj, _id: uuidv4(), bId: upObj._id });
        await doc.save();
        const tData = {
          ut: updatedDoc.uuType,
          iss: updatedDoc.uUser,
          un: updatedDoc.uuName
        };
        await DashbrdAnltcsSrvc.upsertAnltcsFrmBkg(upObj, tData, 'create');
      }
    } catch (err) {
      logger.error(`Update failed for booking ${data._id}`, err);
    }
  }
  return resData;
};

const updateBkgData = (reqData = {}, schemaName) => {
  if (schemaName == 'CustsTableBookingsAbsents') reqData.bStatus = 'No Show';
  if (schemaName == 'CustsTableBookingsClsd') reqData.bStatus = 'Completed'
  if (schemaName == 'CustsTableBookingsCanceled') reqData.bStatus = 'Cancelled'
  const baseData = {
    orgId: 'VRU101ORG100001',
    oName: 'ONSSD Food And Beverages Pvt Ltd',
    oCode: 'ONSSD'
  };
  const branchMap = {
    BBQHKNDPR: {
      entId: 'VRU101ORG100001ENT10001',
      eCode: 'BBQH',
      eName: 'Barbeque Holic',
      bCode: 'BBQHKNDPR',
      bName: 'BBQH Kondapur',
      branch: 'VRU101ORG100001ENT10001BCH1001',
    },
    FSGKPHB: {
      entId: 'VRU101ORG100001ENT10002',
      eCode: 'FSG',
      eName: 'Firestone Grill Buffet',
      bCode: 'FSGKPHB',
      bName: 'FSG Kukatpally',
      branch: 'VRU101ORG100001ENT10002BCH1001',
    },
    MPBGCB: {
      entId: 'VRU101ORG100001ENT10003',
      eCode: 'MPB',
      eName: 'Masterpiece Buffet',
      bCode: 'MPBGCB',
      bName: 'MPB Gachibowli',
      branch: 'VRU101ORG100001ENT10003BCH1001',
    }
  };

  const branchData = (reqData?.bCode && branchMap[reqData.bCode]) || branchMap.BBQHKNDPR;
  const serTaxAmt = ((reqData.netAmt || 0) * 0.4 * (reqData.serTax || 0)) / 100;
  const netTotalAmt = (reqData.netAmt || 0) + (reqData.gstAmt || 0) + serTaxAmt;
  const actTotalNetAmt = (reqData.totalAmt || 0) + (reqData.actGstAmt || 0) + (reqData.actSerTax || 0);

  return {
    ...reqData,
    ...baseData,
    ...branchData,
    serTaxAmt,
    netTotalAmt,
    actTotalNetAmt,
    oType: reqData.oType || 'Birthday'
  };
};
