/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");
const { Client, Intents, Collection } = require("discord.js");
import type { CommandInteraction } from "discord.js";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  console.log("OSAI-Bot is Ready!");
});

client.commands = new Collection();

// TODO recursively get all directories in the commands folder
const commandDirs = ["fun", "logistics", "util"];

for (const dir of commandDirs) {
  const commandFiles = fs
    .readdirSync(`./src/commands/${dir}`)
    .filter((file: string) => file.endsWith(".ts") || file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./src/commands/${dir}/${file}`);
    client.commands.set(command.data.name, command);
  }
}

client.on("interactionCreate", async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  await command.execute(interaction).catch(async (error) => {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  });
});

client.login(process.env.DISCORD_TOKEN);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
