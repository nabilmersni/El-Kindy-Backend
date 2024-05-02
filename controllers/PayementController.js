const axios = require("axios");
const Ticket = require("../models/Ticket");
const { createTicketAndAssociateWithEvent } = require("./TicketController");
const Event = require("../models/Event");

module.exports = {
  Add: async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (!event.PriceTicket || isNaN(event.PriceTicket)) {
      return res.status(400).json({ message: "Invalid price ticket" });
    }

    const url = "https://developers.flouci.com/api/generate_payment";
    const payload = {
      app_token: "674c158d-c8c0-4514-8220-6bbab6cca2e9",
      app_secret: "90438553-6f9a-44a5-8ccc-4152e731d765",
      amount: event.PriceTicket,
      accept_card: true,
      session_timeout_secs: 20000,
      success_link: `http://localhost:5173/user-side/AllEvents`,
      fail_link: "http://localhost:5173/fail",
      developer_tracking_id: "8622f0a9-d841-4886-8727-c36182662e2b",
    };

    try {
      const response = await axios.post(url, payload);
      // If payment is successful, update paymentStatus to 1
      event.PaymentStatus = 1;
      await event.save(); // Save the updated event
      res.send(response.data);
    } catch (error) {
      console.error("Flouci API Error:", error.response.data);
      res.status(error.response.status).send(error.response.data);
    }
  },

  Verify: async (req, res) => {
    const payement_id = req.params.paymentId;
    await axios
      .get(`https://developers.flouci.com/api/verify_payment/${payement_id}`, {
        headers: {
          "Content-Type": "application/json",
          apppublic: "674c158d-c8c0-4514-8220-6bbab6cca2e9",
          appsecret: "90438553-6f9a-44a5-8ccc-4152e731d765",
        },
      })
      .then((result) => {
        res.send(result.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  },
};
