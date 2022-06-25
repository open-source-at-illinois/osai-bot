import { CommandInteraction } from "discord.js";
// import cryptoRandomString from 'crypto-random-string';
import User from "../../models/user";
import Verification from "../../models/verification";
import getEmailString from "../../verification-text";
import { SlashCommandBuilder } from '@discordjs/builders';
import got from "got/dist/source";
import { VERIFY_TOKEN_EXPIRATION, VERIFY_TOKEN_LENGTH } from "../../constants";
import sgMail = require('@sendgrid/mail');

const ERROR_MSG = 'Could not verify at this time. Please try again later.'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('netid')
        .setDescription('Does NetID Authorization for the server')
        .addStringOption((option) => option.setName('netid').setDescription('String of words seperated by a space').setRequired(true)),

    async execute(interaction: CommandInteraction) {
        let netid = interaction.options.getString('netid');

        netid = netid.trim().split(' ')[0].toLocaleLowerCase();

        if (netid.length <= 1) {
            interaction.reply({ content: 'The given netID is invalid. Usage: `/netid <netid>`', ephemeral: true });
            return;
        }

        // Check if netid is already verified
        const netIDOwner = await User.findOne({ netid }).exec();
        if (netIDOwner) {
            interaction.reply({ content: 'That NetID is already verified! Changed your discord account? Contact an exec member.', ephemeral: true });
            return;
        }

        let user = await User.findOne({ discordId: interaction.user.id })
            .catch(err => {
                console.log(err);
                interaction.reply(ERROR_MSG)
            })

        if (user) {
            if (user.verified) {
                interaction.reply({ content: 'You are already verified!', ephemeral: true });
                return;
            }
        } else {
            user = new User({ discordId: interaction.user.id, verified: false });
            await user.save();
        }

        // Timeout the command for each NetID and each user to prevent spam
        const activeTokens = await Verification.find({
            $or: [
                { netid: netid, tokenExpiration: { $gt: Date.now() } },
                { discordId: interaction.user.id, tokenExpiration: { $gt: Date.now() } }]
        }).exec();

        if (activeTokens.length > 0) {
            interaction.reply({ content: 'You have already requested a verification token. Please wait 30 minutes before requesting another.', ephemeral: true });
            return;
        }

        const verification = await createVerification(netid, interaction.user.id);

        await verification.save().catch(err => {
            console.log(err);
            interaction.reply(ERROR_MSG)
        });

        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        await sgMail.send({
            to: netid + '@illinois.edu',
            from: 'noreply@opensourceatillinois.com',
            subject: 'Email Verification: Open-Source @ Illinois',
            html: getEmailString(verification.token),
        }).catch((error) => {
            console.error(error)
            interaction.reply(ERROR_MSG);
        });

        interaction.reply({ content: 'You should receive a verification code shortly. Use /verify to complete the process.', ephemeral: true });
    },
};

const createVerification = async (netid: string, discordId: string) => {
    const token = await getRandomToken();
    // Set expiration to 30 minutes from now
    const verification = new Verification({
        netid: netid,
        discordId: discordId,
        token: token,
        tokenExpiration: Date.now() + VERIFY_TOKEN_EXPIRATION,
    });
    return verification;
}

const getRandomToken = async () => {
    const response = await got.get(`https://www.random.org/strings/?num=1&len=${VERIFY_TOKEN_LENGTH}&digits=on&upperalpha=on&unique=on&format=plain&rnd=new`)
        .catch((err) => console.log(err));
    if (response) {
        return response.body.trim();
    } else {
        return Math.random().toString(36).slice(2, 2 + VERIFY_TOKEN_LENGTH);
    }
}