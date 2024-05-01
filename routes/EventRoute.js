const express = require("express");
const router = express.Router();
const eventController = require("../controllers/EventController");
const eventParticipant = require("../controllers/EventParticipantController");
const Ticket = require("../models/Ticket");
const TicketController = require("../controllers/TicketController");
const PDFDocument = require('pdfkit');

const multer = require("multer");
const path = require("path");
const PayementController = require("../controllers/PayementController");

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






router.get('/:eventId/:ticketId', async (req, res) => {
  const eventId = req.params.eventId;
  const ticketId = req.params.ticketId;

  try {
      // Appel de la méthode pour récupérer le ticket par son ID et l'ID de l'événement
      const ticket = await Ticket.getTicketByIdAndEventId(ticketId, eventId);

      if (ticket) {
          // Si le ticket est trouvé, le renvoyer en réponse
          res.json(ticket);
      } else {
          // Si aucun ticket n'est trouvé pour les ID spécifiés, renvoyer un message d'erreur
          res.status(404).json({ message: `Aucun ticket trouvé pour l'ID de ticket ${ticketId} et l'ID d'événement ${eventId}` });
      }
  } catch (error) {
      // En cas d'erreur, renvoyer une réponse d'erreur avec le code approprié
      res.status(500).json({ message: 'Erreur lors de la récupération du ticket', error: error.message });
  }
});







router.post(
  "/:eventId/tickets",
  TicketController.createTicketAndAssociateWithEvent
);

//--------Payement------------

router.post("/payement/:id",PayementController.Add);

// router.get('/check-payment-status/:eventId/:userId', PayementController.checkPaymentStatus);


module.exports = router;
