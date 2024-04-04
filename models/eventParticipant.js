var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var eventParticipantSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "events",
  },

    
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      role: String,
    
  
  
});


eventParticipantSchema.statics.getEventsByUserId = async function (userId) {
  try {
    const events = await this.find({ user: userId }).populate("event");
    return events;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des events par l'ID de l'utilisateur"
    );
  }
};

const eventParticipant = mongoose.model("eventParticipant", eventParticipantSchema);

module.exports = eventParticipant;
