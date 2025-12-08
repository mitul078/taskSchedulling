const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const rateLimit = require("express-rate-limit")


app.use(express.json())
app.use(cookieParser())

const apiLimiter = rateLimit({
    windowMs: 10 * 1000,
    max:5,
    message: "Too many requests"
})

app.use(apiLimiter)

app.use("/api/v1/auth" , require("./modules/auth/auth.route"))
app.use("/api/v1/admin" , require("./modules/admin/admin.route"))
app.use("/api/v1/task" , require("./modules/task/task.route"))

module.exports = app