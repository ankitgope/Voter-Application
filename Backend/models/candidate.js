const User = require("./user");

// Candidate schema for the candidate model like which party the belong the name of the candidate
const mongoose = requite("mongoose");
// creating a schema for the user
const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  votes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjetId,
        ref: User,
        required: true,
      },
      votedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  voteCount: {
    type: Number,
    default: 0,
  },
});

// for exporting the schema
const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;
