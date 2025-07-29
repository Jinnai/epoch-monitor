import {
  ChannelType,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { saveChannelForGuild } from "../lib/guildStore.js";

export const data = new SlashCommandBuilder()
  .setName("setchannel")
  .setDescription("Set the channel for server status alerts")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel to post alerts to")
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  const channel = interaction.options.getChannel("channel");

  await saveChannelForGuild(interaction.guild.id, channel.id);

  await interaction.reply({
    content: `✅ Alerts will now be posted in ${channel}`,
    flags: MessageFlags.Ephemeral,
  });
}
