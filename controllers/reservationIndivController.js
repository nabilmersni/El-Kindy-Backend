const Reservation = require("../models/reservationIndiv");
const axios = require("axios");

exports.createReservation = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getReservationsById = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: "reservation not found" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getReservationsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const reservations = await Reservation.find({ userId });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getReservationsByTeacherId = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const reservations = await Reservation.find({ teacherId })
      .populate("userId")
      .populate("availabilityId");
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteReservationById = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findByIdAndDelete(id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateReservationById = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//*************************************** */
exports.checkoutReservation = async (req, res) => {
  const url = "https://developers.flouci.com/api/generate_payment";
  const payload = {
    app_token: "263f8983-9abd-43da-ba09-bcd31130c386",
    app_secret: "5b22ddee-5083-440d-ab20-4bc40be2168e",
    amount: 5000,
    accept_card: true,
    session_timeout_secs: 2000,
    success_link: `http://localhost:5173/user-side/`,
    fail_link: "http://localhost:5173/fail",
    developer_tracking_id: "287f869f-d95f-47cb-ac3e-984ffc12adf6",
  };

  await axios
    .post(url, payload)
    .then((result) => {
      res.send(result.data);
    })
    .catch((err) => console.error(err));
};

// exports.VerifycheckoutReservation = async (req, res) => {
//   const payement_id = req.params.paymentId;
//   await axios
//     .get(`https://developers.flouci.com/api/verify_payment/${payement_id}`, {
//       headers: {
//         "Content-Type": "application/json",
//         apppublic: "263f8983-9abd-43da-ba09-bcd31130c386",
//         appsecret: "5b22ddee-5083-440d-ab20-4bc40be2168e",
//       },
//     })
//     .then((result) => {
//       res.send(result.data);
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// };

exports.getReservationsByUserIdAndCourseId = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const reservations = await Reservation.find({ userId, courseId });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
