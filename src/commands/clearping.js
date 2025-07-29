import {
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder
} from "discord.js";
import { clearRoleForGuild } from "../lib/guildStore.js";

export const data = new SlashCommandBuilder()
  .setName("clearping")
  .setDescription("Remove the role to ping for server status alerts")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  await clearRoleForGuild(interaction.guild.id);

  await interaction.reply({
    content: `✅ Ping role has been cleared.`,
    flags: MessageFlags.Ephemeral
  });
}
