const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    chatId: { type: Number, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
