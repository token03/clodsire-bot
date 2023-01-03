const { SlashCommandBuilder } = require('discord.js');
const { parsePokepaste, autoCompletePokemon } = require('../utils/module');
const { teamWeaknessEmbed, pokemonWeaknessEmbed } = require('../pages/module');
require('koffing').Koffing;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weaknesses')
		.setDescription('Shows type weaknesses for a given pokepaste/pokemon')
		.addStringOption(option =>
			option
				.setName('input')
				.setDescription('The input pokepaste/pokemon')
				.setRequired(true)
				.setAutocomplete(true)),
	async autocomplete(interaction) {
		await autoCompletePokemon(interaction);
	},
	async execute(interaction) {
		const input = interaction.options.getString('input');
		try {
			// Create a new URL object from the string
			const url = new URL(input);
			// Check if the hostname is "pokepast.es"
			if (url.hostname === 'pokepast.es');
			const pokepaste = await parsePokepaste(input);
			await interaction.reply(teamWeaknessEmbed(pokepaste.toJson()));
		}
		catch (error) {
			// If the string is not a valid URL, return false
			await interaction.reply(pokemonWeaknessEmbed(input));
		}
	},
};