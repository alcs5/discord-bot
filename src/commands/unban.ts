import { SlashCommandBuilder, EmbedBuilder, CommandInteraction, PermissionFlagsBits, PermissionsBitField } from 'discord.js';


const command = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('unban an user')
        .addUserOption((option) => option
            .setName('target').setDescription('which user?').setRequired(true)
        )
        .addStringOption((option) => option
            .setName('reason').setDescription('what is the reason?').setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

        
    execute: async(interaction: CommandInteraction) => {
        const target = interaction.options.get('target');
        const reason = interaction.options.get('reason').value as string;

        if (!(interaction.member.permissions as Readonly<PermissionsBitField>).has(PermissionFlagsBits.BanMembers)) {
            await interaction.reply({ content: 'You are not allowed to use this command!' , ephemeral: true });
            return;
        };

        if (!reason) {
            await interaction.reply({ content: 'No reason provided!' , ephemeral: true });
            return;
        };

        const embed = new EmbedBuilder()
            .setColor(0x00DD00)
            .setTitle(`User ${target.user.tag} has been banned!`);
        
        try {
            await interaction.guild.bans.remove(target.user.id , reason);
            await interaction.reply({ embeds: [embed] });
        }
        catch (err) {
            console.log(err.message);
            await interaction.reply({ content: 'There was an error banning the user' , ephemeral: true });
        };

        console.log(interaction.guild.bans);
    }
};


export default command;