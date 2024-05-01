const path = require("path");
const Event = require("../models/Event");
const eventParticipant = require("../models/eventParticipant");
const multer = require("multer");
exports.createEvent = async (req, res) => {
  try {
    const { filename } = req.file;

    const event = new Event({
      ...req.body,
      EventImage: filename,
    });

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

exports.updateEvent = async (req, res) => {
  const id = req.params.id;

  try {
    if (req.file) {
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

//************************************* */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/upload-directory");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
  "image"
);

exports.uploadImage = async (req, res) => {
  const { id } = req.params;

  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    try {
      const question = await Question.findById(id);
      if (!question) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Get the file name from the file path
      const fileName = req.file.filename;

      // Update the image field with the file name
      question.image = fileName;

      await question.save();

      res.json(question);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};




exports.getJoinedEvents = async (req, res) => {
  try {
    const events = await eventParticipant.find({ userId: req.user.id })
      .populate("eventId")
      .select("eventId");

    const joinedEventIds = events.map((event) => event.eventId);

    res.json(joinedEventIds);
  } catch (error) {
    console.error('Error in getJoinedEvents:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// exports.generatePDF= async (req, res) => {
//   try {
//     const { EventName, EventDate, PriceTicket } = req.params.body;

//     // Create a new PDF document
//     const doc = new PDFDocument();

//     // Add event details to the PDF
//     doc.text(`Event Name: ${EventName}`);
//     doc.text(`Event Date: ${EventDate}`);
//     doc.text(`Ticket Price: ${PriceTicket}`);

//     // Set the response headers to indicate a PDF attachment
//     // Generate a QR code with the event details
//     const qrCode = qr.image(`Event Name: ${EventName}\nEvent Date: ${EventDate}\nTicket Price: ${PriceTicket}`, { type: 'png' });
//     doc.image(qrCode, 100, 100); // Adjust the position as needed

//     // Set the response headers to indicate a PDF attachment
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename="ticket_with_qr.pdf"');

//     // Pipe the PDF document to the response
//     doc.pipe(res);

//     // End the document
//     doc.end();
//   } catch (error) {
//     console.error('Error generating PDF with QR:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }

