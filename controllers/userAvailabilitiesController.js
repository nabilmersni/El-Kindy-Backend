const UserAvailabilities = require("../models/userAvailabilities");

exports.createUserAvailability = async (req, res) => {
  try {
    const userAvailability = new UserAvailabilities(req.body);
    await userAvailability.save();
    res.status(201).json(userAvailability);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserAvailabilitiesByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const userAvailabilities = await UserAvailabilities.find({
      userId: userId,
    });
    res.status(200).json(userAvailabilities);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllUserAvailabilities = async (req, res) => {
  try {
    const userAvailabilities = await UserAvailabilities.find();
    res.status(200).json(userAvailabilities);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteUserAvailabilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const userAvailability = await UserAvailabilities.findByIdAndDelete(id);

    if (!userAvailability) {
      return res.status(404).json({ message: "User Availability not found" });
    }

    res.status(200).json({ message: "User Availability deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserAvailabilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const userAvailability = await UserAvailabilities.findById(id);

    if (!userAvailability) {
      return res.status(404).json({ message: "User Availability not found" });
    }

    res.status(200).json(userAvailability);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateUserAvailability = async (req, res) => {
  const { id } = req.params;

  try {
    const userAvailability = await UserAvailabilities.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    if (!userAvailability) {
      return res.status(404).json({ message: "User Availability not found" });
    }

    res.status(200).json(userAvailability);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserAvailabilitiesByLevel = async (req, res) => {
  const { level } = req.params;

  try {
    const userAvailabilities = await UserAvailabilities.find({ level: level });
    res.status(200).json(userAvailabilities);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
