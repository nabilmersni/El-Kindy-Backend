const express = require("express");
const reservationController = require("../controllers/reservationIndivController");

const router = express.Router();

// Route pour créer une réservation
router.post("/", reservationController.createReservation);

// Route pour obtenir les réservations par l'ID de l'utilisateur
router.get("/user/:userId", reservationController.getReservationsByUserId);

router.get("/:id", reservationController.getReservationsById);

// Route pour obtenir les réservations par l'ID de l'enseignant
router.get(
  "/teacher/:teacherId",
  reservationController.getReservationsByTeacherId
);

// Route pour supprimer une réservation par son ID
router.delete("/:id", reservationController.deleteReservationById);

router.put("/:id", reservationController.updateReservationById);

//checkout
router.post("/checkout", reservationController.checkoutReservation);

// get by userId and courseId
router.get(
  "/user/:userId/course/:courseId",
  reservationController.getReservationsByUserIdAndCourseId
);

module.exports = router;
