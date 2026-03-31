const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
require("dotenv").config();

// EJS設定
app.set("view engine", "ejs");

// Render環境ではプロジェクトが1階層深くなるため、viewsのパスを修正
app.set("views", __dirname + "/views");


app.use(express.urlencoded({ extended: true }));

// MongoDB接続
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ルート
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/", authRoutes);

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
