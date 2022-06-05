import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Rolls an n sided die')
        .addIntegerOption((option) => option.setName('sides').setDescription('Number of sides')),

    async execute(interaction: CommandInteraction) {
        // Get user input for number of sides
        let sides = interaction.options.getInteger('sides');
        // Dice should have 6 sides by default
        if (sides === null) {
            sides = 6;
        }
        await interaction.reply('You have rolled a ' + getRandomInt(sides));
    },
};

const getRandomInt = (max): number => {

    return Math.floor(Math.random() * max) + 1;
}