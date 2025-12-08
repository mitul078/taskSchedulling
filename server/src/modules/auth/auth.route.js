const express = require("express")
const { register, login } = require("./auth.controller")
const { signupValidator, signinValidator } = require("../../middleware/validator.middleware")
const router = express.Router()

router.post("/signup", signupValidator, register)
router.post("/signin", signinValidator, login)

module.exports = router