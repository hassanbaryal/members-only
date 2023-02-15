const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const { Schema } = mongoose;

const postSchema = new Schema({
  title: { type: String, required: true, minLength: 1, maxLength: 100 },
  text: { type: String, required: true, minLength: 1, maxLength: 1000 },
  timeStamp: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

postSchema.virtual('url').get(function () {
  return `/post/${this._id}`;
});

postSchema.virtual('formattedTimeStamp').get(function () {
  return DateTime.fromJSDate(this.timeStamp).toLocaleString(
    DateTime.DATETIME_MED
  );
});

module.exports = mongoose.model('Post', postSchema);
