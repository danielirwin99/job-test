const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = (req, res, next) => {
  // Check Header
  const authHeader = req.headers.authorization;
  // If there is no header or if the token doesnt start with BEARER
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  // We are trying to split the "Bearer" and the actual token address => Only want the address
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the job route
    req.user = { userId: payload.userId, name: payload.name };
    // Invoke next always
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

module.exports = auth;
