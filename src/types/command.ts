import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export type Command = {
    execute : (interaction : ChatInputCommandInteraction) => any;
    data: SlashCommandBuilder
};