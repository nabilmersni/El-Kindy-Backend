const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    purchasedAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'events'
    },
    
});

// TicketSchema.statics.getTicketsByEventId = async function(eventId) {
//     try {
//         const tickets = await this.find({ event: eventId })
//             .populate({
//                 path: 'event',
//                 select: 'EventName EventDate PriceTicket'
//             })
//             .populate('users');

//         if (!tickets) {
//             console.log(`No tickets found for event ID: ${eventId}`);
//             return [];
//         }

//         console.log(`Tickets found for event ID: ${eventId}`, tickets);
//         return tickets;
//     } catch (error) {
//         console.error(`Error fetching tickets by event ID (${eventId}):`, error);
//         throw new Error('Error fetching tickets by event ID');
//     }
// };








TicketSchema.statics.getTicketByIdAndEventId = async function(ticketId, eventId) {
    try {
        const ticket = await this.findOne({ _id: ticketId, event: eventId })
            .populate({
                path: 'event',
                select: 'EventName EventDate PriceTicket'
            })
           

        if (!ticket) {
            console.log(`Aucun ticket trouvé pour l'ID de ticket ${ticketId} et l'ID d'événement ${eventId}`);
            return null;
        }

        console.log(`Ticket trouvé pour l'ID de ticket ${ticketId} et l'ID d'événement ${eventId}`, ticket);
        return ticket;
    } catch (error) {
        console.error(`Erreur lors de la récupération du ticket par ID de ticket (${ticketId}) et ID d'événement (${eventId}):`, error);
        throw new Error('Erreur lors de la récupération du ticket par ID de ticket et ID d\'événement');
    }
};




module.exports = mongoose.model('Ticket', TicketSchema);