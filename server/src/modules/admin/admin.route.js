const express = require("express")
const { authMiddleware } = require("../../middleware/auth.middleware")
const { checkRole } = require("../../middleware/role.middleware")
const { updateRole, listUsers, listTasks } = require("./admin.controller")
const router = express.Router()

router.patch("/role/:id", authMiddleware, checkRole("admin"), updateRole) // userId
router.get("/users/:role" , authMiddleware , checkRole("admin") , listUsers)
router.get("/tasks/:status" , authMiddleware , checkRole("admin") , listTasks)

module.exports = router