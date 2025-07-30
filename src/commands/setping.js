import {
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder
} from "discord.js";
import { saveRoleForGuild } from "../lib/guildStore.js";
import logger from "../lib/logger.js";

export const data = new SlashCommandBuilder()
  .setName("setping")
  .setDescription("Set the role to mention for server status alerts")
  .addRoleOption((option) =>
    option
      .setName("role")
      .setDescription("The role to mention")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  const role = interaction.options.getRole("role");

  logger.info(
    `[${interaction.guild.name}] '/setping @${role.name}' used by ${interaction.user.tag}`
  );

  await saveRoleForGuild(interaction.guild.id, role.id);

  await interaction.reply({
    content: `✅ Role <@&${role.id}> will now be pinged in alerts.`,
    flags: MessageFlags.Ephemeral
  });
}
