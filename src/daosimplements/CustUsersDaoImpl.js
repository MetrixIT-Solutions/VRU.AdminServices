/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const userListQry = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : (reqBody.orgId ? { orgId: reqBody.orgId } : {});
  const entObj = tData.ut == 'Entity' ? { entId: tData.ent } : (reqBody.entityId ? { entId: reqBody.entityId } : {});
  const branchObj = tData.ut == 'Branch' ? { branch: tData.bid } : (reqBody.branch ? { branch: reqBody.branch } : {});

  const srchStr = reqBody.searchStr ? reqBody.searchStr : '';
  return { delFlag: false, ...orgObj, ...entObj, ...branchObj, $or: [
    { 'name': { $regex: srchStr, $options: 'i' } },
    { 'sName': { $regex: srchStr, $options: 'i' } },
    { 'mobCcNum': { $regex: srchStr, $options: 'i' } },
    { 'emID': { $regex: srchStr, $options: 'i' } },
    { 'refUID': { $regex: srchStr, $options: 'i' } }
  ]};
}

const userViewQry = (reqBody, tData) => {
  const orgObj = tData.ut !== 'VRU' ? { orgId: tData.oid } : { orgId: reqBody?.orgId };
  return { myPrimary: orgObj.orgId + '__' + reqBody.mobNum, delFlag: false, ...orgObj };
}

module.exports = {
  userListQry, userViewQry
};
