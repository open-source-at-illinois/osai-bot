import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import Event, { EventType } from "../../models/event";
import { isExec } from "../../utils";

// command to list all active events
module.exports = {
  data: new SlashCommandBuilder()
    .setName("events")
    .setDescription("Lists all active events")
    .addBooleanOption((option) =>
      option
        .setName("all")
        .setDescription("Shows all events")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("normal")
        .setDescription("Displays events as though you're a normal user")
        .setRequired(false)
    ),
  async execute(interaction: CommandInteraction) {
    const all = interaction.options.getBoolean("all");
    const normal = interaction.options.getBoolean("normal");

    const events = await Event.find(all ? {} : { active: true }).exec();
    if (events.length === 0) {
      interaction.reply("There are no active events.");
      return;
    }
    const exec = isExec(interaction.member as GuildMember) && !normal;

    const eventFields = exec
      ? getExecEventFields(events)
      : getEventFields(events);

    const eventsEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`${all ? "All" : "Active"} Events`)
      .setThumbnail("https://opensourceatillinois.com/images/LightLogo.png")
      .setURL("https://opensourceatillinois.com/calendar")
      .addFields(eventFields)
      .setTimestamp();

    interaction.reply({ embeds: [eventsEmbed], ephemeral: exec });
  },
};

const getExecEventFields = (events: EventType[]) => {
  const eventFields = [];
  events.forEach((event) => {
    eventFields.push({
      name: `${event.name}`,
      value: `${event.active ? "" : "[INACTIVE]\n"}
                ${event.description}`,
      inline: true,
    });
    eventFields.push({
      name: `Points`,
      value: `${event.points} ${event.points == 1 ? "point" : "points"}`,
      inline: true,
    });
    eventFields.push({
      name: `Code`,
      value: `\`${event.code}\``,
      inline: true,
    });
    // Unfortunately, there isn't a more elegant way to add an inline break to fields.
    // https://github.com/discord/discord-api-docs/discussions/3233
    eventFields.push({ name: "\u200B", value: "\u200B" });
  });
  return eventFields;
};

const getEventFields = (events: EventType[]) => {
  const eventFields = [];
  events.forEach((event) => {
    eventFields.push({
      name: `${event.name}`,
      value: `${event.active ? "" : "[INACTIVE]\n"}
                ${event.description}`,
      inline: true,
    });
    eventFields.push({
      name: `Where`,
      value: `${event.where}`,
      inline: true,
    });
    eventFields.push({
      name: `When`,
      value: `${event.when}`,
      inline: true,
    });
    // Unfortunately, there isn't a more elegant way to add an inline break to fields.
    // https://github.com/discord/discord-api-docs/discussions/3233
    eventFields.push({ name: "\u200B", value: "\u200B" });
  });
  return eventFields;
};
