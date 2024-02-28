import { SlashCommandBuilder, EmbedBuilder, CommandInteraction, PermissionFlagsBits, PermissionsBitField , type ColorResolvable } from 'discord.js';


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
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(true),

        
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

        function embed(color : ColorResolvable , title : string) {
            const embed = new EmbedBuilder().setColor(color).setTitle(title);
            return embed;
        };
        
        try {
            await interaction.guild.members.kick(target.user.id , reason);
            await interaction.reply({ embeds: [embed(0xDD0000 , `User ${target.user.tag} has been kicked!`)] });
            await target.user.send({ embeds: [embed(0xDD0000 , `You have been kicked from the ${interaction.guild.name}`).setDescription(`Reason: ${reason}`)]});
        }
        catch (err) {
            console.log(err);
            await interaction.reply({ content: 'There was an error kicking the user' , ephemeral: true });
        };
    }
};


export default command;