import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

config();

const commands = [];
const commandsPath = path.resolve(process.cwd(), "src", "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

// Load all command definitions
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

try {
  console.log("🛠️  Registering slash commands...");

  if (process.env.GUILD_ID) {
    // Register per guild (instant, good for testing)
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log("✅ Commands registered to guild.");
  } else {
    // Global registration (takes ~1 hour)
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands
    });
    console.log("✅ Commands registered globally.");
  }
} catch (error) {
  console.error("❌ Failed to register commands:", error);
}
