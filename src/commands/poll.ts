import { SlashCommandBuilder , EmbedBuilder , CommandInteraction, MessageReaction } from 'discord.js';

const command = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('creates a poll')

        .addStringOption((option) => 
            option.setName('question').setDescription('the question for the poll').setRequired(true)
        )
        .addStringOption((option) => 
            option.setName('option1').setDescription('option no 1').setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('option2').setDescription('option no 2').setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('option3').setDescription('option no 3')
        )
        .addStringOption((option) =>
            option.setName('option4').setDescription('option no 4')
        )
        .addStringOption((option) =>
            option.setName('option5').setDescription('option no 5')
        )
        .addStringOption((option) =>
            option.setName('option6').setDescription('option no 6')
        )
        .addStringOption((option) =>
            option.setName('option7').setDescription('option no 7')
        )
        .addStringOption((option) =>
            option.setName('option8').setDescription('option no 8')
        )
        .addStringOption((option) =>
            option.setName('option9').setDescription('option no 9')
        )
        .addStringOption((option) =>
            option.setName('option10').setDescription('option no 10')
        ),


    execute: async(interaction: CommandInteraction) => {

        const question = interaction.options.get('question').value as string;
        const option1 = interaction.options.get('option1').value as string;
        const option2 = interaction.options.get('option2').value as string;



        function optFields() {
            const emojiArr = [':three:' , ':four:' , ':five:' , ':six:' , ':seven:' , ':eight:' , ':nine:' , ':keycap_ten:'];


            const fields = [
                { name: ' ' , value: `:one:  ${option1}` },
                { name: ' ' , value: `:two:  ${option2}` }
            ];


            for (let i = 0; i < emojiArr.length; i++) {
                const opts = interaction.options.get(`option${i + 3}`);

                if (opts && opts.value) {
                    fields.push({ name: ' ', value: `${emojiArr[i]} ${opts.value}` });
                }

                else { break };
            };

            return fields;
        };



        const embed = new EmbedBuilder()
            .setColor(0xE43f79)
            .setTitle(`${question}`)
            .setTimestamp()
            .addFields(optFields())
            .setFooter({ text: `Made by ${interaction.user.username}` });


        await interaction.reply({ content: 'The poll have been created' , ephemeral: true });

        const poll = await interaction.followUp({ embeds: [embed], fetchReply: true });

        async function replyWithEmojis() {

            const emojiArr = ['3️⃣' , '4️⃣' , '5️⃣' , '6️⃣' , '7️⃣' , '8️⃣' , '9️⃣' , '🔟'];
            const reactArr : Promise<MessageReaction>[] = [poll.react('1️⃣'), poll.react('2️⃣')];


            for (let i = 0; i < emojiArr.length; i++) {
                const opts = interaction.options.get(`option${i + 3}`);

                if (opts && opts.value) {
                    reactArr.push(poll.react(`${emojiArr[i]}`));
                }

                else { break };
            };


            return reactArr;
        };

        (await replyWithEmojis()).reduce((ac , cu) => ac.then(() => cu.then())).catch((err) => console.log(err));
    }
};

export default command;