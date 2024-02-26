import { SlashCommandBuilder , EmbedBuilder , type CommandInteraction } from 'discord.js';

import db from '../db/db.js';
import { bottable } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const command = {
    // cooldown: 30,

    data: new SlashCommandBuilder()
        .setName('bet')
        .setDescription('bet on a sum of coins, if you guess the randomnly generated number, you win!')

        .addStringOption((option) =>
            option.setName('betchance').setDescription('what do you want your chance to be?').addChoices(
                { name : 'big_chance' , value: 'big' },
                { name: 'small_chance' , value: 'small' }
            ).setRequired(true))

        .addIntegerOption((option) =>
            option.setName('number').setDescription('on what number do you bet on? big_chance: 1-9, small_chance: 10-99').setRequired(true)
        ),


    execute: async(interaction: CommandInteraction) => {
        const chance = interaction.options.get('betchance').value as string;
        const betNumber = +interaction.options.get('number').value as number;


        const currentAmount = await db.select({ amount: bottable.amount }).from(bottable).where(eq(bottable.id , interaction.user.id));
        const rightAmount = currentAmount?.[0]?.amount || 0;


        async function updateAmount(value : number) {
            await db.insert(bottable).values({ id: interaction.user.id , amount: rightAmount + value < 0 ? 0 : rightAmount + value }).onConflictDoUpdate({ target: bottable.id , set: { amount: rightAmount + value < 0 ? 0 : rightAmount + value }});
        };


        //0-9 range
        const bigArr : number[] = [];

        for (let i = 1; i <= 9; i++) {
            bigArr.push(i);
        };

        const randomBig = bigArr[Math.floor(Math.random() * bigArr.length)];

        if (chance === 'big') {

            if (randomBig === betNumber) {
                await interaction.reply(`you guessed the number ${randomBig} right!`);
                await updateAmount(+30);
            }
            else {
                await interaction.reply(`you didnt guessed right! , the number was ${randomBig}`);
                await updateAmount(-30);
            };
        };


        //10-99 range
        const smallArr : number[] = [];

        for (let i = 10; i <= 99; i++) {
            smallArr.push(i);
        };

        const randomSmall = smallArr[Math.floor(Math.random() * smallArr.length)];

        if (chance === 'small') {

            if (randomSmall === betNumber) {
                await interaction.reply(`you guessed the number ${randomSmall} right!`);
                await updateAmount(+60);
            } 
            else {
                await interaction.reply(`you didnt guessed right! , the number was ${randomSmall}`);
                await updateAmount(-60);
            };
        };



        await interaction.reply({ content: 'you should provide a bet chance!' , ephemeral: true });
    }
};

export default command;