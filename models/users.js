const mongoose = require('mongoose');

const LoginSchema = mongoose.Schema({
  name: String,
  email: String,
  pwd: String,
});
module.exports = mongoose.model('users', LoginSchema);