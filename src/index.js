import { Client, GatewayIntentBits, MessageFlags } from "discord.js";
import { config } from "dotenv";
import { getAllSettings } from "./lib/guildStore.js";
import logger from "./lib/logger.js";
import { monitorServerStatus } from "./lib/serverStatus.js";

config();
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", async () => {
  logger.info(`Logged in as ${client.user.tag}`);

  const settings = await getAllSettings(client);
  for (const { channel, roleId } of settings) {
    monitorServerStatus(channel, roleId);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    const command = await import(`./commands/${commandName}.js`);
    await command.execute(interaction);
  } catch (err) {
    console.error(`Error handling command ${commandName}:`, err);
    await interaction.reply({
      content: "❌ There was an error executing this command.",
      flags: MessageFlags.Ephemeral,
    });
  }
});

client.login(process.env.TOKEN);
