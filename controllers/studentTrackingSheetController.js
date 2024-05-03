const StudentTrackingSheet = require("../models/studentTrackingSheet");

exports.createStudentTrackingSheet = async (req, res) => {
  try {
    const studentTrackingSheet = new StudentTrackingSheet(req.body);
    await studentTrackingSheet.save();
    res.status(201).json(studentTrackingSheet);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getByTeacher = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const studentTrackingSheets = await StudentTrackingSheet.find({
      teacherId,
    });
    res.status(200).json(studentTrackingSheets);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllStudentTrackingSheets = async (req, res) => {
  try {
    const studentTrackingSheets = await StudentTrackingSheet.find();
    res.status(200).json(studentTrackingSheets);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteStudentTrackingSheetById = async (req, res) => {
  const { id } = req.params;

  try {
    const studentTrackingSheet = await StudentTrackingSheet.findByIdAndDelete(
      id
    );

    if (!studentTrackingSheet) {
      return res
        .status(404)
        .json({ message: "Student Tracking Sheet not found" });
    }

    res
      .status(200)
      .json({ message: "Student Tracking Sheet deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getStudentTrackingSheetById = async (req, res) => {
  const { id } = req.params;

  try {
    const studentTrackingSheet = await StudentTrackingSheet.findById(id);

    if (!studentTrackingSheet) {
      return res
        .status(404)
        .json({ message: "Student Tracking Sheet not found" });
    }

    res.status(200).json(studentTrackingSheet);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateStudentTrackingSheet = async (req, res) => {
  const { id } = req.params;

  try {
    const studentTrackingSheet = await StudentTrackingSheet.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    if (!studentTrackingSheet) {
      return res
        .status(404)
        .json({ message: "Student Tracking Sheet not found" });
    }

    res.status(200).json(studentTrackingSheet);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
