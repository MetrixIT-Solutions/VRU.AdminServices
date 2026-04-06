
/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const mongoose = require('mongoose');
const config = require('config');
const logger = require('../lib/logger');
const fs = require('fs');
const path = require('path');

const schemasPath = path.join(__dirname, '../schemas');
fs.readdirSync(schemasPath).forEach(file => {
  if (file.substr(-3) === '.js') {
    require(path.join(schemasPath, file));
  }
});

const updateNamesInAllColls = async (id, reqBody, type) => {
  const collNames = Object.keys(config).filter(key => key.startsWith('coll'));
  for (const key of collNames) {
    const collName = config.get(key);
    try {
      const model = mongoose.model(collName);
      const schema = model.schema;
      if (type == 'org') {
        if (schema.path('orgId') || (collName == 'vru_admin_orgs_onbrds' && schema.path('_id'))) {
          const qry = collName == 'vru_admin_orgs_onbrds' ? { _id: id } : { orgId: id }
          await model.updateMany({ ...qry }, { $set: { oName: reqBody.oName, oCode: reqBody.oCode } });
        }
      } else if (type == 'ent') {
        if (schema.path('entId')) {
          await model.updateMany({ entId: id }, { $set: { eName: reqBody.eName, eCode: reqBody.eCode } });
        }
      } else {
        if (schema.path('branch')) {
          await model.updateMany({ branch: id }, { $set: { bName: reqBody.bName, bCode: reqBody.bCode } });
        }
      }
    } catch (error) {
      if (error.name === 'MissingSchemaError') {
        logger.error(`Schema not found for coll: ${collName}. Skipping.`);
      } else {
        logger.error(`Error updating coll ${collName}: ${error.message}`);
      }
    }
  }
}


module.exports = { updateNamesInAllColls };
