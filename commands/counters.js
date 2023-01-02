const { SlashCommandBuilder } = require('discord.js');
const { countersEmbed, errorEmbed } = require('../pages/module');
const { autoCompletePokemon } = require('../utils/module');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('counters')
		.setDescription('Shows smogon sets for a given generation')
		.addStringOption(option =>
			option
				.setName('input')
				.setDescription('The input pokemon')
				.setRequired(true)
				.setAutocomplete(true))
		.addIntegerOption(option =>
			option
				.setName('gen')
				.setDescription('The chosen generation')
				.setRequired(true)),
	async autocomplete(interaction) {
		await autoCompletePokemon(interaction);
	},
	async execute(interaction) {
		const gen = interaction.options.getInteger('gen');
		const pokemon = interaction.options.getString('input');
		if (gen > 9 || gen < 1) {
			await interaction.reply(errorEmbed('Invalid Generation'));
		}
		else {
			try {
				const embed = await countersEmbed(pokemon, gen);
				await interaction.reply(embed);
			}
			catch (err) {
				await interaction.reply(errorEmbed(err));
			}
		}
	},
};