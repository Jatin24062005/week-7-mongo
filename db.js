const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  name: String,
  email: {type: String, unique: true},
  password: String
});

const Todo = new Schema({
  userId: ObjectId,
  title: String,
  done: Boolean,
  createdAt: { type: Date, default: Date.now }, // Automatically set to current date and time
  dueBy: Date // User can specify a due date
});

const UserModel = mongoose.model('users', User);
const TodoModel = mongoose.model('todos', Todo);

module.exports = {
    UserModel,
    TodoModel
}