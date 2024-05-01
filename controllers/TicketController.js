// controllers/TicketController.js

const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

const TicketController = {
    // createTicketAndAssociateWithEvent: async (req, res) => {
    //     try {
    //       const eventId = req.params.eventId;
    
    //       const event = await Event.findById(eventId);
    //       if (!event) {
    //         return res.status(404).json({ message: 'Event not found' });
    //       }
    
        
    //       const ticketData = {
    //         ...req.body,
    //         event: eventId  
    //       };
    //       const ticket = new Ticket(ticketData);
    //       await ticket.save();
    
    //       event.tickets = event.tickets || [];
          
    //       event.tickets.push(ticket._id);
    //       await event.save();
    
    //       res.json({ message: 'Ticket created and associated with event successfully' });
    //     } catch (error) {
    //       console.error('Error:', error);
    //       res.status(500).json({ error: 'Internal server error' });
    //     }
    //   }
    // };
  //   
  


//   createTicketAndAssociateWithEvent: async (req, res) => {
//     try {
//       const eventId = req.params.eventId;
//       const userId = req.body.userId; // Assuming userId is available in request body
  
//       const event = await Event.findById(eventId);
//       if (!event) {
//         return res.status(404).json({ message: 'Event not found' });
//       }
  
//       // Check if user already has a ticket for this event
//       const existingTicket = await Ticket.findOne({ user: userId, event: eventId });
//       if (existingTicket) {
//         return res.status(400).json({ message: 'User already has a ticket for this event' });
//       }
  
//       // Decrement AvailablePlaces for the event
//       event.AvailablePlaces -= 1;
//       await event.save();
  
//       // Create ticket and associate with user and event
//       const ticket = new Ticket({
//         user: userId,
//         event: eventId  
//       });
//       await ticket.save();
  
//       // Associate ticket with event
//       event.tickets = event.tickets || [];
//       event.tickets.push(ticket._id);
//       await event.save();
  
//       res.json({ message: 'Ticket created and associated with event successfully' });
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }



// }



createTicketAndAssociateWithEvent: async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const userId = req.body.userId; // Assuming userId is available in request body
  
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      // Check if user already has a ticket for this event
    //   const existingTicket = await Ticket.findOne({ user: userId, event: eventId });
    //   if (existingTicket) {
    //     return res.status(400).json({ message: 'User already has a ticket for this event' });
    //   }
  
      // Decrement AvailablePlaces for the event
      event.AvailablePlaces -= 1;
      await event.save();
  
      // Create ticket and associate with user and event
      const ticket = new Ticket({
        user: userId,
        event: eventId  
      });
      await ticket.save();
  
      // Associate ticket with event
      event.tickets = event.tickets || [];
      event.tickets.push(ticket._id);
      await event.save();
  
      // Return success message along with the ticket object
      res.json({ 
        message: 'Ticket created and associated with event successfully',
        ticket: ticket.toJSON()  // Convert ticket object to JSON
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}  
module.exports = TicketController;
