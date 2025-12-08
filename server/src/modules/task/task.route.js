const express = require("express")
const { authMiddleware } = require("../../middleware/auth.middleware")
const { checkRole } = require("../../middleware/role.middleware")
const { createTask, deleteTask, getTask, updateTaskStatus } = require("./task.controller")
const router = express.Router()


//task CRUD
router.post("/:id" , authMiddleware , checkRole("manager") , createTask) //assign employee id
router.delete("/:id" , authMiddleware , checkRole("admin" , "manager") , deleteTask) // task id
router.get("/" , authMiddleware , checkRole("employee") , getTask)
router.patch("/:id" , authMiddleware , checkRole("employee") , updateTaskStatus) // task id

module.exports = router