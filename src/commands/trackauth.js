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
  .setName("trackauth")
  .setDescription("Toggle tracking of the AUTH server for this guild")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  const guildId = interaction.guild.id;
  let tracked = await getTrackedServersForGuild(guildId);
  const isTracking = tracked.includes("AUTH");

  if (isTracking) {
    tracked = tracked.filter((s) => s !== "AUTH");
  } else {
    tracked = [...tracked, "AUTH"];
  }
  await saveTrackedServersForGuild(guildId, tracked);

  logger.info(
    `[${interaction.guild.name}] '/trackauth' used by ${interaction.user.tag} — now tracking: ${tracked.join(", ")}`
  );

  await interaction.reply({
    content: isTracking
      ? "❌ AUTH server tracking disabled."
      : "✅ AUTH server tracking enabled.",
    flags: MessageFlags.Ephemeral
  });
}
