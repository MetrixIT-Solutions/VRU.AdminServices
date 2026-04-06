/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../SetRes');
var { v4: uuidv4 } = require('uuid');

const logger = require('../lib/logger');
const util = require('../lib/util');
const MergeApiCalls = require('../MergeApiCalls');
const CustsPrivateDining = require('../schemas/CustsPrivateDining');
const CustsPrivateDiningLcs = require('../schemas/CustsPrivateDiningLcs')
const DashbrdAnltcsSrvc = require('../services/DashbrdAnltcsSrvc');

const getPrvDngsData = async (req, res) => {
    try {
      const finalResult = [];
      const body = {collectionName: "CustsPrivateDining" };
      const resObj = await MergeApiCalls.getData(body);
      if (resObj?.status == '200') {
        const data = resObj.resData.result;
          const updatedData = await updateData(data);
          if (updatedData.length) {
            finalResult.push(updatedData);
          }
        util.sendApiResponse(res, finalResult.length ? SetRes.successRes(finalResult) : SetRes.updateFailed({}));
      } else {
        util.sendApiResponse(res, SetRes.updateFailed({}));
      }
    } catch (error) {
      logger.error('Error in getCustsData:', error);
      util.sendApiResponse(res, SetRes.unKnownErr([]));
    }
  }

module.exports = {
  getPrvDngsData
};

const updateData = async (pdData = []) => {
  const resData = [];
  for (const doc of pdData) {
    try {
      const newDocObj = updatePrivateDiningData(doc);
      const docModel = new CustsPrivateDining(newDocObj);
      const saved = await docModel.save();
      if (saved) {
        const docModel1 = new CustsPrivateDiningLcs({...newDocObj, _id: uuidv4(), pdId: newDocObj._id});
        await docModel1.save();
        resData.push(saved);
        const tData = {
          ut: newDocObj.uuType,
          iss: newDocObj.uUser,
          un: newDocObj.uuName
        };
       DashbrdAnltcsSrvc.upsertAnltcsFrmPrvtDng(newDocObj, tData, 'create').catch(err => logger.error('Analytics failed', err));
      }
    } catch (err) {
      logger.error( `PrivateDining merge failed for bookingId: ${doc.bookingId}`, err );
    }
  }

  return resData;
};

const updatePrivateDiningData = (oldDoc = {}) => {
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

  const branchInfo = (oldDoc?.bCode && branchMap[oldDoc.bCode]) || branchMap.BBQHKNDPR; 

  const vegCount = oldDoc.vegCount || 0;
  const nonVegCount = oldDoc.nonVegCount || 0;
  const kidsCount = oldDoc.kidsCount || 0;

  const vegAmt = oldDoc.vegAmt || 0;
  const nonVegAmt = oldDoc.nonVegAmt || 0;
  const kidAmt = oldDoc.kidAmt || 0;

  const tDinersCount = vegCount + nonVegCount + kidsCount;
  const tDineAmt = vegCount * vegAmt + nonVegCount * nonVegAmt + kidsCount * kidAmt;

  return {
    ...oldDoc,
    ...baseData,
    ...branchInfo,
    vegCount,
    nonVegCount,
    kidsCount,
    tDinersCount,
    vegAmt,
    nonVegAmt,
    kidAmt,
    tDineAmt
  };
};
