const path = require("path");
const Event = require("../models/Event");


exports.createEvent = async (req, res) => {
    try {
        // Retrieve file information from the request
        const { filename } = req.file;

        // Create the Event instance with file information
        const event = new Event({
            ...req.body,
            EventImage: filename, // Assuming "image" is the attribute to store the file information
        });

        // Save the Event instance to the database
        await event.save();

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const { name } = req.query;
        let query = {};

        if (name) {
            // Case-insensitive search by name
            query = { nom: { $regex: new RegExp(name, "i") } };
        }
        const events = await Event.find(query);
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const fs = require('fs');

exports.updateEvent = async (req, res) => {
  const id = req.params.id;

  try {
    // Check if there's a new image file
    if (req.file) {
      // Update EventImage in req.body with the new filename
      req.body.EventImage = req.file.filename;
    }

    const event = await Event.findByIdAndUpdate(id, req.body, { new: true });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};