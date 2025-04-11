const express = require("express");
const router = express.Router();
// need the model for the router
const User = require("../models/user");
const Candidate = require("../models/candidate");
const { jwtAuthMiddleware } = require("../jwt");

// checking admin role
const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user.role === "admin") {
      return true; // Assuming you have a role field in your user model
    }
  } catch (error) {
    return false;
  }
};
// creating router for add new candidate
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "user has not admin role" });
    // Assuming the request body contains the person data
    const data = req.body;

    // create a new user document using Mongoose model
    const newCandidate = new Candidate(data);

    // Save the person document to the database
    const response = await newCandidate.save();
    console.log("data saved ");

    res.status(200).json({ response: response });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error " });
  }
});

// creating router for update user profile
router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "user has not admin role" });
    const candidateID = req.params.candidateID;
    const updatedCandidate = req.body;
    // Find the candidate by ID and update their information
    const response = await User.findByIdAndUpdate(
      candidateID,
      updatedCandidate.Router,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the update against the schema
      }
    );
    if (!response) {
      return re.status(404).json({ message: "candidate not found" });
    }
    console.log("data updated ");
    // Send the updated candidate information as a response
    res
      .status(200)
      .json({ message: "candidate updated successfully", response: response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

// creating router for delete candidate
router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "user has not admin role" });

    const candidateID = req.params.candidateID;

    // Find the candidate by ID and update their information
    const response = await User.findByIdAndDelete(candidateID);
    if (!response) {
      return re.status(404).json({ message: "candidate not found" });
    }
    console.log("data updated ");
    // Send the updated candidate information as a response
    res
      .status(200)
      .json({ message: "candidate updated successfully", response: response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

// lets start voting part
router.post("/voter/:candidateID", jwtAuthMiddleware, async (req, res) => {
  // 1.find the candidate by ID and update their information
  const candidateID = req.params.candidateID;
  const userID = req.user.id;
  try {
    // find the candidate document with the specified candidateId
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ message: "candidate not found" });
    }
    // check if the user is present or not
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    // check if the user has already voted or not
    if (user.isVoted) {
      return res.status(403).json({ message: "user has already voted" });
    }
    // check if the user is admin or not
    if (user.role === "admin") {
      return res.status(403).json({ message: "admin cannot vote" });
    }
    // update the candidate document to record the vote
    candidate.votes.push({ user: userID });
    (candidate.voteCount += 1), await candidate.save();

    // update the user document to mark them as having voted
    user.isVoted = true;
    await user.save();

    res
      .status(200)
      .json({ message: "vote casted successfully", candidate: candidate });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

// vote counting
router.get("/vote/count", async (req, res) => {
  try {
    // Find all candidates and their vote counts in decending order
    const candidate = await Candidate.find().sort({ voteCount: desc });
    // Map the candidates to extract their names and vote counts
    const voteCounts = candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });
    return res.status(200).json(voteCounts);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

module.exports = router;
