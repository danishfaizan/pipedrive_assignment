exports.createOrganisationRelationshipsModel = (sequelize, OrganisationsModel) => {
  const OrganisationRelationshipsModel = sequelize.define(
    'organisation_relationships',
    {}, { timestamps: false },
  );
  OrganisationRelationshipsModel.belongsTo(OrganisationsModel, {
    as: 'organisation',
    foreign_key: 'id',
  });
  OrganisationRelationshipsModel.belongsTo(OrganisationsModel, {
    as: 'parent',
    foreign_key: 'id',
  });

  exports.OrganisationRelationshipsModel = OrganisationRelationshipsModel;
};
