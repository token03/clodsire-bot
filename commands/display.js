const { SlashCommandBuilder } = require('discord.js');
const { parsePokepaste } = require('../utils/parsePokepaste');
require('koffing').Koffing;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('display')
		.setDescription('Displays a given Pokepaste.')
		.addStringOption(option =>
			option
				.setName('input')
				.setDescription('The input Pokepaste')
				.setRequired(true)),
	async execute(interaction) {
		const parsedTeam = await parsePokepaste(interaction.options.getString('input'));
		console.log(parsedTeam.toJson());
		await interaction.reply('```' + parsedTeam.toShowdown() + '```');
	},
};