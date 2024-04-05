const Group = require("../models/group");

exports.createGroup = async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("users");
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteGroupById = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findByIdAndDelete(id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getGroupById = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findById(id).populate("users");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
