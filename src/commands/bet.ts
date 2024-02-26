import { SlashCommandBuilder , EmbedBuilder , type CommandInteraction, ColorResolvable } from 'discord.js';

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

        if (rightAmount === 0) {
            await interaction.reply({ embeds: [embed(0xFF1111 , 'You have 0 coins!' , 'Use the command /give to give you some coins')] });
            return;
        };


        async function updateAmount(value : number) {
            await db.insert(bottable).values({ id: interaction.user.id , amount: rightAmount + value < 0 ? 0 : rightAmount + value }).onConflictDoUpdate({ target: bottable.id , set: { amount: rightAmount + value < 0 ? 0 : rightAmount + value }});
        };

        function embed(color : ColorResolvable , title : string , description : string) : EmbedBuilder {
            const embed = new EmbedBuilder().setColor(color).setTitle(title).setDescription(description);
            return embed;
        };


        //0-9 range
        const bigArr : number[] = [];

        for (let i = 1; i <= 9; i++) {
            bigArr.push(i);
        };

        const randomBig = bigArr[Math.floor(Math.random() * bigArr.length)];

        if (chance === 'big') {

            if (rightAmount < 30) {
                await interaction.reply({ embeds: [embed(0xFF1111 , 'You dont have enough coins to bet!' , 'Use the give command to get some')] });
                return;
            };

            if (randomBig === betNumber) {
                await interaction.reply({ embeds: [embed(0x00EE00 , `You guessed the number ${randomBig} right!` , 'You won 30 coins!')] });
                await updateAmount(+30);
            }
            else {
                await interaction.reply({ embeds: [embed(0xEE0000 , `You guessed wrong! the number was ${randomBig}` , 'You lost 30 coins!')] });
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

            if (rightAmount < 60) {
                await interaction.reply({ embeds: [embed(0xFF1111 , 'You dont have enough coins to bet!' , 'Use the give command to get some')] });
                return;
            };

            if (randomSmall === betNumber) {

                await interaction.reply({ embeds: [embed(0x00EE00 , `You guessed the number ${randomSmall} right!` , 'You won 60 coins!')] });
                await updateAmount(+60);
            } 
            else {
                await interaction.reply({ embeds: [embed(0xEE0000 , `You guessed wrong! the number was ${randomSmall}` , 'You lost 60 coins!')] });
                await updateAmount(-60);
            };
        };



        await interaction.reply({ content: 'you should provide a bet chance!' , ephemeral: true });
    }
};

export default command;