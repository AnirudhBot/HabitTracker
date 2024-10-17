const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const habitSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly'],
      default: 'daily'
    },
    trackedDates: [{
      type: Date
    }],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }, {
    timestamps: true
  });
  
  const Habit = mongoose.model("Habit", habitSchema);
  module.exports = Habit;
