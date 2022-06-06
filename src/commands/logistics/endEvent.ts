import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Event from "../../models/event";


module.exports = {
    data: new SlashCommandBuilder()
        .setName('endEvent')
        .setDescription('Ends an event by marking it as inactive')
        .addStringOption((option) => option.setName('code').setDescription('Event code').setRequired(true)),

    async execute(interaction: CommandInteraction) {
        const code = interaction.options.getString('code').trim();

        // Find an event with the given code
        const event = await Event.findOne({ code }).exec();
        if (!event) {
            interaction.reply(`Could not find an event with code ${code}`);
            return;
        }
        if (!event.active) {
            interaction.reply(`This event was already inactive.`);
            return;
        }

        event.active = false;
        await event.save();
        interaction.reply(`Event ${event.name} has been marked as inactive, and can no longer be attended.`);
    }
}