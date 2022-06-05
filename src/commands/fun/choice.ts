import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('choice')
        .setDescription('Returns a random choice between 2 or more words')
        .addStringOption((option) => option.setName('words').setDescription('String of words seperated by a space')),

    async execute(interaction: CommandInteraction) {
        // Get user input for the string
        const wordsString = interaction.options.getString('words');
        // Dice should have 6 sides by default
        // if(sides === null) {
        //     sides = 6;
        // }
        const wordsSplit = wordsString.split(" ");

        await interaction.reply('The word is ' + wordsSplit[getRandomInt(wordsSplit.length)]);
    },
};

const getRandomInt = (max): number => {

    return Math.floor(Math.random() * max) + 1;
}