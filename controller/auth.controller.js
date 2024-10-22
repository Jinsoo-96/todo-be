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

      // 여기에 로그를 넣어서 payload와 userId 확인
      console.log("Decoded Payload:", payload); // 파싱된 JWT 확인
      req.userId = payload._id; // 토큰에서 사용자 ID 추출 후 저장
      console.log("User ID from Token:", req.userId); // 최종적으로 userId 확인

      next(); // 다음 미들웨어로 이동
    });

    // 이 부분은 jwt.verify 내부에서 처리되는 비동기 결과를 기다리지 않으므로 제거
    // console.log("JWT_SECRET_KEY:", JWT_SECRET_KEY);
    // console.log("Authorization Header:", tokenString);
  } catch (error) {
    console.log("Authentication Error:", error); // 에러가 발생했을 때 디버깅용
    res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports = authController;
