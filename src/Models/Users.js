const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 50,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 50,
    trim: true,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
        if(!validator.isEmail(value)) {
            throw new Error("Invalid Email Id " + value)
        }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
        if(!validator.isStrongPassword(value, {minLength: 10})) {
            throw new Error("Invalid Password: " + value);
        }
    }
  },
  age: {
    type: Number,
    trim: true,
    min: 18,
    max: 50,
  },
  gender: {
    type: String,
    trim: true,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Invalid Gender");
      }
    },
  },
  photoUrl: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png",
    trim: true,
    validate(value) {
        if(!validator.isURL(value)) {
            throw new Error("Invalid Url: " + value);
        }
    }
  },
  about: {
    type: String,
    default: "This is a default about of an user",
    trim: true,
    maxLength: 1000,
  },
  skills: {
    type: [String],
    validate(value) {
        if(value.length > 10) {
            throw new Error("Skills should not exceed 10")
        }
    }
  },
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
