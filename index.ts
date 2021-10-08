require('dotenv').config()
// Require the necessary discord.js classes
import fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');

interface Command {
  name: String;
  aliases: String[];
  id: Number;
  executable: Function
}

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
  console.log('OSAI-Bot is Ready!');
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./src/commands').filter((file: any) => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  console.log(interaction.commandName + ' was executed');
  // Return if command doesn't exist
  if (!command) return;
  // Execute interaction
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);