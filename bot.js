// Dependencies
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const Task = require('./models/task');
const fs = require('fs');
const { logger } = require('./logger'); 

// Constants
const token = process.env.TELEGRAM_TOKEN;
const mongoUri = process.env.MONGO_URI;

if (!token || !mongoUri) {
    logger.error('ERROR: Missing configuration in .env file.');
    process.exit(1);
}

// Global set of registered users (for sending error notifications)
const registeredUsers = new Set();

// Database Connection
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('Connected to MongoDB successfully.'))
    .catch(err => {
        logger.error('Failed to connect to MongoDB:', err);
        notifyUsersOfError("Facing technical difficulties, will be back soon.");
        process.exit(1);
    });

// Telegram Bot Initialization
const bot = new TelegramBot(token, { polling: true });

// Error handling for polling issues
bot.on('polling_error', (error) => {
    logger.error(error.code, error.message);
    notifyUsersOfError("Facing technical difficulties, will be back soon.");
});

// Start Command with Options
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Register", callback_data: "register" },
                    { text: "List Tasks", callback_data: "list_tasks" }
                ],
                [
                    { text: "Create Task", callback_data: "create_task" },
                    { text: "Help", callback_data: "help" }
                ]
            ]
        }
    };

    await bot.sendMessage(chatId, "Welcome! Choose an option:", options);
});

// Handle button presses
bot.on('callback_query', async (callbackQuery) => {
    const data = callbackQuery.data;
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;

    if (data === 'register') {
        // Handle registration
        if (!registeredUsers.has(chatId)) {
            registeredUsers.add(chatId);
            await bot.sendMessage(chatId, "You are now registered!");
            logger.info(`User registered: ${chatId}`);
        } else {
            await bot.sendMessage(chatId, "You are already registered.");
        }
    } else if (data === 'list_tasks') {
        // Handle listing tasks
        const tasks = await Task.find({ chatId });
        if (tasks.length === 0) {
            await bot.sendMessage(chatId, "You have no tasks.");
            return;
        }

        let response = "Your tasks:\n";
        tasks.forEach(task => {
            response += `${task._id}: ${task.description} (Created: ${task.createdAt.toDateString()})\n`;
        });
        await bot.sendMessage(chatId, response);
    } else if (data === 'create_task') {
        await bot.sendMessage(chatId, "Use the command: /create_task <task name> to create a task.");
    } else if (data === 'help') {
        await bot.sendMessage(chatId, "Here are some commands you can use:\n" +
            "/register - Register yourself with the bot\n" +
            "/create_task <task name> - Create a new task\n" +
            "/list_tasks - List all your tasks\n" +
            "/delete_task <task_id> - Delete a task by ID\n");
    }

    bot.answerCallbackQuery(callbackQuery.id);
});

// Register user
bot.onText(/\/register/, async (msg) => {
    const chatId = msg.chat.id;
    if (!registeredUsers.has(chatId)) {
        registeredUsers.add(chatId);
        await bot.sendMessage(chatId, "You are now registered!");
        logger.info(`User registered: ${chatId}`);

        // Send available commands after registration
        await bot.sendMessage(chatId, "Here are some commands you can use:\n" +
            "/create_task <task name> - Create a new task\n" +
            "/list_tasks - List all your tasks\n" +
            "/delete_task <task_id> - Delete a task by ID\n");
    } else {
        await bot.sendMessage(chatId, "You are already registered.");
        logger.info(`User already registered attempt: ${chatId}`);
    }
});

// Create Task with just the task name
bot.onText(/\/create_task (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const description = match[1];

    if (!registeredUsers.has(chatId)) {
        await bot.sendMessage(chatId, "Please register first using /register.");
        return;
    }

    const task = new Task({ chatId, description });
    await task.save();
    await bot.sendMessage(chatId, `Task created: ${description} with ID: ${task._id}`);
    logger.info(`Task created: ${task._id} for user ${chatId}`);
});

// List Tasks
bot.onText(/\/list_tasks/, async (msg) => {
    const chatId = msg.chat.id;
    const tasks = await Task.find({ chatId });

    if (tasks.length === 0) {
        await bot.sendMessage(chatId, "You have no tasks.");
        return;
    }

    let response = "Your tasks:\n";
    tasks.forEach(task => {
        response += `${task._id}: ${task.description} (Created: ${task.createdAt.toDateString()})\n`;
    });
    await bot.sendMessage(chatId, response);
    logger.info(`Tasks listed for user ${chatId}`);
});

// Help Command
bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, "Here are some commands you can use:\n" +
        "/register - Register yourself with the bot\n" +
        "/create_task <task name> - Create a new task\n" +
        "/list_tasks - List all your tasks\n" +
        "/delete_task <task_id> - Delete a task by ID\n");
});

// Notify users of server errors
async function notifyUsersOfError(message) {
    for (const chatId of registeredUsers) {
        try {
            await bot.sendMessage(chatId, message);
        } catch (err) {
            logger.error(`Failed to send error message to ${chatId}:`, err);
        }
    }
}

// Global error handlers
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    notifyUsersOfError("Facing technical difficulties, will be back soon.");
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    notifyUsersOfError("Facing technical difficulties, will be back soon.");
    process.exit(1);
});

// Exit handling
process.on('SIGINT', () => {
    logger.info('Bot server is shutting down...');
    process.exit(0);
});