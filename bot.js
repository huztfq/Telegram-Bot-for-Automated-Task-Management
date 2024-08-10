// bot.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const Task = require('./models/task');

// Initialize bot but do not start polling yet
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
    console.error('ERROR: Telegram Bot Token not provided. Please check your .env file.');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to the database. Bot is starting...');
    bot.startPolling();
    console.log('Bot server started in the polling mode...');
  })
  .catch((err) => {
    console.error('Failed to connect to the MongoDB database:', err);
  });

// Registered users set
const registeredUsers = new Set();

// Register user
bot.onText(/\/register/, async (msg) => {
  const chatId = msg.chat.id;
  if (!registeredUsers.has(chatId)) {
    registeredUsers.add(chatId);
    await bot.sendMessage(chatId, "You are now registered!");
  } else {
    await bot.sendMessage(chatId, "You are already registered.");
  }
});

// Create Task
bot.onText(/\/create_task (.+) (\d{4}-\d{2}-\d{2})/, async (msg, match) => {
  const chatId = msg.chat.id;
  const description = match[1];
  const dueDate = new Date(match[2]);
  if (!registeredUsers.has(chatId)) {
    await bot.sendMessage(chatId, "Please register first using /register.");
    return;
  }
  
  const task = new Task({ chatId, description, dueDate });
  await task.save();
  await bot.sendMessage(chatId, `Task created: ${description} with ID: ${task._id}`);
});

// List Tasks
bot.onText(/\/list_tasks/, async (msg) => {
  const chatId = msg.chat.id;
  const tasks = await Task.find({ chatId });
  let response = "Your tasks:\n";
  tasks.forEach(task => {
    response += `${task._id}: ${task.description} (Due: ${task.dueDate.toDateString()})\n`;
  });
  await bot.sendMessage(chatId, response);
});

// Update and Delete tasks can be implemented in a similar way.
