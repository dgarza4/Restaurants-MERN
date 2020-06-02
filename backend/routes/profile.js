const express = require('express');
const profileCtrl = require('../controllers/profile');

const router = express.Router();

router.route('/').put(profileCtrl.update).delete(profileCtrl.close);

module.exports = router;
