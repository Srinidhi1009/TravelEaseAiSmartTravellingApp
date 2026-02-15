const express = require('express');
const router = express.Router();
const cabController = require('../controllers/cabController');

router.get('/', cabController.getCabs);
router.post('/book', cabController.bookCab);

module.exports = router;
