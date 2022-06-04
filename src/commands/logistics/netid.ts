import { CommandInteraction, ReactionUserManager } from "discord.js";
// import cryptoRandomString from 'crypto-random-string';
import User from "../../models/user";
import Verification from "../../models/verification";
import getEmailString from "../../verification-text";
import { SlashCommandBuilder } from '@discordjs/builders';
import got from "got/dist/source";

const ERROR_MSG = 'Could not verify at this time. Please try again later.'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('netid')
        .setDescription('Does NetID Authorization for the server')
        .addStringOption((option: any) => option.setName('netid').setDescription('String of words seperated by a space')),

    async execute(interaction: CommandInteraction) {
        let netid = interaction.options.getString('netid');

        if (!netid) {
            interaction.reply('Usage: `/netid <netid>`');
            return;
        }

        netid = netid.trim().split(' ')[0].toLocaleLowerCase();

        if (netid.length <= 1) {
            interaction.reply('The given netID is invalid. Usage: `/netid <netid>`');
            return;
        }

        // Check if netid is already verified
        let user = User.findOne({ netid: netid }).catch(err => {
            console.log(err);
            interaction.reply(ERROR_MSG)
        })
        if (user) {
            if (user.verified) {
                interaction.reply('You are already verified!');
                return;
            }
        } else {
            user = new User({ discordId: interaction.user.id, netid: null, verified: false });
            await user.save();
        }

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

        const verification = await createVerification(netid, interaction.user.id);

        await verification.save().catch(err => {
            console.log(err);
            interaction.reply(ERROR_MSG)
        });

        const sgMail = require('@sendgrid/mail')
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

        interaction.reply('You should receive a verification code shortly. Use /verify to complete the process.');
    },
};

const createVerification = async (netid: string, discordId: string) => {
    const token = await getRandomToken();
    // Set expiration to 30 minutes from now
    const verification = new Verification({
        netid: netid,
        discordId: discordId,
        token: token,
        tokenExpiration: Date.now() + 30 * 60 * 1000
    });
    return verification;
}

const getRandomToken = async () => {
    const response = await got.get('https://www.random.org/strings/?num=1&len=5&digits=on&upperalpha=on&unique=on&format=plain&rnd=new')
        .catch((err: any) => console.log(err));
    if (response) {
        return response.body.trim();
    } else {
        return Math.random().toString(36).slice(2, 7);
    }
}