var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var eventParticipantSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "events",
  },

  users: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      role: String,
    }
  ],
});

eventParticipantSchema.methods.getUsers = async function () {
  console.log("IDs to search:", this.users);
  return await mongoose.connection.collection("users").find({
    _id: { $in: this.users.user },
  });
};

module.exports = mongoose.model("eventParticipant", eventParticipantSchema);