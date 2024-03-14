const AvailableDates = require("../models/availableDates");

exports.createAvailableDates = async (req, res) => {
  try {
    const availableDates = new AvailableDates(req.body);
    await availableDates.save();
    res.status(201).json(availableDates);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Erreur :", error);
  }
};
