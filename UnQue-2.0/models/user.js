import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true ,  enum: ["professor", "student"]},
});1

const User = mongoose.model("User", userSchema);

export { User };  
