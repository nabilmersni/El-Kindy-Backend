const Availabilities = require("../models/availabilities");
const Reservation = require("../models/reservationIndiv");

exports.createAvailability = async (req, res) => {
  try {
    const availability = new Availabilities(req.body);
    await availability.save();
    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.getTeacherAvailabilities = async (req, res) => {
//   const { teacherId } = req.params;

//   try {
//     const teacherAvailabilities = await Availabilities.find({
//       userId: teacherId,
//     });
//     res.status(200).json(teacherAvailabilities);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.getTeacherAvailabilities = async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Récupérer tous les IDs des disponibilités réservées pour cet enseignant
    const reservedAvailabilityIds = await Reservation.distinct(
      "availabilityId",
      { teacherId }
    );

    // Trouver toutes les disponibilités de l'enseignant qui ne sont pas réservées
    const teacherAvailabilities = await Availabilities.find({
      userId: teacherId,
      _id: { $nin: reservedAvailabilityIds },
    });

    res.status(200).json(teacherAvailabilities);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.getAllAvailabilities = async (req, res) => {
//   try {
//     const availabilities = await Availabilities.find();
//     res.status(200).json(availabilities);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.deleteAvailabilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const availability = await Availabilities.findByIdAndDelete(id);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    res.status(200).json({ message: "Availability deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAvailabilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const availability = await Availabilities.findById(id);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateAvailability = async (req, res) => {
  const { id } = req.params;

  try {
    const availability = await Availabilities.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllAvailabilities = async (req, res) => {
  try {
    // Récupérer tous les ID des disponibilités réservées
    const reservedAvailabilityIds = await Reservation.distinct(
      "availabilityId"
    );

    // Trouver toutes les disponibilités qui ne sont pas réservées
    const availabilities = await Availabilities.find({
      _id: { $nin: reservedAvailabilityIds },
    });

    res.status(200).json(availabilities);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getTeacherReservedAvailabilities = async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Récupérer tous les IDs des disponibilités réservées pour cet enseignant
    const reservedAvailabilityIds = await Reservation.distinct(
      "availabilityId",
      { teacherId }
    );

    // Trouver toutes les disponibilités réservées de l'enseignant
    const reservedAvailabilities = await Availabilities.find({
      _id: { $in: reservedAvailabilityIds },
    });

    res.status(200).json(reservedAvailabilities);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllAvailabilitiesByDay = async (req, res) => {
  const { day } = req.params;

  try {
    // Récupérer tous les IDs des disponibilités réservées pour ce jour de la semaine
    const reservedAvailabilityIds = await Reservation.distinct(
      "availabilityId"
    );

    // Trouver toutes les disponibilités qui ne sont pas réservées pour ce jour de la semaine
    const availabilities = await Availabilities.find({
      day,
      _id: { $nin: reservedAvailabilityIds },
    });

    res.status(200).json(availabilities);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
