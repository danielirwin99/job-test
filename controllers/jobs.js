const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors");

// Grabs all the Jobs by the User
const getAllJobs = async (req, res) => {
  // Returns all jobs that have been created and sorts them
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

// Gets a Single Dynamic Job
// We are looking for two things -->
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  // Finding the job
  const job = await Job.findOne({
    // Making our id of the job to equal jobId alias
    _id: jobId,
    createdBy: userId,
  });
  // IF no job send this
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

// POST REQUEST
// Creates the Job/s
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  // Creates the job with the structure of the Schema types
  const job = await Job.create(req.body);
  // Return the job in json format
  res.status(StatusCodes.CREATED).json({ job });
};

// PATCH REQUEST
// UPDATE / EDIT JOB
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findByIdAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    // We pass in what we want to update --> Our body
    req.body,
    // Run your validators
    { new: true, runValidators: true }
  );

  // If there is no position or company updated then throw this Error
  if (!company || !position) {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }

  res.status(StatusCodes.OK).json({ job });
};

// DELETE REQUEST
// DELETES THE JOB
const deleteJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).send("Job Removed");
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  deleteJob,
  updateJob,
};
