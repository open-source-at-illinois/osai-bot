
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import Event from "../../models/event";
import { isExec } from "../../utils";

// command to list all active events
module.exports = {
    data: new SlashCommandBuilder()
        .setName('events')
        .setDescription('Lists all active events')
        .addBooleanOption((option) => option.setName('all').setDescription('Shows all events').setRequired(false)),

    async execute(interaction: CommandInteraction) {
        const all = interaction.options.getBoolean('all');

        const events = await Event.find(all ? {} : { active: true }).exec();
        if (events.length === 0) {
            interaction.reply('There are no active events.');
            return;
        }

        if (isExec(interaction.member as GuildMember)) {
            const eventsEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Active Events')
                .setThumbnail('https://opensourceatillinois.com/images/LightLogo.png')
                .setURL('https://opensourceatillinois.com/calendar')
                .addFields(
                    events.map(event => ({ name: `${event.name} | ${event.points} points | Code ${event.code}`, value: `${event.active ? '' : '[INACTIVE]'} ${event.description}` })),
                )
                .setTimestamp();
            interaction.reply({ embeds: [eventsEmbed], ephemeral: true });
        } else {
            const eventsEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Active Events')
                .setThumbnail('https://opensourceatillinois.com/images/LightLogo.png')
                .setURL('https://opensourceatillinois.com/calendar')
                .addFields(
                    events.map(event => ({ name: `${event.name} | ${event.points} points`, value: event.description })),
                )
                .setTimestamp();

            interaction.reply({ embeds: [eventsEmbed] });
        }
    }
}