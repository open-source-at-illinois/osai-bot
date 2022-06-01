import { CommandInteraction } from "discord.js";

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Gets basic Server information'),
	async execute(interaction: CommandInteraction) {
		const guild = interaction.guild;
		await interaction.reply(`Server Name: ${guild.name} \nCurrently has ${guild.memberCount} members`);
	},
};