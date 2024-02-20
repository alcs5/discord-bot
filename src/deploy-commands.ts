import { REST , Routes } from 'discord.js';
import * as path from 'path';
import * as fs from 'fs';


import { config } from 'dotenv';
config();

const commands = [];



const commandsPath = path.join(new URL('.', import.meta.url).pathname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

    if (file.endsWith('.js')) {
        const modulePath = path.join(commandsPath, file);
        const command = (await import(modulePath)).default;
        
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());

            // console.log(commands , command);

        } else {
            console.log(`[Warning] The command in ${file} is missing data or execute property`);
        };
    };
};



const rest = new REST().setToken(process.env.TOKEN);


(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data : any = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID , process.env.GUILD_ID) , { body: commands });

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);

	} catch (error) {
		console.error(error);
	};
})();