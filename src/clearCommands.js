import { REST, Routes } from "discord.js";
import { config } from "dotenv";

config();

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

async function clearGuildCommands() {
  const guildIds = (process.env.GUILD_ID || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  for (const guildId of guildIds) {
    try {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
        { body: [] }
      );
      console.log(`✅ Cleared commands for guild ${guildId}`);
    } catch (err) {
      console.error(`❌ Failed to clear commands for guild ${guildId}:`, err);
    }
  }
}

clearGuildCommands();
