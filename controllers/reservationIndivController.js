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
    const reservations = await Reservation.find({ teacherId });
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
    app_token: "674c158d-c8c0-4514-8220-6bbab6cca2e9",
    app_secret: "90438553-6f9a-44a5-8ccc-4152e731d765",
    amount: 5000,
    accept_card: true,
    session_timeout_secs: 2000,
    success_link: `http://localhost:5173/user-side/`,
    fail_link: "http://localhost:5173/fail",
    developer_tracking_id: "8622f0a9-d841-4886-8727-c36182662e2b",
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
