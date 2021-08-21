require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("./db/conn");
const Register = require("./models/registers");
const { json } = require("express");

const port = process.env.port || 3000;

const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partials");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var bodyParser = require("body-parser");

app.use(express.static(staticpath));
app.set("view engine", "hbs");
app.set("views", templatepath);
hbs.registerPartials(partialpath);
console.log(process.env.SECRET);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

// to register
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confermpassword;
    if (password === cpassword) {
      const registertheemployee = new Register({
        Username: req.body.Username,
        email: req.body.email,
        password: req.body.password,
        confermpassword: req.body.confermpassword,
      });

      const token = await registertheemployee.generateAuthToken();
      const registered = await registertheemployee.save();
      res.status(201).render("index");
    } else {
      res.send("password are not matching");
    }
  } catch (e) {
    res.status(404).send(e);
    console.log(e);
  }
});
// to check login
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // console.log(`${email} and ${password}`);

    const useremail = await Register.findOne({ email: email });
    const ismatch = await bcrypt.compare(password, useremail.password);
    //this part is used to generate token in login
    const token = await useremail.generateAuthToken();
    //
    if (ismatch) {
      res.status(201).render("index");
    } else {
      res.send("password is wrong");
    }
  } catch (e) {
    res.status(400).send("invalid email");
  }
});

app.listen(port, () => {
  console.log("saif ur rehman");
});
