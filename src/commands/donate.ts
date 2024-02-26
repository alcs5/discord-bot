import { SlashCommandBuilder  , type CommandInteraction } from 'discord.js';

import db from '../db/db.js';
import { bottable } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const command = {
    data: new SlashCommandBuilder()
        .setName('donate')
        .setDescription('give an amount of coins to someone else')
        .addIntegerOption((option) => option
            .setName('amount').setDescription('how much do you give?').setRequired(true)
        )
        .addUserOption((option) => option
            .setName('target').setDescription('who you donate to?').setRequired(true)
        ),

    execute : async(interaction : CommandInteraction) => {
        const amountGiven = +interaction.options.get('amount').value as number;
        const userTarget = interaction.options.get('target').user;

        const currentAmount = await db.select({ amount: bottable.amount }).from(bottable).where(eq(bottable.id , interaction.user.id));
        const rightAmount = currentAmount?.[0]?.amount || 0;


        if (userTarget.id === interaction.user.id) {
            await interaction.reply('You cannot give coins to yourself!');
            return;
        };
        
        if (rightAmount < amountGiven || rightAmount === 0) {
            await interaction.reply('You do not have enough coins to donate!');
            return;
        };

        const targetUserAmounts = await db.select({ amount : bottable.amount }).from(bottable).where(eq(bottable.id , userTarget.id));
        const targetUserAmount = targetUserAmounts?.[0]?.amount || 0;


        await db.insert(bottable).values({ id : interaction.user.id , amount: rightAmount - amountGiven }).onConflictDoUpdate({ target : bottable.id , set : { amount: rightAmount - amountGiven }});

        await db.insert(bottable).values({ id : userTarget.id , amount: amountGiven }).onConflictDoUpdate({ target: bottable.id  , set : { amount : targetUserAmount + amountGiven } });



        await interaction.reply(`You give ${amountGiven} coins to ${userTarget.username}!`);
    }
};

export default command;