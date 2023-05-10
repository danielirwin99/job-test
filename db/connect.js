const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose.connect(url, {
    // These remove the deprecation warnings
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
}

module.exports = connectDB
