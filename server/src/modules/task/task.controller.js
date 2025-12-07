const Task = require("./task.model")
const User = require("../auth/auth.model")

exports.createTask = async (req, res) => {
    try {

        const { title, description, dueDate } = req.body

        const userId = req.user.id

        const { id } = req.params //assigned user id

        if (!title || !description || !dueDate || !userId)
            return res.status(400).json({ msg: "Fields are required" })

        if (isNaN(new Date(dueDate).getTime())) {
            return res.status(400).json({ msg: "Invalid due date" });
        }

        const findUser = await User.findById(id)
        if (!findUser)
            return res.status(404).json({ msg: "User not found with this id" })


        const task = await Task.create({
            title, description, dueDate, createdBy: userId, assigned: id
        })

        res.status(201).json({
            msg: "Task created",
            task
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

exports.deleteTask = async (req, res) => {
    try {

        const { id } = req.params

        const findTask = await Task.findById(id)
        if (!findTask)
            return res.status(404).json({ msg: "Task not found" })

        await Task.findByIdAndDelete(id)

        res.status(200).json({
            msg: "Task Deleted"
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

exports.getTask = async (req, res) => {
    try {

        const userId = req.user.id

        const findTask = await Task.find({ assigned: userId, status: "in-progress" })

        if (findTask.length === 0) {
            return res.status(200).json({ msg: "No pending task", task: [] })
        }

        res.status(200).json({
            msg: "Fetched tasks",
            task: findTask
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })

    }
}

exports.updateTaskStatus = async (req, res) => {
    try {
        const userId = req.user.id
        const { id } = req.params //task id
        const { status } = req.body

        const allowedStatus = ["in-progress", "completed"]

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ msg: "invalid status" })
        }

        const task = await Task.findOne({ assigned: userId, _id: id })
        if (!task) {
            return res.status(403).json({ msg: "Not allowed or task not found" });
        }

        const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true })

        res.status(200).json({ msg: "Status updated.", updatedTask })


    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

