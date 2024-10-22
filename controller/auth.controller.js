const authController = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

authController.authenticate = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization; // Bearer tokenString
    if (!tokenString) {
      throw new Error("Invalid token - no token provided");
    }

    const token = tokenString.replace("Bearer ", "");

    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          throw new Error("Token expired");
        } else {
          throw new Error("Invalid token");
        }
      }

      req.userId = payload._id; // 토큰에서 사용자 ID 추출 후 저장 => req에 담아서 next로 보내기
      next(); // 다음 미들웨어로 이동
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports = authController;
