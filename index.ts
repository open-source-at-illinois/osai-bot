require('dotenv').config()
// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');

// const commands = [{
//   name: 'ping',
//   description: 'Replies with Pong!'
// }]; 

// const rest = new REST({ version: '9' }).setToken('token');

// (async () => {
//   try {
//     console.log('Started refreshing application (/) commands.');

//     await rest.put(
//       Routes.applicationGuildCommands(process.env.APP_ID, process.env.OSAI_GUILD),
//       { body: commands },
//     );

//     console.log('Successfully reloaded application (/) commands.');
//   } catch (error) {
//     console.error(error);
//   }
// })();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
});


// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);