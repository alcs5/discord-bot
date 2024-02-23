import { SlashCommandBuilder , EmbedBuilder , type CommandInteraction } from 'discord.js';


import db from '../db/db.js';
import { bottable } from '../db/schema.js';

const command = {
    cooldown: 1800,

    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('gives you coins'),

    execute: async(interaction : CommandInteraction) => {
        function amount(num : number , amount : number) : number[] {
            let arrn : number[] = [];
        
            for (let i = 0; i < amount; i++) {
                arrn.push(num);
            };
        
            return arrn;
        };

        const randomAmountArr : number[] = [
            ...amount(10 , 50),
            ...amount(20 , 40),
            ...amount(30 , 30),
            ...amount(40 , 20),
            ...amount(50 , 10),
            1000
        ];

        const randomAmount : number = randomAmountArr[Math.floor(Math.random() * randomAmountArr.length)];

        const amoundEmbed = new EmbedBuilder()
            .setColor(0x11FF11)
            .setDescription(`You received ${randomAmount} coins!`);

        await interaction.reply({ embeds: [amoundEmbed] });

        await db.insert(bottable).values({ id: interaction.user.id , amount: randomAmount }).onConflictDoUpdate({ target: bottable.id , set: { amount: randomAmount } });

        const datas = await db.select().from(bottable);
        console.log(datas);
    }
};


export default command;