import { BaseCommandInteraction, MessageEmbed } from "discord.js";

const { SlashCommandBuilder } = require('@discordjs/builders');

const got = require('got');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Sends a joke'),
    async execute(interaction: BaseCommandInteraction) {
        // Make an API call to the joke api
        const response = await got('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit');

        // Parse String response into JSON
        const setup = JSON.parse(response.body).setup;
        const delivery = JSON.parse(response.body).delivery;

        await interaction.reply(setup + "\n" + delivery);
    },
};