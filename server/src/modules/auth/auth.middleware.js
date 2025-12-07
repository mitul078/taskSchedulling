const jwt = require("jsonwebtoken")

exports.authMiddleware = async (req, res, next) => {
    try {

        const token = req.cookies.token
        if (!token)
            return res.status(404).json({ msg: "Login require" })

        const decoded = jwt.verify(token , process.env.JWT_SECRETE)
        
        req.user = {id: decoded.id}

        next()

    } catch (error) {
        return res.status(401).json({ msg: "invalid token" })
    }
}