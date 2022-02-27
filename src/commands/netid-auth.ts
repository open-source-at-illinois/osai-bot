import { CommandInteraction } from "discord.js";
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('authorize')
        .setDescription('Does NetID Authorization for the server')
        .addStringOption((option: any) => option.setName('netid').setDescription('String of words seperated by a space')),

    async execute(interaction: CommandInteraction) {
        // Get user input for the string
        var netid = interaction.options.getString('netid').trim();
        var email = netid + '@illinois.edu';
        
        // Sending the email
        const sgMail = require('@sendgrid/mail')
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const msg = {
        to: email, // Change to your recipient
        from: 'noreply@opensourceatillinois.com', // Change to your verified sender
        subject: 'Email Verification',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        }

        sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
    },
};
