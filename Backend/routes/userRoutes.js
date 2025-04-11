// 1-->user Signup POST
// 2-->user login POST
// 3--> user profile GET
// 4--> user password update or update profile PUT

const express = require("express");
const router = express.Router();
// need the model for the router
const User = require("../models/user");
const { jwtAuthMiddleware, generateToken } = require("../jwt");
// creating router for signup
router.post("/signup", async (req, res) => {
  try {
    // Assuming the request body contains the person data
    const data = req.body;

    // create a new user document using Mongoose model
    const newPerson = new User(data);

    // Save the person document to the database
    const response = await newPerson.save();
    console.log("data saved ");

    // Send a payload to the client
    const payload = {
      id: response._id, //chceck
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);

    console.log("the token is ", token);
    res.status(201).json({ response: response, token: token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error lag gaye " });
  }
});

// creating router for login
router.post("/login", async (req, res) => {
  try {
    // Extract the voterCardNo and password from the request body
    const { votercardNo, password } = req.body;

    // find the user by voterCardNo in the database
    const user = await User.findOne({ votercardNo: votercardNo });

    // chek if the user exist or password not match
    // if (!user || user.password !== password) {
    //   return res.status(401).json({ message: "Invalid credntials" });
    // }
    if (!votercardNo || !password) {
      return res
        .status(400)
        .json({ error: "voter Card Number and password are required" });
    }

    // if user exist then create a payload for the user
    const payload = {
      id: user._id,
    };

    // generate a token for the user
    const token = generateToken(payload);
    console.log("the token is ", token);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// creating router for  user profile
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the token  (checkk once)

    // Find the user in the database using the ID
    const user = await User.findById(userId);

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

// creating router for update user profile
router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the token  (checkk once)
    const { currentPassword, newPassword } = req.body; // Extract the new password from the request body

    // Find the user by id
    const user = await User.findById(userId);
    // Check if the user exists and the current password is correct
    // You might want to use a method like comparePassword if you have hashed passwords
    // we created comparePassword method in the user model

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: "Invalid current password" });
    }
    // Update the password
    user.password = newPassword;
    await user.save(); // Save the updated user document to the database
    console.log("Password updated successfully");
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

module.exports = router;
