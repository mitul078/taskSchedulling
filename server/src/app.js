const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")

app.use(express.json())
app.use(cookieParser())


app.use("/api/v1/auth" , require("./modules/auth/auth.route"))
app.use("/api/v1/admin" , require("./modules/admin/admin.route"))
app.use("/api/v1/task" , require("./modules/task/task.route"))

module.exports = app