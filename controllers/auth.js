const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

// REGISTER FUNCTION
const register = async (req, res) => {
  // Creates the User when we hit POST
  const user = await User.create({
    ...req.body,
  });

  const token = user.createJWT();

  // This sends back user.name and the token when FRONTEND looks for it
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

// LOGIN FUNCTION
const login = async (req, res) => {
  // Initial checking
  const { email, password } = req.body;

  // If User does not type in both then throw this ERROR
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  // Finds the specific email in the backend DB
  const user = await User.findOne({ email });

  // If there is no USER with those credentials throw this error
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // Compare the password hashes ONLY WHEN WE HAVE A USER FROM ABOVE
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid password");
  }

  // IF the user does exist --> Create the token
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
