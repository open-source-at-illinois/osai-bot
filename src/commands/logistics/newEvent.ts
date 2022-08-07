import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { NOT_AUTHORIZED_MESSAGE } from "../../constants";
import Event from "../../models/event";
import { isExec } from "../../utils";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("newevent")
    .setDescription("Creates a meeting")
    .addStringOption((option) =>
      option.setName("name").setDescription("Meeting name").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("code").setDescription("Meeting code").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Meeting description")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("when").setDescription("Meeting time").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("where")
        .setDescription("Meeting location")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("points")
        .setDescription("Points for meeting. Defaults to 1")
        .setRequired(false)
    ),

  async execute(interaction: CommandInteraction) {
    const DEFAULT_EVENT_POINTS = 10;

    if (!isExec(interaction.member as GuildMember)) {
      interaction.reply(NOT_AUTHORIZED_MESSAGE);
      return;
    }
    const code = interaction.options.getString("code");
    const codeTaken = await Event.findOne({ code });
    if (codeTaken) {
      interaction.reply("This code was already taken, try another.");
      return;
    }

    const event = new Event({
      name: interaction.options.getString("name"),
      code,
      description: interaction.options.getString("description"),
      when: interaction.options.getString("when"),
      where: interaction.options.getString("where"),
      points: interaction.options.getInteger("points") || DEFAULT_EVENT_POINTS,
    });
    await event.save();

    const exampleEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`New Event: ${event.name}`)
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: interaction.user.avatarURL(),
      })
      .setDescription(event.description)
      .addFields(
        { name: "When", value: event.when },
        { name: "Where", value: event.where },
        { name: "Points", value: `${event.points}`, inline: true },
        { name: "Code", value: event.code, inline: true }
      )
      .setTimestamp();

    interaction.reply({ embeds: [exampleEmbed] });
  },
};

export const validateStringField = (
  interaction: CommandInteraction,
  fieldName: string
): boolean => {
  const field = interaction.options.getString(fieldName).trim();
  if (field === "") {
    return false;
  }
  return true;
};
