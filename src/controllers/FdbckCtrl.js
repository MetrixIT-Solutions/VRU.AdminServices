/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../SetRes');
const logger = require('../lib/logger');
const util = require('../lib/util');
const MergeApiCalls = require('../MergeApiCalls');
const CustsFeedbacks = require('../schemas/CustsFeedbacks')
const DashbrdAnltcsSrvc = require('../services/DashbrdAnltcsSrvc');

const getFdbckData = async (req, res) => {
    try {
      const finalResult = [];
      const body = {collectionName: "CustsFeedbacks"}
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
      logger.error('Error in getFeedBacksData:', error);
      util.sendApiResponse(res, SetRes.unKnownErr([]));
    }
  }

module.exports = {
  getFdbckData
};

const updateData = async (pdData = []) => {
  const resData = [];
  for (const doc of pdData) {
    try {
      const newDocObj = updateFdbckData(doc);
      const docModel = new CustsFeedbacks(newDocObj);
      const saved = await docModel.save();
      if (saved) {
        resData.push(saved);
        const tData = {
          ut: newDocObj.uuType,
          iss: newDocObj.uUser,
          un: newDocObj.uuName
        };
        // await DashbrdAnltcsSrvc.upsertAnltcsFrmFdbk(newDocObj, tData, 'create');
      }
    } catch (err) {
      logger.error(
        `Feedback merge failed for id: ${doc._id}`,
        err
      );
    }
  }

  return resData;
};

const updateFdbckData = (oldDoc = {}) => {
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

  return {
    ...oldDoc,
    ...baseData,
    ...branchInfo
  };
};
