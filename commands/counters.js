const { SlashCommandBuilder } = require('discord.js');
const { countersEmbed, errorEmbed } = require('../pages/module');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('counters')
		.setDescription('Shows smogon sets for a given generation and format')
		.addStringOption(option =>
			option
				.setName('pokemon')
				.setDescription('The input pokemon')
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
					{ name: 'Zever Used', value: 'zu' },
					{ name: 'Pungently Used', value: 'pu' },
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
				const embed = await countersEmbed(pokemon, format, gen);
				await interaction.reply(embed);
			}
			catch (err) {
				await interaction.reply(errorEmbed(err));
			}
		}
	},
};