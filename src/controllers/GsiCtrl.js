/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

var { v4: uuidv4 } = require('uuid');

const SetRes = require('../SetRes');
const CustsUsersGSI = require('../schemas/CustsUsersGSI');
const CustsUsersGSIAns = require('../schemas/CustsUsersGSIAns');
const CustsUsersGSIClsd = require('../schemas/CustsUsersGSIClsd');

const logger = require('../lib/logger');
const util = require('../lib/util');
const DashbrdAnltcsSrvc = require('../services/DashbrdAnltcsSrvc');
const MergeApiCalls = require('../MergeApiCalls');

const SCHEMA_MAP = {
  CustsUsersGSI: CustsUsersGSI,
  CustsUsersGSIAns: CustsUsersGSIAns,
  CustsUsersGSIClsd: CustsUsersGSIClsd
};

const getGsiData = async (req, res) => {
    try {
      const finalResult = [];
      const resObj = await MergeApiCalls.getGsiData();
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
      logger.error('Error in getGsiData:', error);
      util.sendApiResponse(res, SetRes.unKnownErr([]));
    }
}

module.exports = {
  getGsiData
};

const updateData = async (schemaName, gsiData = []) => {
  const resData = [];
  const Model = SCHEMA_MAP[schemaName];
  if (!Model) {
    logger.error(`Invalid schema received: ${schemaName}`);
    return resData;
  }
  for (const data of gsiData) {
    try {
      const upObj = updateGsiData(data, schemaName);
      const data1 = new Model(upObj)
      const updatedDoc = await data1.save();
      if (updatedDoc) {
        const tData = {
          ut: updatedDoc.uuType,
          iss: updatedDoc.uUser,
          un: updatedDoc.uuName
        };
        // await DashbrdAnltcsSrvc.upsertAnltcsFrmBkg(upObj, tData, 'create');
      }
    } catch (err) {
      logger.error(`Update failed for booking ${data._id}`, err);
    }
  }
  return resData;
};

const updateGsiData = (reqData = {}) => {
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

  return {
    ...reqData,
    ...baseData,
    ...branchData,
  };
};
