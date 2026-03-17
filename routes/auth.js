const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 新規登録ページ
router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

// 新規登録処理
router.post("/register", async (req, res) => {
  const { username, password, accessCode } = req.body;

  const existUser = await User.findOne({ username });
  if (existUser) {
    return res.render("register", { error: `${username} はすでに使用されています` });
  }

  const existCode = await User.findOne({ accessCode });
  if (existCode) {
    return res.render("register", { error: `${accessCode} はすでに使用されています` });
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    username,
    password: hashed,
    accessCode
  });

  res.redirect("/login");
});

// ログインページ
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// ログイン処理
router.post("/login", async (req, res) => {
  const { accessCode } = req.body;

  const user = await User.findOne({ accessCode });
  if (!user) {
    return res.render("login", { error: "アクセスコードが間違っています" });
  }

  // JWT 発行
  const token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // 本体サイトへリダイレクト
  const redirectUrl = `${process.env.REDIRECT_URL}?token=${token}`;
  res.redirect(redirectUrl);
});

module.exports = router;
