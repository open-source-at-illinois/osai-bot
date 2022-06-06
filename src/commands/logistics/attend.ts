import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import Event from "../../models/event";
import User from "../../models/user";
import { ERROR_MSG } from "../../constants";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('attend')
        .setDescription('Tracks attendance for OSAI events')
        .addStringOption((option) => option.setName('code').setDescription('Event code').setRequired(true)),

    async execute(interaction: CommandInteraction) {
        const code = interaction.options.getString('code').trim();

        // Find an event with the given code
        const event = await Event.findOne({ code });

        if (!event) {
            interaction.reply({ content: `Could not find an event with code ${code}`, ephemeral: true });
            return;
        }

        let user = await User.findOne({ discordId: interaction.user.id })
            .catch(err => {
                console.log(err);
                interaction.reply(ERROR_MSG)
            })

        if (user) {
            if (event.attendees.includes(user._id)) {
                interaction.reply({ content: 'You are already attending this event!', ephemeral: true });
                return;
            }
        } else {
            user = new User({ discordId: interaction.user.id, netid: null, verified: false });
            await user.save();
        }

        // Add the user to the event
        event.attendees.push(user._id);
        await event.save();

        user.points += event.points;
        await user.save();

        interaction.reply({ content: `Thanks for attending ${event.name}. You've earned ${event.points} point(s) and now have ${user.points} points!`, ephemeral: true });
    }
}