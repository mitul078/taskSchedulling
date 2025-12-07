const User = require("../auth/auth.model")

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