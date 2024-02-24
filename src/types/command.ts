import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export type Command = {
    cooldown?: number,
    execute : (interaction : ChatInputCommandInteraction) => any;
    data: SlashCommandBuilder
};