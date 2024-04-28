import { SlashCommandBuilder, EmbedBuilder, CommandInteraction, PermissionFlagsBits, PermissionsBitField, ColorResolvable } from 'discord.js';


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
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(true),

        
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

        function embed(color : ColorResolvable , title : string) {
            const embed = new EmbedBuilder().setColor(color).setTitle(title);
            return embed;
        };
        
        try {
            await interaction.guild.bans.remove(target.user.id , reason);
            await interaction.reply({ embeds: [embed(0xDD0000 , `User ${target.user.tag} has been unbanned!`)] });
            await target.user.send({ embeds: [embed(0xDD0000 , `You have been unbanned from ${interaction.guild.name}!`)] });
        }
        catch (err) {
            console.log(err.message);
            await interaction.reply({ content: 'There was an error unbanning the user' , ephemeral: true });
        };

        console.log(interaction.guild.bans);
    }
};


export default command;