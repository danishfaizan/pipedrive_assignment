const express = require('express');

const organisationRoutes = require('./organisations');

const router = express.Router();

router.use('/organisations', organisationRoutes);

module.exports = router;
