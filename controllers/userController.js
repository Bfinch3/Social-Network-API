const { Schema, model } = require("mongoose");
const User = require("../models/user");

module.exports = {
  //create new user
  async createUser(req, res) {
    try {
      const userData = req.body;
      const newUser = await User.create(userData);
      res.status(201).json(newUser);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  // get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // get user by ID, and users thoughts and friends
  async getUserById(req, res) {
    try {
      const userId = req.params.userId;
      const user = await User.findOne({ _id: userId })
        .populate("thoughts")
        .populate("friends");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  // update user by ID
  async updateUser(req, res) {
    try {
      const userId = req.params.userId;
      const updatedUserData = req.body;
      const user = await User.findByIdAndUpdate(userId, updatedUserData, {
        new: true,
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  // add friend to friend list
  async addFriend(req, res) {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;
      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { friends: friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  // delete user by ID
  async deleteUser(req, res) {
    try {
      const userId = req.params.userId;
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      await User.updateMany(
        { friends: userId },
        { $pull: { friends: userId } }
      );
      res.json({ message: "User removed", deletedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  // remove friend from friend list
  async deleteFriend(req, res) {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { friends: friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "Friend removed", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
