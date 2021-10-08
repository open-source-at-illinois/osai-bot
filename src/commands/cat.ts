import { BaseCommandInteraction, MessageEmbed } from "discord.js";

const { SlashCommandBuilder } = require('@discordjs/builders');

const got = require('got');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Sends a picture of a cat'),
    async execute(interaction: BaseCommandInteraction) {
        // Make an API call to thecatapi
        const response = await got('https://api.thecatapi.com/v1/images/search');

        // Parse String response into JSON
        const image = JSON.parse(response.body)[0];

        const catEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Meow')
            .setImage(image.url)
            .setTimestamp()
            .setFooter('Powered by thecatapi.com');

        await interaction.reply({embeds: [catEmbed]});
        // await interaction.reply('Meow! ' + image.url);
    },
};