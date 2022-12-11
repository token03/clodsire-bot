const { SlashCommandBuilder } = require('discord.js');
const { parsePokepaste } = require('../utils/module');
const { countersEmbed } = require('../pages/module');
require('koffing').Koffing;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('counters')
		.setDescription('Shows common counters for a given team')
		.addStringOption(option =>
			option
				.setName('input')
				.setDescription('The input Pokepaste')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('gen')
				.setDescription('The chosen generation')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('format')
				.setDescription('The chosen format')
				.setRequired(true)
				.addChoices(
					{ name: 'Ubers', value: 'ubers' },
					{ name: 'Overused', value: 'ou' },
					{ name: 'Underused', value: 'uu' },
					{ name: 'Rarely Used', value: 'ru' })),
	async execute(interaction) {
		const parsedTeam = await parsePokepaste(interaction.options.getString('input'));
		console.log(parsedTeam.toShowdown());
		await interaction.reply(countersEmbed(parsedTeam.toJson()));
	},
};