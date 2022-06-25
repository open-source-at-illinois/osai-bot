import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { NOT_AUTHORIZED_MESSAGE } from "../../constants";
import Event from "../../models/event";
import { isExec } from "../../utils";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("endevent")
    .setDescription("Ends an event by marking it as inactive")
    .addStringOption((option) =>
      option.setName("code").setDescription("Event code").setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("hard")
        .setDescription("Deletes event from database. This cannot be undone!")
        .setRequired(false)
    ),
  async execute(interaction: CommandInteraction) {
    const code = interaction.options.getString("code").trim();
    const hardDelete = interaction.options.getBoolean("hard");

    if (!isExec(interaction.member as GuildMember)) {
      interaction.reply(NOT_AUTHORIZED_MESSAGE);
      return;
    }

    // Find an event with the given code
    const event = await Event.findOne({ code }).exec();
    if (!event) {
      interaction.reply(`Could not find an event with code ${code}`);
      return;
    }

    if (hardDelete) {
      await event.delete();
      interaction.reply(
        `The event \`${event.name}\` was hard deleted. This cannot be reversed.`
      );
      return;
    }

    if (!event.active) {
      interaction.reply(`This event was already inactive.`);
      return;
    }

    event.active = false;
    await event.save();
    interaction.reply(
      `Event ${event.name} has been marked as inactive, and can no longer be attended. There were ${event.attendees.length} attendees.`
    );
  },
};
