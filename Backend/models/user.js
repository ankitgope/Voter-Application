const mongoose = requite("mongoose");
// creating a schema for the user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    reqired: true,
  },
  email: {
    type: String,
  },
  // for mobile number in production we keep it in string because due to country specific mobile  have either 10 number or 11 number depends on the country
  mobile: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  voterCardNod: {
    type: Number,
    required: true,
    uniqe: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enu: ["adimin", "user"],
    default: User,
  },
  //   now this below will checl if the user given vote or not
  isVoted: {
    type: Boolean,
    default: false,
  },
});

// for exporting the schema
const User = mongoose.model("User", userSchema);
module.exports = User;
