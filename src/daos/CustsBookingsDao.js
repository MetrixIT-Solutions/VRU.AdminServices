/**
 * Copyright (C) Skill Works IT - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skill Works IT <contact@skillworksit.com>, Jan 2023
 */

const CustsTableBookings = require('../schemas/CustsTableBookings');
const CustsTableBookingsAbsents = require('../schemas/CustsTableBookingsAbsents');
const CustsTableBookingsCanceled = require('../schemas/CustsTableBookingsCanceled');
const CustsTableBookingsClsd = require('../schemas/CustsTableBookingsClsd');
const CustsTableBookingsConfirmed = require('../schemas/CustsTableBookingsConfirmed');
const CustsTableBookingsLcs = require('../schemas/CustsTableBookingsLcs');
const CustsUsersInfos = require('../schemas/CustsUsersInfos');

const SetRes = require('../SetRes');
const logger = require('../lib/logger');

const getUsrCnfrmTable = (query, sortQuery, reqBody, callback) => {
  let resultObj = { bookingsListCount: 0, bookingsList: [] };
  CustsTableBookingsConfirmed.find(query).skip((reqBody.actPgNum - 1) * reqBody.pageLimit).limit(reqBody.pageLimit).sort(sortQuery).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { bookingsListCount: resObj.length, bookingsList: resObj };
      CustsTableBookingsConfirmed.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { bookingsListCount: resultCount, bookingsList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at getUsrCnfrmTable:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      })
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at getUsrCnfrmTable:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const getUsrCmpltdTable = (query, reqBody, callback) => {
  let resultObj = { bookingsListCount: 0, bookingsList: [] };
  CustsTableBookingsClsd.find(query).skip((reqBody.actPgNum - 1) * reqBody.pageLimit).limit(reqBody.pageLimit).sort({bDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { bookingsListCount: resObj.length, bookingsList: resObj };
      CustsTableBookingsClsd.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { bookingsListCount: resultCount, bookingsList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at getUsrCmpltdTable:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      })
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at getUsrCmpltdTable:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const getUsrCncledTable = (query, reqBody, callback) => {
  let resultObj = { bookingsListCount: 0, bookingsList: [] };
  CustsTableBookingsCanceled.find(query).skip((reqBody.actPgNum - 1) * reqBody.pageLimit).limit(reqBody.pageLimit).sort({uDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { bookingsListCount: resObj.length, bookingsList: resObj };
      CustsTableBookingsCanceled.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { bookingsListCount: resultCount, bookingsList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at getUsrCncledTable:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      })
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at getUsrCncledTable:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const getUsrNoShowTable = (query, reqBody, callback) => {
  let resultObj = { bookingsListCount: 0, bookingsList: [] };
  CustsTableBookingsAbsents.find(query).skip((reqBody.actPgNum - 1) * reqBody.pageLimit).limit(reqBody.pageLimit).sort({uDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      resultObj = { bookingsListCount: resObj.length, bookingsList: resObj };
      CustsTableBookingsAbsents.countDocuments(query).then((resultCount) => {
        if (resultCount) {
          resultObj = { bookingsListCount: resultCount, bookingsList: resObj };
          const result = SetRes.successRes(resultObj);
          callback(result);
        } else {
          const result = SetRes.noData(resultObj);
          callback(result);
        }
      }).catch((error) => {
        logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at getUsrNoShowTable:' + error);
        const err = SetRes.unKnownErr(resultObj);
        callback(err);
      });
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at getUsrNoShowTable:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const updateTableBookings = (query, updateObj, callback) => {
  CustsTableBookings.findOneAndUpdate(query, {$set: updateObj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at updateTableBookings:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const removeCnfrmTbBkng = (query, callback) => {
  CustsTableBookingsConfirmed.findOneAndDelete(query).then((resObj) => {
    if (resObj) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at removeCnfrmTbBkng:' + error);
    const err = SetRes.unKnownErr();
    callback(err);
  })
}

const removeClsdTbBkng = (query, callback) => {
  CustsTableBookingsClsd.findOneAndDelete(query).then((resObj) => {
    if (resObj) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at removeClsdTbBkng:' + error);
    const err = SetRes.unKnownErr();
    callback(err);
  })
}

const removeCancelTbBkng = (query, callback) => {
  CustsTableBookingsCanceled.findOneAndDelete(query).then((resObj) => {
    if (resObj) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at removeCancelTbBkng:' + error);
    const err = SetRes.unKnownErr();
    callback(err);
  })
}

const removeNoshowTbBkng = (query, callback) => {
  CustsTableBookingsAbsents.findOneAndDelete(query).then((resObj) => {
    if (resObj) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at removeNoshowTbBkng:' + error);
    const err = SetRes.unKnownErr();
    callback(err);
  });
}

const createData = (data, callback) => {
  data.save().then((resObj) => {
    if (resObj) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.createFailed({});
      callback(uf);
    }
  }).catch((error) => {
    if (error.code == '11000') {
      const err = SetRes.uniqueness('Uniqueness');
      callback(err);
    } else {
      logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at createData:' + error);
      const err = SetRes.unKnownErr();
      callback(err);
    }
  });
}

const custAggregateCnfrmdTBCount = (query, callback) => {
  CustsTableBookingsConfirmed.aggregate(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustsBookingsDao.js, at custAggregateCnfrmdTBCount:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const custAggregateTotalTBCount = (query, callback) => {
  CustsTableBookings.aggregate(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in service/CustsBookingsDao.js, at custAggregateTotalTBCount:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const updateUserInfoBkngsCount = (query, updateObj, callback) => {
  CustsUsersInfos.findOneAndUpdate(query, { $inc: updateObj }, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const resMsg = SetRes.successRes(resObj);
      callback(resMsg);
    } else {
      const noData = SetRes.updateFailed({});
      callback(noData);
    }
  }).catch((err) => {
    logger.error('Unknown Error in daos/CustsBookingsDao.js, at updateUserInfoBkngsCount:' + err);
    const errMsg = SetRes.unKnownErr({});
    callback(errMsg);
  })
 }

const postCustTableBookingConfirmedView = (query, callback) => {
  CustsTableBookingsConfirmed.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const resMsg = SetRes.successRes(resObj);
      callback(resMsg);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((err) => {
    logger.error('Unknown Error in daos/CustsBookingsDao.js, at postCustTableBookingConfirmedView:' + err);
    const errMsg = SetRes.unKnownErr({});
    callback(errMsg);
  })
 }

const postCustTableBookingCancelledView = (query, callback) => {
  CustsTableBookingsCanceled.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const resMsg = SetRes.successRes(resObj);
      callback(resMsg);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((err) => {
    logger.error('Unknown Error in daos/CustsBookingsDao.js, at postCustTableBookingCancelledView:' + err);
    const errMsg = SetRes.unKnownErr({});
    callback(errMsg);
  })
 }

const postCustTableBookingAbsentsView = (query, callback) => {
  CustsTableBookingsAbsents.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const resMsg = SetRes.successRes(resObj);
      callback(resMsg);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((err) => {
    logger.error('Unknown Error in daos/CustsBookingsDao.js, at postCustTableBookingAbsentsView:' + err);
    const errMsg = SetRes.unKnownErr({});
    callback(errMsg);
  })
 }

const postCustTableBookingClosedView = (query, callback) => {
  CustsTableBookingsClsd.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const resMsg = SetRes.successRes(resObj);
      callback(resMsg);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((err) => {
    logger.error('Unknown Error in daos/CustsBookingsDao.js, at postCustTableBookingClosedView:' + err);
    const errMsg = SetRes.unKnownErr({});
    callback(errMsg);
  })
 }
 const updateTableBookingsAbsents = (query, updateObj, callback) => {
  CustsTableBookingsAbsents.findOneAndUpdate(query, {$set: updateObj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at updateTableBookingsAbsents:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}
const updateTableBookingsClsd = (query, updateObj, callback) => {
  CustsTableBookingsClsd.findOneAndUpdate(query, {$set: updateObj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at updateTableBookingsClsd:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}
const updateTableBookingsCncld = (query, updateObj, callback) => {
  CustsTableBookingsCanceled.findOneAndUpdate(query, {$set: updateObj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at updateTableBookingsCncld:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}
const updateTableBookingsCnfrmd = (query, updateObj, callback) => {
  CustsTableBookingsConfirmed.findOneAndUpdate(query, {$set: updateObj}, {new: true}).then((resObj) => {
    if (resObj && resObj._id) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at updateTableBookingsCnfrmd:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}


const custBookingConfirmedAggregate  = (query, callback) => {
  CustsTableBookingsConfirmed.aggregate(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at custBookingConfirmedAggregate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const custBookingCompletedAggregate  = (query, callback) => {
  CustsTableBookingsClsd.aggregate(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at custBookingCompletedAggregate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const custBookingCancelledAggregate  = (query, callback) => {
  CustsTableBookingsCanceled.aggregate(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at custBookingCancelledAggregate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const custBookingNoshowAggregate = (query, callback) => {
  CustsTableBookingsAbsents.aggregate(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at custBookingNoshowAggregate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const custClosedBktables = (query, callback) => {
  CustsTableBookingsConfirmed.find(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at custClosedBktables:' + error);
    const err = SetRes.unKnownErr();
    callback(err);
  })
}

const confirmedtablesList = (query, callback) => {
  CustsTableBookingsConfirmed.find(query).then((resObj) => {
    if (resObj) {
      const resMsg = SetRes.successRes(resObj);
      callback(resMsg);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((err) => {
    logger.error('Unknown Error in daos/CustsBookingsDao.js.js at confirmedtablesList: ' + err);
    const errMsg = SetRes.unKnownErr({});
    callback(errMsg);
  });
}

const removeBookingConfirmId = (query, callback) => {
  CustsTableBookingsConfirmed.deleteMany(query).then((resObj) => {
    if (resObj) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at removeBookingConfirmId:' + error);
    const err = SetRes.unKnownErr();
    callback(err);
  });
}

const upDateBookingtable = (query, updateObj, callback) => {
  CustsTableBookings.updateMany(query, {$set: updateObj}, {new: true}).then((resObj) => {
    if (resObj) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at upDateBookingtable:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}
const tableBookingData = (query, callback) => {
  CustsTableBookings.findOne(query).then((resObj) => {
    if (resObj) {
      const sr = SetRes.successRes(resObj);
      callback(sr);
    } else {
      const uf = SetRes.noData({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at tableBookingData:' + error);
    const err = SetRes.unKnownErr();
    callback(err);
  })
}

const getCustTableBookingLfcsList = (query, callback) => {
  CustsTableBookingsLcs.find(query).sort({cDtTm: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at getCustTableBookingLfcsList:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}

const custTableBookingsTotalList = (query, project, callback) => {
  CustsTableBookings.find(query, project).sort({ cDtStr: -1 }).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-konwn Error in daos/CustsBookingsDao.js, at custTableBookingsTotalList:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}

module.exports = {
  getUsrCnfrmTable, getUsrCmpltdTable, getUsrCncledTable, getUsrNoShowTable, updateTableBookings,
   removeCnfrmTbBkng, removeClsdTbBkng, removeCancelTbBkng, removeNoshowTbBkng, 
   createData, custAggregateCnfrmdTBCount, custAggregateTotalTBCount, updateUserInfoBkngsCount, 
   postCustTableBookingConfirmedView, postCustTableBookingCancelledView, postCustTableBookingAbsentsView, postCustTableBookingClosedView,
   updateTableBookingsAbsents, updateTableBookingsClsd, updateTableBookingsCncld, updateTableBookingsCnfrmd,
   custBookingConfirmedAggregate, custBookingCompletedAggregate, custBookingCancelledAggregate, custBookingNoshowAggregate,
   custClosedBktables, confirmedtablesList, removeBookingConfirmId, upDateBookingtable, tableBookingData,
   getCustTableBookingLfcsList, custTableBookingsTotalList
};
