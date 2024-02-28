import { SlashCommandBuilder, EmbedBuilder, CommandInteraction, PermissionFlagsBits, PermissionsBitField } from 'discord.js';


const command = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('kick an user')
        .addUserOption((option) => option
            .setName('target').setDescription('which user?').setRequired(true)
        )
        .addStringOption((option) => option
            .setName('reason').setDescription('what is the reason?').setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

        
    execute: async(interaction: CommandInteraction) => {
        const target = interaction.options.get('target');
        const reason = interaction.options.get('reason').value as string;

        if (!(interaction.member.permissions as Readonly<PermissionsBitField>).has(PermissionFlagsBits.KickMembers)) {
            await interaction.reply({ content: 'You are not allowed to use this command!' , ephemeral: true });
            return;
        };

        if (!reason) {
            await interaction.reply({ content: 'No reason provided!' , ephemeral: true });
            return;
        };

        const embed = new EmbedBuilder()
            .setColor(0xDD0000)
            .setTitle(`User ${target.user.tag} has been kicked!`);
        
        try {
            await interaction.guild.members.kick(target.user.id , reason);
            await interaction.reply({ embeds: [embed] });
        }
        catch (err) {
            console.log(err);
            await interaction.reply({ content: 'There was an error banning the user' , ephemeral: true });
        };
    }
};


export default command;