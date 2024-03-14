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
});

module.exports = mongoose.model('events', EventSchema);