import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Makes the bot say something in text')
        .addStringOption((option) => option.setName('text').setDescription('What the bot has to say')),

    async execute(interaction: CommandInteraction) {
        // Get user input for the text
        let text = interaction.options.getString('text');
        // Text should be empty by default
        if (text === null) {
            text = "";
        }
        await interaction.reply(text);
    },
};