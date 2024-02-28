import { SlashCommandBuilder, CommandInteraction } from 'discord.js';


const command = {
    data: new SlashCommandBuilder()
        .setName('id')
        .setDescription('get the id of an user')
        .addUserOption((option) => option
            .setName('target').setDescription('which user?').setRequired(true)
        ),

        
    execute: async(interaction: CommandInteraction) => {
        const target = interaction.options.get('target');
        await interaction.reply({ content: `${target.user.id}` , ephemeral: true });
    }
};


export default command;