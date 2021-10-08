require('dotenv').config()
// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');

interface Command {
  name: String;
  aliases: String[];
  id: Number;
  executable: Function
}

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

client.commands = new Collection();

const commandFiles = fs.readdirSync('./src/commands').filter((file: any) => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  console.log(interaction.commandName + ' was executed');
  if (!command) return;

  try {
    // console.log('hmm');
    await command.execute(interaction);
    // console.log('hmm2');

  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);