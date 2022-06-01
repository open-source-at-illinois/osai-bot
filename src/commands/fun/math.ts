import { CommandInteraction } from "discord.js";
const { SlashCommandBuilder } = require('@discordjs/builders');

import { evaluate } from "mathjs"

const math = require('mathjs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('math')
        .setDescription('Computes operations involving +, -, *, /')
        .addStringOption((option: any) => option.setName('expression').setDescription('Expression that has to be solved')),

    async execute(interaction: CommandInteraction) {
        // Get user input for the expression
        var expression = interaction.options.getString('expression');
        console.log(expression)
        // The expression should return zero if no input is given
        if(expression === null) {
            expression = "0";
        }
        await interaction.reply("Result: " + math.evaluate(expression));
    }
};