import {
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder
} from "discord.js";
import {
  getTrackedServersForGuild,
  saveTrackedServersForGuild
} from "../lib/guildStore.js";
import logger from "../lib/logger.js";

export const data = new SlashCommandBuilder()
  .setName("trackkezan")
  .setDescription("Toggle tracking of the KEZAN server for this guild")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  const guildId = interaction.guild.id;
  let tracked = await getTrackedServersForGuild(guildId);
  const isTracking = tracked.includes("KEZAN");

  if (isTracking) {
    tracked = tracked.filter((s) => s !== "KEZAN");
  } else {
    tracked = [...tracked, "KEZAN"];
  }
  await saveTrackedServersForGuild(guildId, tracked);

  logger.info(
    `[${interaction.guild.name}] '/trackkezan' used by ${interaction.user.tag} — now tracking: ${tracked.join(", ")}`
  );

  await interaction.reply({
    content: isTracking
      ? "❌ KEZAN server tracking disabled."
      : "✅ KEZAN server tracking enabled.",
    flags: MessageFlags.Ephemeral
  });
}
