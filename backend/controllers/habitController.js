const Habit = require("../models/Habit");
const User = require("../models/User");

exports.createHabit = async (req, res) => {
  const { title, frequency } = req.body;

  if (!title || !frequency) {
    return res.status(400).json({ message: 'Title and frequency are required' });
  }

  try {
    const newHabit = new Habit({
      title,
      frequency,
      user: req.user.userId,
    });
    const savedHabit = await newHabit.save();

    // Add the habit to the user's habits array
    const user = await User.findById(req.user.userId);
    user.habits.push(savedHabit._id);
    await user.save();

    res.status(201).json({ habit: savedHabit });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error adding habit' });
  }
};

exports.trackHabit = async (req, res) => {
  const habitId = req.params.id;
  const trackDate = new Date();

  try {
    const habit = await Habit.findById(habitId);

    if (!habit || habit.user.toString() !== req.user.userId.toString()) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Check if habit has already been tracked today
    const alreadyTracked = habit.trackedDates.some(
      (date) => date.toDateString() === trackDate.toDateString()
    );

    if (alreadyTracked) {
      return res.status(400).json({ message: 'Habit already tracked for today' });
    }

    // Add the track date to the trackedDates array
    habit.trackedDates.push(trackDate);
    await habit.save();

    // Add coins to user
    const user = await User.findById(req.user.userId);
    user.coins += 10; // For each successful habit track
    await user.save();

    res.status(200).json({ message: 'Habit tracked successfully'});
  } catch (error) {
    res.status(500).json({ message: 'Error tracking habit' });
  }
};

exports.listHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.userId });
    res.status(200).json({ habits });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching habits' });
  }
};