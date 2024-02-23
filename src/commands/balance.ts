import { SlashCommandBuilder  , EmbedBuilder , CommandInteraction } from 'discord.js';

import db from '../db/db.js';
import { bottable } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const command = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('the total amount of coins you have'),

    execute: async(interaction: CommandInteraction) => {

        const currentAmount = await db.select({ amount : bottable.amount }).from(bottable).where(eq(bottable.id , interaction.user.id));

        const embed = new EmbedBuilder()
        .setColor(0x00ee00)
        .setDescription(`you have ${currentAmount[0]?.amount || 0} coins!`);

        await interaction.reply({ embeds: [embed] });
    }
};

export default command;