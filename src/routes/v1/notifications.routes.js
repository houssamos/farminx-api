const express = require('express');
const router = express.Router();
const notificationsController = require('../../controllers/notifications.controller');
const userAuth = require('../../middlewares/user-auth.middleware');
const roleAdminOnly = require('../../middlewares/role-admin-only');


router.post('/subscribe', userAuth, notificationsController.subscribe);
router.get('/', userAuth, notificationsController.get);
router.post('/admin/send', userAuth, roleAdminOnly({ verifyInDb: false }), notificationsController.adminSend);

module.exports = router;
