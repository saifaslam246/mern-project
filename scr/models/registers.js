const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const saifSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new error("find error");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200,
  },
  confermpassword: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
//  to generate token

saifSchema.methods.generateAuthToken = async function () {
  try {
    const token = await jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET,
      {
        expiresIn: "2 years",
      }
    );

    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (e) {
    console.log(e);
  }
};

// to hash the password
saifSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confermpassword = await bcrypt.hash(this.password, 10);
    // this.confermpassword = undefined;
  }
  next();
});

const Register = new mongoose.model("Register", saifSchema);
module.exports = Register;
