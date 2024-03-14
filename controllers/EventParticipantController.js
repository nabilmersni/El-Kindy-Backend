const EventParticipant = require('../models/eventParticipant');
const eventModel = require('../models/Event');
const mongoose = require('mongoose');


// exports.getEventParticipantByEmail = async (req, res) => {
//   try {
//     const userEmail = req.params.email;

//     const populatedEventParticipant = await eventParticipant.findOne({
//       'users.user.email': userEmail
//     }).populate('event').populate('users.user');

//     if (!populatedEventParticipant) {
//       return res.status(404).json({ error: "Event participant not found for the given email" });
//     }

//     res.json(populatedEventParticipant);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.someFunction = async (EventName, email) => {
    try {
        const eventDoc = await eventModel.findOne({ EventName });

        if (!eventDoc) {
            throw new Error('Event not found');
        }

        const user = await mongoose.connection.collection('users').findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        console.log('Event ID:', eventDoc._id);
        console.log('User ID:', user._id);

        let eventParticipant = await EventParticipant.findOne({ event: eventDoc._id });

        if (!eventParticipant) {
            eventParticipant = new EventParticipant({
                event: eventDoc._id,
                users: [{ user: user._id, role: 'Participant' }],
            });
        } else {
            // Check if the user already exists in the eventParticipant
            const existingUser = eventParticipant.users.find(u => u.user.toString() === user._id.toString());
            if (!existingUser) {
                eventParticipant.users.push({ user: user._id, role: 'Participant' });
            } else if (!existingUser.role) {
                existingUser.role = 'Participant';
            }
        }

        await eventParticipant.save();

        console.log('Final EventParticipant:', eventParticipant);

    } catch (error) {
        console.error('Error in route handler:', error);
        throw new Error('Internal Server Error');
    }
};
 
exports.getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        // Fetch user by email
        const user = await mongoose.connection.collection('users').findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found for the given email" });
        }

        // If user found, send it as a JSON response
        res.json(user);
    } catch (error) {
        console.error("Error fetching user by email:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getUsers = async (req, res) => {
    try {
      const event = await eventModel.findById(req.params.id);
      if (!event) return res.status(404).json({ error: "Quiz not found" });
      const usersCursor = await event.getUsers();
      const users = await usersCursor.toArray();
      console.log("Users:", users);
      res.json(users);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  };

