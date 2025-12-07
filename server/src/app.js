const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")

app.use(express.json())
app.use(cookieParser())


app.use("/api/v1/auth" , require("./modules/auth/auth.route"))

module.exports = app