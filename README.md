# Telegram Bot for Automated Task Management

This application is a Telegram bot designed to manage tasks. It allows users to register, create, list, update, and delete tasks directly through Telegram.

## Prerequisites

- Node.js
- npm (Node Package Manager)
- Telegram account
- MongoDB database

## Setup Instructions

### 1. Clone the Repository

First, clone the repository to your local machine using git:

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Obtain Telegram Bot Token

To get a Telegram bot token:

- Open Telegram and search for "BotFather".
- Start a chat with BotFather and send /start.
- Send /newbot and follow the instructions to name your bot.
- BotFather will provide a token which looks like 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11.

### 3. Set Up MongoDB

For MongoDB connection:

- Log into MongoDB Atlas and create a cluster if needed.
- Click "Connect", then "Connect your application".
- Choose Node.js as the driver version and copy the connection string.
- Replace <password> with your MongoDB user's password and myFirstDatabase with your database name.

### 4. Set Up Environment Variables

Copy .env.example to .env and fill in your values:

```bash
cp .env.example .env
```

Edit .env and add your credentials:

TELEGRAM_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
MONGODB_URI=mongodb+srv://username:password@cluster0.url.mongodb.net/mydatabase

### 5. Install Dependencies and Run the Project

Install dependencies and run your project locally:

```bash
npm install
npm run dev
```

Your Telegram bot is now running and ready to manage tasks through Telegram.

