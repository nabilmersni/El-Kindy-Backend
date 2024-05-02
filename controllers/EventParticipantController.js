const EventParticipant = require("../models/eventParticipant");
const eventModel = require("../models/Event");
const mongoose = require("mongoose");
const eventParticipant = require("../models/eventParticipant");

exports.someFunction = async (EventName, email) => {
  try {
    const eventDoc = await eventModel.findOne({ EventName });

    if (!eventDoc) {
      throw new Error("Event not found");
    }

    const user = await mongoose.connection
      .collection("users")
      .findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    console.log("Event ID:", eventDoc._id);
    console.log("User ID:", user._id);

    let eventParticipant = await EventParticipant.findOne({
      event: eventDoc._id,
    });

    if (!eventParticipant) {
      eventParticipant = new EventParticipant({
        event: eventDoc._id,
        users: [{ user: user._id, role: "Participant" }],
      });
    } else {
      const existingUser = eventParticipant.users.find(
        (u) => u.user.toString() === user._id.toString()
      );
      if (!existingUser) {
        eventParticipant.users.push({ user: user._id, role: "Participant" });
      } else if (!existingUser.role) {
        existingUser.role = "Participant";
      }
    }

    await eventParticipant.save();

    console.log("Final EventParticipant:", eventParticipant);
  } catch (error) {
    console.error("Error in route handler:", error);
    throw new Error("Internal Server Error");
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await mongoose.connection
      .collection("users")
      .findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found for the given email" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.assignUserToEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { email } = req.body;

    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Quiz non trouvé" });
    }

    const usersCollection = mongoose.connection.collection("users");
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const eventParticipant = new EventParticipant({
      user: user._id,
      event: event._id,
    });
    await eventParticipant.save();

    event.users.push(user._id);
    await event.save();

    return res.status(200).json({
      status: "success",
      message: "Utilisateur attribué avec succès au quiz",
      user,
      event,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erreur lors de l'attribution de l'utilisateur au quiz" });
  }
};




exports.getUsers = async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventParticipants = await EventParticipant.find({ event: eventId });
    const userIds = eventParticipants.map((eventP) => eventP.user);
    const users = await mongoose.connection
      .collection("users")
      .find({ _id: { $in: userIds } })
      .toArray();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erreur lors de la récupération des utilisateurs par ID de quiz",
    });
  }
};

/*Node Mailer Part */

///****sarraa****/////////

exports.removeUserFromEvent = async (req, res) => {
  const { userId, eventId } = req.params;

  try {
    // Supprimer l'utilisateur de l'événement
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.users = event.users.filter(
      (user) => user.toString() !== userId.toString()
    );
    await event.save();

    // Supprimer le lien dans eventParticipant
    await eventParticipant.deleteOne({ user: userId, event: eventId });

    res.json({ message: "User removed from event successfully" });
  } catch (error) {
    console.error("Error removing user from event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
