module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      // Check if it's a MongoDB duplicate key error
      if (error.name === "MongoServerError" && error.code === 11000) {
        // Extract the field name causing the duplicate key violation
        const duplicateKeyField = Object.keys(error.keyPattern)[0];

        // Send a meaningful response to the client
        return res.status(400).json({
          status: "fail",
          message: `${duplicateKeyField} is already in use.`,
        });
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(400).json({
          status: "error",
          message: `Token malformed, What are doing little hacker?`,
        });
      }

      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          status: "error",
          message: `Token expired`,
        });
      }

      // If it's not a duplicate key error, pass it to the next error handler
      next(error);
      // return res.status(error.code).json({
      //   status: "fail",
      //   message: `${error.name} : ${error.message}`,
      // });
    });
  };
};
