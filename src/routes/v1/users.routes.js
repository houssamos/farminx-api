const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/users.controller");
const userAuth = require("../../middlewares/user-auth.middleware");
const adminOnly = require("../../middlewares/role-admin-only");

router.get("/", userAuth, adminOnly(), usersController.list);
router.get("/count", userAuth, adminOnly(), usersController.count);
router.delete("/:id", userAuth, adminOnly(), usersController.remove);

module.exports = router;
