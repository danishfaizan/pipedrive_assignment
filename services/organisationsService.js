const uuid4 = require('uuid/v4');

const { sequelize } = require('../loaders/sequelize');
const { OrganisationsModel } = require('../models/organisations');
const {
  OrganisationRelationshipsModel,
} = require('../models/organisationRelationships');

const postOrganisationRelations = async (jsonBody) => {
  const flattenedOrganisations = [];
  parseIncomingJSON(jsonBody, null, flattenedOrganisations);

  const organisationToUUIDMap = createOrganisationToUUIDMap(
    flattenedOrganisations,
  );

  try {
    const bulkInsertOrganisationResult = await bulkInsertOrganisations(
      organisationToUUIDMap,
    );

    const bulkInsertOrganisationsRelationsResult = await bulkInsertOrganisationsRelations(
      flattenedOrganisations,
      organisationToUUIDMap,
    );

    return {
      organisations_inserted: bulkInsertOrganisationResult.length,
      organisation_relations_inserted:
        bulkInsertOrganisationsRelationsResult.length,
    };
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      error.message = 'Organisation name already exists in the database';
      error.statusCode = 400;
    }
    throw error;
  }
};

const parseIncomingJSON = (jsonBody, parent, flattenedOrganisations) => {
  if (Array.isArray(jsonBody)) {
    jsonBody.forEach((element) => {
      validateJsonElement(element);

      flattenedOrganisations.push({
        organisation_name: element.org_name,
        parent,
      });
      if ('daughters' in element) {
        parseIncomingJSON(
          element.daughters,
          element.org_name,
          flattenedOrganisations,
        );
      }
    });
  } else {
    validateJsonElement(jsonBody);
    flattenedOrganisations.push({
      organisation_name: jsonBody.org_name,
      parent,
    });
    if ('daughters' in jsonBody) {
      parseIncomingJSON(
        jsonBody.daughters,
        jsonBody.org_name,
        flattenedOrganisations,
      );
    }
  }
};

const validateJsonElement = (element) => {
  if (!('org_name' in element)) {
    const error = new Error('Json element does not contain org_name attribute');
    error.statusCode = 400;
    throw error;
  }
};

const createOrganisationToUUIDMap = (flattenedOrganisations) => {
  const uniqueOrganisations = new Set();
  flattenedOrganisations.forEach(
    (organisation) => uniqueOrganisations.add(organisation.organisation_name),
  );

  const organisationToUUIDMap = new Map();
  uniqueOrganisations.forEach((organisation) => organisationToUUIDMap.set(organisation, uuid4()));
  return organisationToUUIDMap;
};

const bulkInsertOrganisations = (organisationToUUIDMap) => {
  const organisationsForInsert = [];
  organisationToUUIDMap.forEach((uuid, organisation) => organisationsForInsert.push(
    { id: uuid, name: organisation },
  ));
  return OrganisationsModel.bulkCreate(organisationsForInsert);
};

const bulkInsertOrganisationsRelations = (flattenedOrganisations, organisationToUUIDMap) => {
  const bulkOrganisationRelationshipsToInsert = [];

  flattenedOrganisations.forEach((organisation) => {
    const organisationID = organisationToUUIDMap.get(
      organisation.organisation_name,
    );
    const parentID = organisationToUUIDMap.get(organisation.parent);

    bulkOrganisationRelationshipsToInsert.push({
      organisationId: organisationID,
      parentId: parentID,
    });
  });

  return OrganisationRelationshipsModel.bulkCreate(
    bulkOrganisationRelationshipsToInsert,
  );
};

const getOrganisationRelations = async ({
  organisation_name: organisationName,
  page = 1,
  limit = 100,
}) => {
  const organisation = await checkIfOrganisationExists(organisationName);
  if (!organisation) {
    const error = new Error('Organisation name does not exist');
    error.statusCode = 404;
    throw error;
  }

  const offset = (page - 1) * limit;
  const finalResponseBody = await getAllRelations(organisationName, limit, offset);

  return finalResponseBody;
};

const checkIfOrganisationExists = async (organisationName) => OrganisationsModel.findOne(
  { where: { name: organisationName } },
);

const getAllRelations = (organisationName, limit, offset) => {
  const findParentsQuery = `
  WITH
      cte_parents
      AS
      (
          SELECT orgs.id, orgs.name
          FROM organisations AS orgs JOIN organisation_relationships AS org_relationships ON org_relationships."parentId" = orgs.id
          WHERE org_relationships."organisationId" = (SELECT id
          FROM organisations
          WHERE name = :name)
      )
      select 'parent' as relationship_type, orgs.name as org_name from cte_parents as orgs`;

  const findSistersQuery = `SELECT DISTINCT 'sister', orgs.name
      FROM organisations AS orgs JOIN organisation_relationships AS org_relationships ON orgs.id = org_relationships."organisationId"
      where "parentId" IN (select id
      from cte_parents)`;

  const findDaughterQuery = ` SELECT 'daughter', orgs.name
      FROM organisations AS orgs JOIN organisation_relationships AS org_relationships ON orgs.id = org_relationships."organisationId"
      WHERE "parentId" = (SELECT id
      FROM organisations AS sub_orgs
      WHERE sub_orgs.name = :name) ORDER BY org_name LIMIT :limit OFFSET :offset`;

  const finalQuery = `${findParentsQuery} UNION ${findSistersQuery} UNION ${findDaughterQuery}`;

  return sequelize
    .query(finalQuery,
      {
        replacements: { name: organisationName, limit, offset },
        type: sequelize.QueryTypes.SELECT,
      });
};

const resetDatabase = () => {
  OrganisationsModel.truncate({ cascade: true });
  OrganisationRelationshipsModel.truncate();
};

module.exports = {
  postOrganisationRelations,
  getOrganisationRelations,
  resetDatabase,
};
