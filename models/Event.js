var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
    EventName: String,
    EventDescription: String,
    EventDate: Date,
    EventImage: String,
    PriceTicket: Number,  
    AvailablePlaces: Number, 
    EventPlace: String,
    Latitude: Number,  
    Longitude: Number,

    users: [
        {
          type: Schema.Types.ObjectId,
          ref: "eventParticipant",
        },
      ],
      tickets: [
        {
          type: Schema.Types.ObjectId,
          ref: "Ticket" // Update with correct ticket model name
        },
      ],
});

module.exports = mongoose.model('events', EventSchema);