const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    chatId: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date }, // Make dueDate optional
    createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
