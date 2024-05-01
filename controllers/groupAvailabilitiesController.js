const GroupAvailabilities = require("../models/groupAvailabilities");

exports.createGroupAvailabilities = async (req, res) => {
  try {
    const groupAvailabilities = new GroupAvailabilities(req.body);
    await groupAvailabilities.save();
    res.status(201).json(groupAvailabilities);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllGroupAvailabilities = async (req, res) => {
  try {
    const groupAvailabilities = await GroupAvailabilities.find().populate(
      "groupId"
    );
    res.status(200).json(groupAvailabilities);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteGroupAvailabilitiesById = async (req, res) => {
  const { id } = req.params;

  try {
    const groupAvailabilities = await GroupAvailabilities.findByIdAndDelete(id);

    if (!groupAvailabilities) {
      return res
        .status(404)
        .json({ message: "Group Availabilities not found" });
    }

    res
      .status(200)
      .json({ message: "Group Availabilities deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getGroupAvailabilitiesById = async (req, res) => {
  const { id } = req.params;

  try {
    const groupAvailabilities = await GroupAvailabilities.findById(id).populate(
      "groupId"
    );

    if (!groupAvailabilities) {
      return res
        .status(404)
        .json({ message: "Group Availabilities not found" });
    }

    res.status(200).json(groupAvailabilities);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateGroupAvailabilities = async (req, res) => {
  const { id } = req.params;

  try {
    const groupAvailabilities = await GroupAvailabilities.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    if (!groupAvailabilities) {
      return res
        .status(404)
        .json({ message: "Group Availabilities not found" });
    }

    res.status(200).json(groupAvailabilities);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSelectedProperties = async (req, res) => {
  try {
    const groupAvailabilities = await GroupAvailabilities.find();
    res.status(200).json(groupAvailabilities);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
