const User = require("../auth/auth.model")
const Task = require("../task/task.model")

//update role
exports.updateRole = async (req, res) => {
    try {

        const { role } = req.body
        const { id } = req.params

        if (!role || !id) {
            return res.status(400).json({ msg: "Role and userId are required." });
        }

        if (role !== "manager" && role !== "employee")
            return res.status(400).json({ msg: "invalid roles" })


        const user = await User.findByIdAndUpdate(id, { role }, { new: true })

        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        res.status(200).json({
            msg: "Role updated.",
            user: {
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//list-users
exports.listUsers = async (req, res) => {
    try {

        const { role } = req.params
        const page = parseInt(req.query.page || 1)
        const limit = parseInt(req.query.limit || 10)

        const skip = (page - 1) * limit

        const allowedRoles = ["manager", "employee"]
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ msg: "invalid role" })
        }
        const users = await User.find({ role }).skip(skip).limit(limit).sort({ createdAt: -1 })

        if (users.length === 0)
            return res.status(200).json({ msg: "no user find with this role", users: [] })

        const total = await User.countDocuments({ role })

        res.status(200).json({
            msg: "fetched users",
            users,
            page,
            limit,
            totalPage: Math.ceil(total / limit),
            totalUsers: total,
        })

    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

//get task
exports.listTasks = async (req, res) => {
    try {

        const { status } = req.params
        const page = parseInt(req.query.page || 1)
        const limit = parseInt(req.query.limit || 10)

        const skip = (page - 1) * limit

        const allowedStatus = ["in-progress", "completed"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ msg: "invalid status" })
        }

        const tasks = await Task.find({ status }).skip(skip).limit(limit).sort({ createdAt: -1 })
        const totalTask = await Task.countDocuments({ status })

        res.status(200).json({
            msg: "Fetched tasks",
            tasks,
            page,
            limit,
            totalPage: Math.ceil(totalTask / limit),
            totalTasks: totalTask

        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


