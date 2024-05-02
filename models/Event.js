var mongoose = require("mongoose");
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
  PaymentStatus: { type: Number, enum: [0, 1], default: 0 },

  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "eventParticipant",
    },
  ],
  tickets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
    },
  ],
});

module.exports = mongoose.model("events", EventSchema);
