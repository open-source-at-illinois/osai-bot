import { BaseCommandInteraction } from "discord.js";

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction: BaseCommandInteraction) {
		await interaction.reply('Pong!');
	},
};