const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares/validation.mid');

router.get('/login/:codCredenciado', middlewares.login);

router.get('/checkCodes', middlewares.checkCodes);

module.exports = router;