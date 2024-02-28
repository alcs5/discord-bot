import { SlashCommandBuilder, EmbedBuilder, CommandInteraction, PermissionFlagsBits, PermissionsBitField } from 'discord.js';


const command = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('unmute an user')
        .addUserOption((option) => option
            .setName('target').setDescription('which user?').setRequired(true)
        )
        .addStringOption((option) => option
            .setName('reason').setDescription('what is the reason?').setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

        
    execute: async(interaction: CommandInteraction) => {
        const target = interaction.options.get('target');
        const targetUser = await interaction.guild.members.fetch(target.user.id);
        const reason = interaction.options.get('reason').value as string;

        if (!(interaction.member.permissions as Readonly<PermissionsBitField>).has(PermissionFlagsBits.MuteMembers)) {
            await interaction.reply({ content: 'You are not allowed to use this command!' , ephemeral: true });
            return;
        };

        if (!reason) {
            await interaction.reply({ content: 'No reason has been provided!' , ephemeral: true });
            return;
        };

        const embed = new EmbedBuilder()
            .setColor(0x00DD00)
            .setTitle(`User ${target.user.tag} has been unmuted`);
        
        try {
            await targetUser.timeout(null , reason);
            await interaction.reply({ embeds: [embed] });
        }
        catch (err) {
            console.log(err);
            await interaction.reply({ content: 'There was an error unmuting the user' , ephemeral: true });
        };
    }
};


export default command;