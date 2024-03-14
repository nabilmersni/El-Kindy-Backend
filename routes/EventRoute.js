const express = require("express");
const router = express.Router();
const eventController = require("../controllers/EventController");
const multer = require("multer");
const path = require("path");
const app = express();
const eventParticipant = require("../controllers/EventParticipantController");
const mongoose = require('mongoose');





// Set up static file serving for the upload-directory
router.use('/upload-directory', express.static(path.join(__dirname, '../public/upload-directory')));

// Set up Multer for handling file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../public/upload-directory'));
//       },
//       filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//       },
// });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/upload-directory'));
  },
  filename: (req, file, cb) => {
      // Generate a unique filename with a timestamp
      const uniqueFilename = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });




 router.get("/getall", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
// router.post("/add", eventController.createEvent);
router.post("/add", upload.single("EventImage"), eventController.createEvent);
router.delete("/:id", eventController.deleteEvent);
router.put("/:id", eventController.updateEvent);
router.patch("/:id", upload.single("EventImage"), eventController.updateEvent);

// EVENTParticipantRoutes:


router.post('/assign-participant/:EventName/:email', async (req, res) => {
  try {
     const EventName = req.params.EventName;
     const email = req.params.email;
   
     console.log('Received request for EventName:', EventName, 'and email:', email);

     const result = await eventParticipant.someFunction(EventName, email);

     res.json(result);
  } catch (error) {
     console.error('Error in route handler:', error);
     res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get("/users/:email", eventParticipant.getUserByEmail);
router.get("/:id/users", eventParticipant.getUsers);
module.exports = router;