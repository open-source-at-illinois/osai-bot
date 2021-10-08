import { CommandInteraction } from "discord.js";

let commands = {}

const addCommand = (command: Command) => {

}

const handleCommand = (client: any) : void  => {
    client.on('interactionCreate', async (interaction: CommandInteraction) => {
        if (!interaction.isCommand()) return;
    
        const { commandName } = interaction;
    
        if (commandName === 'ping') {
            await interaction.reply('Pong!');
        } else if (commandName === 'server') {
            await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
        } else if (commandName === 'user') {
            await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
        }
    });
}

export default  { handleCommand }