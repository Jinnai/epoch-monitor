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
  .setName("trackgurubashi")
  .setDescription("Toggle tracking of the GURUBASHI server for this guild")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  const guildId = interaction.guild.id;
  let tracked = await getTrackedServersForGuild(guildId);
  const isTracking = tracked.includes("GURUBASHI");

  if (isTracking) {
    tracked = tracked.filter((s) => s !== "GURUBASHI");
  } else {
    tracked = [...tracked, "GURUBASHI"];
  }
  await saveTrackedServersForGuild(guildId, tracked);

  logger.info(
    `[${interaction.guild.name}] '/trackgurubashi' used by ${interaction.user.tag} — now tracking: ${tracked.join(", ")}`
  );

  await interaction.reply({
    content: isTracking
      ? "❌ GURUBASHI server tracking disabled."
      : "✅ GURUBASHI server tracking enabled.",
    flags: MessageFlags.Ephemeral
  });
}
