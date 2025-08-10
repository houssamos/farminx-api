const express = require('express');
const router = express.Router();
const notificationsController = require('../../controllers/notifications.controller');

router.post('/subscribe', notificationsController.subscribe);
router.get('/', notificationsController.get);

module.exports = router;
