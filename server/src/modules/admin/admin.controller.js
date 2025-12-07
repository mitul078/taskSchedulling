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

        const allowedRoles = ["manager", "employee"]
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ msg: "invalid role" })
        }

        const users = await User.find({ role })
        if (users.length === 0)
            return res.status(200).json({ msg: "no user find with this role", users: [] })

        res.status(200).json({ msg: "fetched users", users })

    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

//get task
exports.listTasks = async (req, res) => {
    try {

        const {status} = req.params

        const allowedStatus = ["in-progress" , "completed"]
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({msg: "invalid status"})
        }

        const tasks = await Task.find({status})

        res.status(200).json({
            msg: "Fetched tasks",tasks
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


