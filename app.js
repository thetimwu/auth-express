//jshint esversion:6
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const ejs = require("ejs");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = {
  name: String,
  password: String
};

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

app.listen(5000, () => {
  console.log("Server started on port 5000...");
});
