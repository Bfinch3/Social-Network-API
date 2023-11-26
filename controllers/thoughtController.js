const { Thought, User } = require("../models");
const mongoose = require("mongoose");

module.exports = {
  //create new thought
  async createThought(req, res) {
    try {
      const { userId } = req.body;
      const thought = await Thought.create(req.body);
      const user = await User.findByIdAndUpdate(userId, {
        $push: { thoughts: thought._id },
      });
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  //Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Get single thought
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId).select();
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //update reaction
  async createReaction(req, res) {
    const { thoughtId } = req.params;
    const { reactionBody, username, createdAt, userId } = req.body;
    try {
      const thought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $push: { reactions: { reactionBody, username, createdAt } } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.status(201).json(thought.reactions[thought.reactions.length - 1]);
    } catch (err) {
      console.err(err);
      res.status(500).json({ message: "Internal server err" });
    }
  },
  //update thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Find and delete thought by ID
  async deleteThought(req, res) {
    try {
      const userId = req.params.userId;
      const thoughtId = req.params.thoughtId;
      const deletedThought = await Thought.findByIdAndDelete(thoughtId);
      if (!deletedThought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      // Remove thought ID from users thought array
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { thoughts: thoughtId } },
        { new: true }
      );
      res.json({ message: "Thought deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  //Delete reaction by ID
  async deleteReaction(req, res) {
    try {
      const thoughtId = req.params.thoughtId;
      const reactionId = req.params.reactionId;
      const thought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $pull: { reactions: reactionId } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "Reaction removed", thought });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
