import { BaseCommandInteraction, MessageEmbed } from "discord.js";

const { SlashCommandBuilder } = require('@discordjs/builders');

const got = require('got');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('monke')
        .setDescription('monke unite'),
    async execute(interaction: BaseCommandInteraction) {
   
        //function that generates random strings
        //needed for appending to monke url to avoid discord caching of image and create new monkes everytime ;)
        function makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
        }
        return result;
        }

        const monkeBigPPEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Meow')
            .setImage("https://www.placemonkeys.com/500/500?random&" + makeid(5).toString())
            .setTimestamp()
            .setFooter('Powered by thecatapi.com');

        await interaction.reply({embeds: [monkeBigPPEmbed]});

    },
};