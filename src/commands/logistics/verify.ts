import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import User from "../../models/user";
import Verification from "../../models/verification";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verifies your Illinois NetID')
        .addStringOption((option: any) => option.setName('token').setDescription('Token received in email. case-sensitive, no spaces')),

    async execute(interaction: CommandInteraction) {
        var token = interaction.options.getString('token')
        if (!token) {
            interaction.reply('Usage: `/verify <token>`');
            return;
        }

        token = token.trim().split(' ')[0];

        if (token.length != 5) {
            interaction.reply('The given token is invalid. Usage: `/verify <token>`');
            return;
        }

        let user = await User.findOne({ discordId: interaction.user.id }).exec();
        if (!user) {
            user = new User({ discordId: interaction.user.id, netid: null, verified: false });
            await user.save();
        }

        if (user.verified) {
            interaction.reply('You are already verified!');
            return;
        }

        const verification = await Verification.findOne({ token: token }).exec();
        if (!verification) {
            interaction.reply('That is not a valid token, try again. Hint: Tokens are case-sensitive and have no spaces');
            return;
        }

        if (verification.tokenExpiration < Date.now()) {
            interaction.reply('That token has expired. Get another token using `/netid <your netid>`');
            return;
        }

        if (verification.discordId !== interaction.user.id) {
            interaction.reply('That token is not for you, try again.');
            return;
        }

        user.verified = true;
        user.netid = verification.netid;
        user.save();

        Verification.remove({ token }).exec();

        interaction.reply('Congratulations, You have been verified!');
    }
}