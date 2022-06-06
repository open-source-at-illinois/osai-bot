import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import User from "../../models/user";
import Verification from "../../models/verification";
import { UIUC_ROLE_ID, VERIFY_TOKEN_LENGTH } from "../../constants";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verifies your Illinois NetID')
        .addStringOption((option) => option.setName('token').setDescription('Token received in email. case-sensitive, no spaces').setRequired(true)),

    async execute(interaction: CommandInteraction) {
        const token = interaction.options.getString('token').trim().split(' ')[0];

        if (token.length != VERIFY_TOKEN_LENGTH) {
            interaction.reply({ content: 'The given token is invalid. Usage: `/verify <token>`', ephemeral: true });
            return;
        }

        let user = await User.findOne({ discordId: interaction.user.id }).exec();
        if (!user) {
            user = new User({ discordId: interaction.user.id, netid: null, verified: false });
            await user.save();
        }

        if (user.verified) {
            interaction.reply({ content: 'You are already verified!', ephemeral: true });
            return;
        }

        const verification = await Verification.findOne({ token: token }).exec();
        if (!verification) {
            interaction.reply({ content: 'That is not a valid token, try again. Hint: Tokens are case-sensitive and have no spaces', ephemeral: true });
            return;
        }

        if (verification.tokenExpiration < Date.now()) {
            interaction.reply({ content: 'That token has expired. Get another token using `/netid <your netid>`', ephemeral: true });
            return;
        }

        if (verification.discordId !== interaction.user.id) {
            interaction.reply({ content: 'That is not a valid token, try again. Hint: Tokens are case-sensitive and have no spaces', ephemeral: true });
            return;
        }

        await interaction.guild.members.cache
            .get(interaction.user.id)
            .roles.add(UIUC_ROLE_ID);

        user.verified = true;
        user.netid = verification.netid;
        user.save();

        Verification.deleteOne({ token }).exec();
        interaction.reply({ content: 'Congratulations, You have been verified!', ephemeral: true });
    }
}