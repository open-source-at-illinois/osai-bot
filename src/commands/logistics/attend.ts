import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import User from "../../models/user";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('attend')
        .setDescription('Tracks attendance for OSAI events')
        .addStringOption((option: any) => option.setName('code').setDescription('Event code')),

    async execute(interaction: CommandInteraction) {
        const code = interaction.options.getString('code');
        if (!code) {
            interaction.reply('Usage: `/attend <code>`');
            return;
        }
    }
}