# Epoch Monitor

A Discord bot that monitors the status of Project Epoch Auth and world servers and sends alerts to configured channels and roles.

## Features

- Monitors Auth and World servers for online/offline status
- Sends alerts to a designated Discord channel
- Optionally pings a configured role when status changes
- Slash commands to configure alert channel and ping role

## Setup

1. Clone the repository.
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Create `.env` file and fill in your Discord bot token, client ID, and (optionally) guild ID:
   ```
   TOKEN=your-bot-token
   CLIENT_ID=your-client-id
   GUILD_ID=your-guild-id   # optional, for testing commands in a single server
   ```
4. Deploy slash commands:
   ```sh
   pnpm run deploy-commands
   ```
5. Start the bot:
   ```sh
   pnpm run dev
   ```
   or for production:
   ```sh
   pnpm run start
   ```

## Usage

- `/setchannel` — Set the channel for server status alerts
- `/setping` — Set the role to mention for alerts
- `/clearping` — Remove the ping role

## License