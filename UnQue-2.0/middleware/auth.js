import jwt from "jsonwebtoken";
import { HttpError } from "../models/error.js";

const authMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization || req.headers.Authorization;  

  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1]; // Extract the token
    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
      if (err) {
        return next(new HttpError("Unauthorized, Invalid token", 402));
      }
      req.user = info;
      next();
    });
  } else {
    return next(new HttpError("Unauthorized, No token", 402));
  }
};

const profMiddleware = async(req,res,next) => {
    if (req.user.role !== "professor") {
        return next(new HttpError("Access denied, only professors can add availability", 403));
      }
      next();
    };


export { authMiddleware , profMiddleware};