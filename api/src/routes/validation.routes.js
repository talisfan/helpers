const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares/validation.mid');

router.get('/login', middlewares.login);

module.exports = router;