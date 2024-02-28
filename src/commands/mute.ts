import { SlashCommandBuilder, EmbedBuilder, CommandInteraction, PermissionFlagsBits, PermissionsBitField } from 'discord.js';


const command = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('mute an user')
        .addUserOption((option) => option
            .setName('target').setDescription('which user?').setRequired(true)
        )
        .addIntegerOption((option) => option
            .setName('time').setDescription('the timeout in minutes').setRequired(true)
        )
        .addStringOption((option) => option
            .setName('reason').setDescription('what is the reason?').setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

        
    execute: async(interaction: CommandInteraction) => {
        const target = interaction.options.get('target');
        const targetUser = await interaction.guild.members.fetch(target.user.id);
        const time = interaction.options.get('time').value as number;
        const reason = interaction.options.get('reason').value as string;

        if (!(interaction.member.permissions as Readonly<PermissionsBitField>).has(PermissionFlagsBits.MuteMembers)) {
            await interaction.reply({ content: 'You are not allowed to use this command!' , ephemeral: true });
            return;
        };

        if (!reason) {
            await interaction.reply({ content: 'No reason has been provided!' , ephemeral: true });
            return;
        };

        if (interaction.user.id === target.user.id) {
            await interaction.reply({ content: 'You cannot mute yourself!' , ephemeral: true });
            return;
        };

        const embed = new EmbedBuilder()
            .setColor(0xDD0000)
            .setTitle(`User ${target.user.tag} has been muted!`);
        
        try {
            await targetUser.timeout(time * 60000, reason);
            await interaction.reply({ embeds: [embed] });
        }
        catch (err) {
            console.log(err);
            await interaction.reply({ content: 'There was an error muting the user' , ephemeral: true });
        };
    }
};


export default command;