const {User} = require("../../models/user");

const verifyEmail = async(req, res) => {
    const {verifycationToken} = req.params;
    const user = await User.findOne({verifycationToken});
    if(!user) {
    const error = new Error("User not found"); 
    error.status = 404;
    throw error;
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verifycationToken: null});
    res.json({
        message: "Verification successful"
    })
}

module.exports = verifyEmail