const express = require('express');
const router = express.Router();
const notificationsController = require('../../controllers/notifications.controller');
const userAuth = require('../../middlewares/user-auth.middleware');
const roleAdminOnly = require('../../middlewares/role-admin-only');


router.post('/subscribe', userAuth, notificationsController.subscribe);
router.get('/', userAuth, notificationsController.get);
// Optional query params:
//   stats=true to email stats subscribers
//   marketplace=true to email marketplace subscribers
//   at least one must be true to send any emails
router.post('/admin/send', userAuth, roleAdminOnly({ verifyInDb: false }), notificationsController.adminSend);

module.exports = router;
