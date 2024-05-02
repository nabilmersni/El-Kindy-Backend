// controllers/TicketController.js

const Ticket = require("../models/Ticket");
const Event = require("../models/Event");

const TicketController = {
  createTicketAndAssociateWithEvent: async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const userId = req.body.userId; // Assuming userId is available in request body

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      event.AvailablePlaces -= 1;
      await event.save();

      const ticket = new Ticket({
        user: userId,
        event: eventId,
      });
      await ticket.save();

      event.tickets = event.tickets || [];
      event.tickets.push(ticket._id);
      await event.save();

      res.json({
        message: "Ticket created and associated with event successfully",
        ticket: ticket.toJSON(),
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
module.exports = TicketController;
