const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  member: { type: Boolean, required: true, default: false },
});

userSchema.virtual('url').get(function () {
  return `/profile/${this._id}`;
});

module.exports = mongoose.model('User', userSchema);
