const Sequelize = require('sequelize');

exports.createOrganisationsModel = (sequelize) => {
  const OrganisationsModel = sequelize.define('organisations', {
    id: {
      type: Sequelize.UUID,
      null: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      null: false,
      unique: true,

    },
  }, { timestamps: false });
  exports.OrganisationsModel = OrganisationsModel;

  return OrganisationsModel;
};
