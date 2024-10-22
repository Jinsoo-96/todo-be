const authController = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

authController.authenticate = (req, res, next) => {
  try {
    const tokenString = req.headers.authorizaion; // Bearer jsdaljsdsdrawer
    if (!tokenString) {
      throw new Error("invalide token");
    }
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
      if (error) {
        throw new Error("invalid token");
      }
      //res.status(200).json({ status: "success", userId: payload, _id });
      req.userId = payload._id; //req에 담아서 next로 보내기
      next();
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports = authController;

// 미들웨어
