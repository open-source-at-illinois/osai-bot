import { CommandInteraction, ReactionUserManager } from "discord.js";
// import cryptoRandomString from 'crypto-random-string';
import User from "../../models/user";
import Verification from "../../models/verification";
import getEmailString from "../../verification-text";
const { SlashCommandBuilder } = require('@discordjs/builders');

const ERROR_MSG = 'Could not verify at this time. Please try again later.'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Does NetID Authorization for the server')
        .addStringOption((option: any) => option.setName('netid').setDescription('String of words seperated by a space')),

    async execute(interaction: CommandInteraction) {
        // Get user input for the string
        var netid = interaction.options.getString('netid')
            .trim()
            .split(' ')[0]
            .toLocaleLowerCase();

        // Check if netid is already verified
        User.findOne({ netid: netid }, (err, user) => {
            if (err) {
                interaction.reply(ERROR_MSG)
            } else if (user) {
                if (user.verified) {
                    interaction.reply('This NetID is already verified! Changed your discord account? Contact an exec member.');
                }
            }
        })

        // Timeout the command for each NetID to prevent spam
        const activeTokens = await Verification.find({ netid: netid, tokenExpiration: { $gt: Date.now() } }).exec();
        if (activeTokens.length > 0) {
            interaction.reply('You have already requested a verification token. Please wait 30 minutes before requesting another.');
            return;
        }

        // Check if user is already verified
        User.findOne({ discordId: interaction.user.id }, (err, user) => {
            if (err) {
                interaction.reply(ERROR_MSG)
            } else if (user) {
                if (user.verified) {
                    interaction.reply('You are already verified!');
                }
            }
        });

        const verification = createVerification(netid, interaction.user.id);
        verification.save((err) => {
            if (err) {
                interaction.reply(ERROR_MSG)
            } else {
                const sgMail = require('@sendgrid/mail')
                sgMail.setApiKey(process.env.SENDGRID_API_KEY)

                const msg = {
                    to: netid + '@illinois.edu',
                    from: 'noreply@opensourceatillinois.com',
                    subject: 'Email Verification',
                    html: getEmailString(verification.token),
                }
                sgMail.send(msg)
                    .then(() => {
                        interaction.reply('You should receive a verification code shortly. Use /verify to complete the process.');
                    })
                    .catch((error) => {
                        console.error(error)
                        interaction.reply(ERROR_MSG);
                    });
            }
        });
    },
};

const createVerification = (netid: string, discordId: string) => {
    // Generate a random 6 letter token
    // const token = cryptoRandomString({ length: 6, type: 'distinguishable' });
    const token = '123456';
    // Set expiration to 30 minutes from now
    const verification = new Verification({
        netid: netid,
        discordId: discordId,
        token: token,
        tokenExpiration: Date.now() + 30 * 60 * 1000
    });
    return verification;
}