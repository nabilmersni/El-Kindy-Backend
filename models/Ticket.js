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
    }
});

TicketSchema.statics.getTicketsByEventId = async function(eventId) {
    try {
        const tickets = await this.find({ event: eventId })
            .populate({
                path: 'event',
                select: 'EventName EventDate PriceTicket'
            })
            .populate('user');
            console.log(tickets);
        return tickets;
    } catch (error) {
        throw new Error('Error fetching tickets by event ID');
    }
};

module.exports = mongoose.model('Ticket', TicketSchema);