import { HttpError } from "../models/error.js";  
import { User } from "../models/user.js";        
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

// User Registration Controller
const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;
    if (!name || !email || !password || !role) {
      return next(new HttpError("Fill in all the fields", 422));
    }

    const newEmail = email.toLowerCase();
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError("Email already exists.", 422));
    }
    if (password.trim().length < 3) {
      return next(new HttpError("Password should be greater than 3 characters", 422));
    }
    if (password !== confirmPassword) {
      return next(new HttpError("Passwords do not match", 422));
    }

    const salt = await bcrypt.genSalt(11);  // 11 rounds are good and protects against attacks
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ name, email: newEmail, password: hashedPassword, role });
    res.status(201).json({ newUser });
  } catch (error) {
    return next(new HttpError("User Registration Failed", 422));
  }
};
const login = async(req,res,next) => {
  try {
    const {email,password} = req.body;
    if(!email || !password) {
      return next(new HttpError("Fill in all fields", 422));

    }
    const newEmail = email.toLowerCase();
    const user = await User.findOne({email: newEmail});
    if(!user) {
      return next(new HttpError("Invalid Credentials", 422));
    }
    const comparePassword = await bcrypt.compare(password,user.password);
    // user.password is the hashed password from database
    if(!comparePassword) {
      return next(new HttpError("Invalid Password", 422));
    }
    const {_id: id, name, role} = user;
    // a token requires a payload to work
     const token = jwt.sign({id, name, role}, process.env.JWT_SECRET, {expiresIn: "2d"});
     res.status(200).json({token,id,name, role})

  } catch(error) {
    return next(new HttpError(error));
  }
}
const getUserProfile = async(req,res,next) => {
  try {
   // extracting the id
    const {id} = req.params;
    const user = await User.findById(id).select('-password'); // don't send the password back
    if(!user) {
     return next(new HttpError("User not found", 422));
    }
res.status(200).json(user);
} catch(error) {
 return next(new HttpError(error));
  }
}

export { register, login , getUserProfile};  
