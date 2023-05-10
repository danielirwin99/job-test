const express = require("express");
const router = express.Router();

const { login, register } = require("../controllers/auth");

// This endpoint is at the end of the routes i.e --> domain/api/v1/auth/register
router.post("/register", register);
router.post("/login", login);

module.exports = router;
