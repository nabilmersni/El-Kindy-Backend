const express = require("express");
const router = express.Router();
const eventController = require("../controllers/EventController");
const eventParticipant = require("../controllers/EventParticipantController");
const Ticket = require("../models/Ticket");
const TicketController = require("../controllers/TicketController");

const multer = require("multer");
const path = require("path");

router.use(
  "/upload-directory",
  express.static(path.join(__dirname, "../public/upload-directory"))
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/upload-directory"));
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

router.get("/getall", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.post("/add", upload.single("EventImage"), eventController.createEvent);
router.delete("/:id", eventController.deleteEvent);
router.put("/:id", eventController.updateEvent);
router.patch("/:id", upload.single("EventImage"), eventController.updateEvent);
router.post("/:id/image", eventController.uploadImage);
router.get("/eventsjoined", eventController.getJoinedEvents);

//***************************** */ EVENTParticipantRoutes:****************************************

router.post("/assign-participant/:EventName/:email", async (req, res) => {
  try {
    const EventName = req.params.EventName;
    const email = req.params.email;

    console.log(
      "Received request for EventName:",
      EventName,
      "and email:",
      email
    );

    const result = await eventParticipant.someFunction(EventName, email);

    res.json(result);
  } catch (error) {
    console.error("Error in route handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/users/:email", eventParticipant.getUserByEmail);
router.get("/:eventId/users", eventParticipant.getUsers);
router.post("/:eventId/assign", eventParticipant.assignUserToEvent); //mail fy body
router.delete("/:eventId/users/:userId", eventParticipant.removeUserFromEvent);
//-----------Ticket ---------------

router.get("/tickets/:eventId", async (req, res) => {
  try {
    const tickets = await Ticket.getTicketsByEventId(req.params.eventId);
    if (!tickets) {
      return res
        .status(404)
        .json({ message: "Tickets not found for the given event" });
    }
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/:eventId/tickets",
  TicketController.createTicketAndAssociateWithEvent
);

module.exports = router;
