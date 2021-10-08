require('dotenv').config();
import fs = require('fs');
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.APP_ID, process.env.OSAI_GUILD), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);