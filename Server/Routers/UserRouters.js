import experss from "express";
import asyncHandler from "express-async-handler";
import protect from "../Middleware/AuthMiddleware.js";
import User from "../Models/UserModel.js";
import generateToken from "../utilis/generateToken.js";

const userRouter = experss.Router();
//LOGIN
userRouter.post(
  "/login",
  asyncHandler(async function (req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        createAt: user.createdAt,
      });
    } else {
      res.status(401);
      throw new Error("Tài Khoản hoặc Mật Khẩu không chính xác");
    }
  })
);

//REGISTER
userRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    console.log(userExists);

    if (userExists) {
      res.status(400);
      throw new Error("Tài Khoản đã tồn tại!");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Tài Khoản hoặc Mật Khẩu không chính xác");
    }
  })
);
//PROFILE
userRouter.get(
  "/profile",
  protect,
  asyncHandler(async function (req, res) {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      throw new Error("Chịu");
    }
  })
);

//UPDATE
userRouter.put(
  "/profile",
  protect,
  asyncHandler(async function (req, res) {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }
      const updateUser = await user.save();

      res.json({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        isAdmin: updateUser.isAdmin,
        createdAt: updateUser.createdAt,
        token: generateToken(updateUser._id),
      });
    } else {
      res.status(404);
      throw new Error("Không Thành Công");
    }
  })
);
export default userRouter;
