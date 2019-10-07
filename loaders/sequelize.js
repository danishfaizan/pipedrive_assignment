const Sequelize = require('sequelize');

const config = require('../config');
const { createOrganisationsModel } = require('../models/organisations');
const {
  createOrganisationRelationshipsModel,
} = require('../models/organisationRelationships');

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    dialect: 'postgres',
    host: config.DB_SERVER_HOST,
    logging: false,
    // force: true,
  },
);

const OrganisationsModel = createOrganisationsModel(sequelize);
createOrganisationRelationshipsModel(sequelize, OrganisationsModel);

sequelize.sync().catch((err) => {
  console.error(err);
});

exports.sequelize = sequelize;
