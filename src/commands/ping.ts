import { SlashCommandBuilder , EmbedBuilder , type CommandInteraction } from 'discord.js';

const command = {
    cooldown : 60,

    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('replies with pong'),

    execute: async (interaction : CommandInteraction) => {
        const ping = interaction.client.ws.ping;

        if (ping === -1) {
            await interaction.reply({ content: 'try again later' , ephemeral : true });
        };

        const embed = new EmbedBuilder()
            .setColor(0xEE0000)
            .setTitle('Pong! 🏓')
            .setDescription(`Latency ${ping}`);

        await interaction.reply({ embeds: [embed] });
    }
};

export default command;