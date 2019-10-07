const { validationResult } = require('express-validator');

const OrganisationService = require('../services/organisationsService');

exports.getOrganisations = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(400).send(validationErrors.array());
  }
  OrganisationService.getOrganisationRelations(req.query)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postOrganisations = (req, res, next) => {
  OrganisationService.postOrganisationRelations(req.body)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
