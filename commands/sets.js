const { SlashCommandBuilder } = require('discord.js');
const { setsEmbed, errorEmbed } = require('../pages/module');
require('koffing').Koffing;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sets')
		.setDescription('Shows common counters for a given team')
		.addStringOption(option =>
			option
				.setName('pokemon')
				.setDescription('The input Pokemon')
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
					{ name: 'Rarely Used', value: 'ru' },
					{ name: 'Never Used', value: 'nu' },
					{ name: 'PU', value: 'pu' },
					{ name: 'ZU', value: 'zu' },
					{ name: 'Untiered', value: 'untiered' },
				)),
	async execute(interaction) {
		const gen = interaction.options.getInteger('gen');
		const pokemon = interaction.options.getString('pokemon');
		const format = interaction.options.getString('format');
		if (gen > 9 || gen < 1) {
			await interaction.reply(errorEmbed('Invalid Generation'));
		}
		else {
			try {
				const embed = await setsEmbed(pokemon, format, gen);
				await interaction.reply(embed);
			}
			catch (err) {
				await interaction.reply(errorEmbed(err));
			}
		}
	},
};