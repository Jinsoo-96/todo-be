const User = require("../models/User");
const bcrypt = require("bcryptjs"); // bcrypt 대신 bcryptjs 사용 heroku에서 오류나서

const saltRounds = 10; // 10 정도로 설정

const userController = {};

// 회원 가입 기능
// userController.createUser = async (req, res) => {
//   try {
//     const { email, name, password } = req.body;
//     const user = await User.findOne({ email }); // {email: email} 인데, 자바스크립트 심플문법?이 있다고 함.
//     if (user) {
//       throw new Error("이미 가입이 된 유저 입니다.");
//     }
//     const salt = bcrypt.genSaltSync(saltRounds);
//     const hash = bcrypt.hashSync(password, salt);
//     const newUser = new User({ email, name, password: hash });
//     await newUser.save();
//     res.status(200).json({ status: "success" });
//   } catch (error) {
//     res.status(400).json({ status: "fail", error });
//   }
// };

userController.createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // 필수 값 체크
    if (!email || !name || !password) {
      throw new Error("모든 필드를 입력해주세요.");
    }

    const user = await User.findOne({ email }); // {email: email} 을 간단히 { email } 로 작성 가능
    if (user) {
      throw new Error("이미 가입이 된 유저입니다.");
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({ email, name, password: hash });
    await newUser.save();

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// 로그인기능
// userController.loginWithEmail = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }, "-createdAt -updatedAt -__v");
//     if (user) {
//       const isMatch = bcrypt.compareSync(password, user.password);
//       if (isMatch) {
//         const token = user.generateToken();
//         return res.status(200).json({ status: "success", user, token });
//       }
//     } else {
//       throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
//     }
//   } catch (error) {
//     res.status(400).json({ status: "fail", error });
//   }
// };
userController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }, "-createdAt -updatedAt -__v");

    if (!user) {
      return res
        .status(400)
        .json({ status: "fail", message: "아이디가 존재하지 않습니다." });
    }

    const isMatch = await bcrypt.compare(password, user.password); // 비동기 처리로 변경

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "fail", message: "비밀번호가 일치하지 않습니다." });
    }

    const token = user.generateToken(); // JWT 또는 커스텀 토큰 생성
    return res.status(200).json({ status: "success", user, token });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "서버 오류가 발생했습니다.",
    });
  }
};

userController.getUser = async (req, res) => {
  try {
    const { userID } = req;
    const user = User.findById(userID);
    if (!user) {
      throw new Error("can not find user");
    }
    res.status(200).json({ status: "succes", user });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

// 회원 탈퇴 기능
userController.deleteUser = async (req, res) => {
  try {
    const { email } = req.body; // 이메일을 통해 유저를 찾음

    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "회원 탈퇴가 완료되었습니다." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "서버 에러" });
  }
};

module.exports = userController;
