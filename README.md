# Telegram Bot for Automated Task Management
Objective:
To evaluate your proficiency in working with the Telegram Bot API, handling
asynchronous operations, and managing persistent data using Node.js.
Task Overview:
Create a Telegram bot using Node.js that can manage tasks for a team. The bot
should allow users to create, update, delete, and list tasks. Additionally, it should
send reminders and daily summaries of tasks.
Instructions:
1. Bot Setup and Initialization
Set up a new bot using the Telegram Bot API.
Provide the bot with a unique name and handle.
Use Node.js and a relevant library (e.g., node-telegram-bot-api ) to develop the
bot.
2. User Authentication
Implement user authentication to ensure that only registered users can
interact with the bot.
Users should register by sending a predefined command (e.g., /register ).
3. Task Management Features
Create Task: Users should be able to create a new task by sending a
command (e.g., /create_task <task_description> <due_date> ). The bot should
respond with a confirmation message.
Update Task: Users should be able to update an existing task by sending a
command (e.g., /update_task <task_id> <new_task_description> <new_due_date> ).
Delete Task: Users should be able to delete a task by sending a command
(e.g., /delete_task <task_id> ).
List Tasks: Users should be able to list all their tasks by sending a command
(e.g., /list_tasks ). The bot should respond with a list of tasks including their
IDs, descriptions, and due dates.
4. Reminder and Daily Summary
Reminders: The bot should send reminders to users about their tasks.
Reminders should be sent at a configurable time before the task's due date
(e.g., 1 hour before).
Back end Test Task[s]: Choose 1 2
Daily Summary: The bot should send a daily summary of pending tasks to
users at a specific time each day.
5. Persistent Data Management
Use a database (e.g., MongoDB, PostgreSQL) to store user data and tasks.
Ensure data persistence across bot restarts.
6. Deployment and Instructions
Deploy the bot on a platform such as Heroku, AWS, or any other cloud service.
Provide clear instructions on how to set up and run the bot, including
necessary environment variables and dependencies.
