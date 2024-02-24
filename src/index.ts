import { Client , Events , GatewayIntentBits , Collection } from 'discord.js';
import { type Command } from './types/command.js';
import * as path from 'path';
import * as fs from 'fs';

import * as dotenv from 'dotenv';
dotenv.config();

const client = new Client({ intents: 
    [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
client.cooldowns = new Collection();

client.once(Events.ClientReady , (ready) => {
    console.log(`Ready! Logged in as ${ready.user.tag}`);
});



const commandsPath = path.join(new URL('.', import.meta.url).pathname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {

    if (file.endsWith('.js')) {
        const modulePath = path.join(commandsPath, file);
        const command = (await import(modulePath)).default;
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name , command);

            // console.log(command , client.commands , commandsPath , commandFiles , file);

        } else {
            console.log(`[Warning] The command in ${file} is missing data or execute property`);
        };
    };
};



client.on(Events.InteractionCreate , async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { cooldowns } = interaction.client;

    const command = interaction.client.commands.get(interaction.commandName) as Command;

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
		return;
    };



    if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
    };

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            await interaction.reply({ content: `This command is on cooldown. Please wait ${timeLeft.toFixed(1)} seconds.` , ephemeral: true });
            return;
        };
    };

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);



    try {
		await command.execute(interaction);

	} catch (error) {
		console.error(error);
	};
});


client.on(Events.MessageCreate , (message) => {
    if (!message.author.bot) {
        console.log(`${message.author.globalName} said : ${message.content}`);
    };
});


client.login(process.env.TOKEN);