import { CommandInteraction, GuildMember } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { isExec } from "../../utils";
import { NOT_AUTHORIZED_MESSAGE } from "../../constants";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Makes the bot say something in text")
    .addStringOption((option) =>
      option.setName("text").setDescription("What the bot has to say")
    ),

  async execute(interaction: CommandInteraction) {
    // Get user input for the text
    let text = interaction.options.getString("text");
    // Text should be empty by default
    if (text === null) {
      text = "";
    }
    if (!isExec(interaction.member as GuildMember)) {
      interaction.reply(NOT_AUTHORIZED_MESSAGE);
      return;
    }
    await interaction.channel.send(text);
    interaction.reply({ content: "Spoken!", ephemeral: true });
  },
};
