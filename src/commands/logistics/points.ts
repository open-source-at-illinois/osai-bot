import { CommandInteraction } from "discord.js";
// import cryptoRandomString from 'crypto-random-string';
import { SlashCommandBuilder } from "@discordjs/builders";
import User from "../../models/user";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("points")
    .setDescription("Returns the number of points you have"),

  async execute(interaction: CommandInteraction) {
    let user = await User.findOne({ discordId: interaction.user.id }).catch(
      (err) => {
        console.log(err);
        interaction.reply("Something went wrong!");
      }
    );

    if (!user) {
      user = new User({ discordId: interaction.user.id, verified: false });
      await user.save();
    }

    interaction.reply({
      content: `You have ${user.points} ${
        user.points == 1 ? "point" : "points"
      }!`,
      ephemeral: true,
    });
  },
};
