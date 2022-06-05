import { BaseCommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';


module.exports = {
    data: new SlashCommandBuilder()
        .setName('monke')
        .setDescription('monke unite'),
    async execute(interaction: BaseCommandInteraction) {

        //function that generates random strings
        //needed for appending to monke url to avoid discord caching of image and create new monkes everytime ;)
        function makeid(length) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        const monkeBigPPEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('mOnKe')
            .setImage("https://www.placemonkeys.com/500/500?random&" + makeid(5).toString())
            .setTimestamp()
            .setFooter('Powered by www.placemonkeys.com');

        await interaction.reply({ embeds: [monkeBigPPEmbed] });

    },
};