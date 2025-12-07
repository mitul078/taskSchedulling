const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema({

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    assigned: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true },

    description: { type: String, required: true },

    status: { type: String, enum: ["completed", "in-progress"], default: "in-progress" },

    dueDate: { type: Date }

}, { timestamps: true })

module.exports = mongoose.model("Task", taskSchema)