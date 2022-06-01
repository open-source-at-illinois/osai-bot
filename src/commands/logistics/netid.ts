import { CommandInteraction } from "discord.js";
const { SlashCommandBuilder } = require('@discordjs/builders');

const ERROR_MSG = 'Could not verify at this time. Please try again later.'
const SUCCESS_MSG = 'Successfully verified!'

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

        // TODO timeout the command for each NetID to prevent spam
        // TODO add a cooldown for the command to prevent spam/abuse
        // TODO check if netid is already verified
        // TODO check if user is already verified
        
        
        var email = netid + '@illinois.edu';

        const sgMail = require('@sendgrid/mail')
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const msg = {
            to: email, // Change to your recipient
            from: 'noreply@opensourceatillinois.com', // Change to your verified sender
            subject: 'Email Verification',
            text: 'You have been authorized to use the bot. Your email is ' + email,
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        }

        sgMail
            .send(msg)
            .then((response) => {
                console.log(response[0].statusCode)
                console.log(response[0].headers)
                interaction.reply(SUCCESS_MSG)
            })
            .catch((error) => {
                console.error(error)
                interaction.reply(ERROR_MSG);
            })
    },
};
