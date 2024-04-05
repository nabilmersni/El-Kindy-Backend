const Availabilities = require("../models/availabilities");

exports.createAvailability = async (req, res) => {
  try {
    const availability = new Availabilities(req.body);
    await availability.save();
    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getTeacherAvailabilities = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const teacherAvailabilities = await Availabilities.find({
      userId: teacherId,
    });
    res.status(200).json(teacherAvailabilities);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllAvailabilities = async (req, res) => {
  try {
    const availabilities = await Availabilities.find();
    res.status(200).json(availabilities);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteAvailabilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const availability = await Availabilities.findByIdAndDelete(id);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    res.status(200).json({ message: "Availability deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAvailabilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const availability = await Availabilities.findById(id);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateAvailability = async (req, res) => {
  const { id } = req.params;

  try {
    const availability = await Availabilities.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
