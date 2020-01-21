require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const crypto = require("crypto");

const ejs = require("ejs");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// //32 bytes
// let key32 = require("crypto").randomBytes(32, function(err, buffer) {
//   var token = buffer.toString("base64");
// });

// // 64 bytes
// let key64 = require("crypto").randomBytes(64, function(err, buffer) {
//   var token = buffer.toString("base64");
// });

var encKey = process.env.SOME_32BYTE_BASE64_STRING;
var sigKey = process.env.SOME_64BYTE_BASE64_STRING;

userSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ["password"]
});

// const secret = "thisissecret.blublu";
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(err => {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", (req, res) => {
  const userName = req.body.email;
  const password = req.body.password;

  User.findOne({ email: userName }, (err, foundOne) => {
    if (err) {
      console.log(err);
    } else {
      console.log("psw: " + foundOne.password);
      // if (foundOne.password === password) {
      //   res.render("secrets");
      // }
    }
  });
});

app.listen(5000, () => {
  console.log("Server started on port 5000...");
});
