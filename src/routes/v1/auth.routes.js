const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');
const appsController = require('../../controllers/apps.controller');
const adminOnly = require('../../middlewares/role-admin-only');
const universalAuth = require('../../middlewares/auth-universal.middleware');
const userAuth = require('../../middlewares/user-auth.middleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', userAuth, authController.me);
router.post('/change-password', userAuth, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);

router.post('/login-app', appsController.loginApp);
router.post('/register-app', universalAuth, adminOnly({ verifyInDb: true }), appsController.registerApp);
router.post('/register-app-key', universalAuth, adminOnly({ verifyInDb: true }), appsController.registerAppApiKey);

module.exports = router;
