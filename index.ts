/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const fs = require("fs");
import mongoose = require("mongoose");
const { Client, Intents, Collection } = require("discord.js");
import type { CommandInteraction } from "discord.js";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  console.log("OSAI-Bot is Ready!");
});

export const inDev = process.env.NODE_ENV === "development";

if (inDev) {
  console.log("[canary] Running in development mode");
} else {
  console.log("[sudo] Running in production mode");
}
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
  if (inDev) {
    console.log(
      `${interaction.user.username}#${interaction.user.discriminator} ran /${interaction.commandName}`
    );
  }
  await command.execute(interaction).catch(async (error) => {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  });
});

client.login(process.env.DISCORD_TOKEN);

const mongoConnectOptions: mongoose.ConnectOptions = {
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  heartbeatFrequencyMS: 10000,
};

mongoose
  .connect(process.env.MONGO_URI, mongoConnectOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
