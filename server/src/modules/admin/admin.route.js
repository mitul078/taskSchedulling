const express = require("express")
const { authMiddleware } = require("../../middleware/auth.middleware")
const { checkRole } = require("../../middleware/role.middleware")
const { updateRole } = require("./admin.controller")
const router = express.Router()

router.patch("/update-role/:id" , authMiddleware , checkRole("admin") , updateRole)


module.exports = router