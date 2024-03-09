import { SlashCommandBuilder , EmbedBuilder , CommandInteraction } from 'discord.js';


const command = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('generate a random number')
        .addIntegerOption((option) => 
            option
                .setName('min').setDescription('the minimum number to generate from').setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName('max').setDescription('the maximum number to genereate from').setRequired(true)
        ),

        execute: async (interaction : CommandInteraction) => {
            const min = +interaction.options.get('min').value;
            const max = +interaction.options.get('max').value;

            if (min > max) {
                await interaction.reply('The minimun value cannot be bigger than the max one!');
                return;
            };

            const embed = new EmbedBuilder().setColor(0x0000aa).setTitle(`Your number is ${Math.floor(Math.random() * (max - min) + 1) + min}`);

            await interaction.reply({ embeds: [embed] });
        }
};


export default command;