import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import User from "../../models/user";
import Verification from "../../models/verification";
import { VERIFY_TOKEN_LENGTH } from "../../constants";

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

        if (token.length != VERIFY_TOKEN_LENGTH) {
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
            interaction.reply('That is not a valid token, try again. Hint: Tokens are case-sensitive and have no spaces');
            return;
        }

        const UIUC_ROLE_ID = '983068543543312444'

        await interaction.guild.members.cache
            .get(interaction.user.id)
            .roles.add(UIUC_ROLE_ID);

        user.verified = true;
        user.netid = verification.netid;
        user.save();

        Verification.deleteOne({ token }).exec();
        interaction.reply('Congratulations, You have been verified!');
    }
}