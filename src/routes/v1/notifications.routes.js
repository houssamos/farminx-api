const express = require('express');
const router = express.Router();
const notificationsController = require('../../controllers/notifications.controller');
const userAuth = require('../../middlewares/user-auth.middleware');


router.post('/subscribe', userAuth, notificationsController.subscribe);
router.get('/', userAuth, notificationsController.get);

module.exports = router;
