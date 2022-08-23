const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const {nanoid} = require("nanoid");
const {User, userJoiSchema} = require("../../models/user");
const {sendEmail} = require("../../helpers");


const signup = async(req, res) => {
    const {error} = userJoiSchema.validate(req.body);
    if(error) {
        const error = new Error("Bad Request"); 
        error.status = 400;
        throw error;
    }
   const {email, password} = req.body;
   const user = await User.findOne({email});
   if(user) {
    const error = new Error("Email in use"); 
    error.status = 409;
    throw error;
   }
   const avatarURL = gravatar.url(email);
   const verificationToken = nanoid();
   const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
   const result = await User.create({email, password: hashPassword, avatarURL, verificationToken});
   const mail = {
    to: "email",
    subject: "Verification email sent",
    html: `<a target = "_blank" href = "http://localhost:PORT/api/users/verify/${verificationToken}">Verification email</a>`
   }
   await sendEmail(mail);
    res.status(201).json({
    status: "success",
    code: 201,
    data: { 
      user: {
        email: result.email,
        subscription: result.subscription,
        avatarURL,
        verificationToken
      }
    }  
  })
}

module.exports = signup;