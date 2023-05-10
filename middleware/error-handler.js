const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // Set default
    // Show one or the other
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };

  // If there is a custom error send this back
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  // Checking if it is a ValidationError in the name
  if (err.name === "ValidationError") {
    // We are looking inside the errors object
    (customError.msg = Object.values(err.errors)
      // Turns the object into an array and iterates over it
      .map((item) => item.message)
      // Adds a comma between values
      .join(",")),
      (customError.statusCode = 400);
  }

  // If there is a duplicate attempt of registering a user
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate Value entered for ${err.keyValue} field, please choose another value`;
    customError.statusCode = 400;
  }

  // If the name: "CastError" when we route to the wrong jobId
  if (err.name === "CastError") {
    // Our Message is going to be this
    // err.value --> Whatever the endpoint of the url was / the wrong URL id of the job
    customError.msg = `No item found with id ${err.value}`;
    customError.statusCode = 404;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
