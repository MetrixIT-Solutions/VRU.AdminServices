/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

var { v4: uuidv4 } = require('uuid');

const SetRes = require('../SetRes');

const logger = require('../lib/logger');
const util = require('../lib/util');
const MergeApiCalls = require('../MergeApiCalls');
const CustsUsers = require('../schemas/CustsUsers')
const CustsUsersInfos = require('../schemas/CustsUsersInfos');

const getCustsData = async (req, res) => {
  if (req.params.sd && req.params.ed) {
    try {
      const finalResult = [];
      const body = { collectionName: "CustsUsers", sd: req.params.sd + ' 00:00:00', ed: req.params.ed + ' 23:59:59' }
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
  } else {
    util.sendApiResponse(res, SetRes.msdReqFields());
  }
}

module.exports = {
  getCustsData
};

const updateData = async (custData = []) => {
  const resData = [];
  for (const data of custData) {
    try {
      const upObj = updateCustData(data);
      const data1 = new CustsUsers(upObj)
      const updatedDoc = await data1.save();
      if (updatedDoc) {
        const data2 = new CustsUsersInfos({...upObj, user: upObj._id , _id: uuidv4() });
        await data2.save();
        resData.push(updatedDoc);
      }
    } catch (err) {
      logger.error(`Update failed for cust ${data._id}`, err);
    }
  }
  return resData;
};

const updateCustData = (reqData = {}) => {
  const baseData = {
    orgId: 'VRU101ORG100001',
    oName: 'ONSSD Food And Beverages Pvt Ltd',
    oCode: 'ONSSD'
  };
  return {
    ...reqData,
    ...baseData,
    oeIds: ['VRU101ORG100001ENT10001', 'VRU101ORG100001ENT10002', 'VRU101ORG100001ENT10003'],
    oebIds: ['VRU101ORG100001ENT10001BCH1001', 'VRU101ORG100001ENT10002BCH1001', 'VRU101ORG100001ENT10003BCH1001'],
    oebInfo: [
      {
      entId: 'VRU101ORG100001ENT10001',
      eCode: 'BBQH',
      eName: 'Barbeque Holic',
      bCode: 'BBQHKNDPR',
      bName: 'BBQH Kondapur',
      branch: 'VRU101ORG100001ENT10001BCH1001',
     },
     {
      entId: 'VRU101ORG100001ENT10002',
      eCode: 'FSG',
      eName: 'Firestone Grill Buffet',
      bCode: 'FSGKPHB',
      bName: 'FSG Kukatpally',
      branch: 'VRU101ORG100001ENT10002BCH1001',
    },
     {
      entId: 'VRU101ORG100001ENT10003',
      eCode: 'MPB',
      eName: 'Masterpiece Buffet',
      bCode: 'MPBGCB',
      bName: 'MPB Gachibowli',
      branch: 'VRU101ORG100001ENT10003BCH1001',
    }
    ]
  };
};
