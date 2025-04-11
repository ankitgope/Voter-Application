const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// creating a schema for the user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
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
  voterCardNo: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "voter"],
    default: "voter",
  },
  //   now this below will checl if the user given vote or not
  isVoted: {
    type: Boolean,
    default: false,
  },
});
// creating a pre hook for the user schema to hash the password before saving it to the database
// for this we will use bcryptjs library

userSchema.pre("save", async function (next) {
  const person = this;

  // Hash the password onnly if it has been modified (or is new)
  if (!person.isModified("password")) return next();
  try {
    // hash password generation
    const salt = await bcrypt.genSalt(10);

    // hash password
    const hashPassword = await bcrypt.hash(person.password, salt);

    // overwrite the plain password with the hashed one
    person.password = hashPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

// creating a method to compare the password with the hashed password
userSchema.methods.comparePassword= async function(candidatePassword){
  try {
    // use bcrypt to comapre the provided password with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch; // return true if the password matches, false otherwise
  } catch (error) {
    throw new Error("Error comparing password:", error);
  }
}
// for exporting the schema
const User = mongoose.model("User", userSchema);
module.exports = User;
