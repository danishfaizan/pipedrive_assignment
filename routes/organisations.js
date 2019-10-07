const express = require('express');
const { query } = require('express-validator');

const organisationsController = require('../controllers/organisationsController');

const router = express.Router();

router.get('/reset', organisationsController.reset);

router.get(
  '/',
  query('organisation_name')
    .isString()
    .withMessage('organisation_name is missing'),
  organisationsController.getOrganisations,
);

router.post('/', organisationsController.postOrganisations);

module.exports = router;
