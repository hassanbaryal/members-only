const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const { Schema } = mongoose;

const commentSchema = new Schema({
  text: { type: String, required: true, minLength: 1, maxLength: 1000 },
  timeStamp: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

commentSchema.virtual('formattedTimeStamp').get(function () {
  return DateTime.fromJSDate(this.timeStamp).toLocaleString(
    DateTime.DATETIME_MED
  );
});

module.exports = mongoose.model('Comment'.commentSchema);
