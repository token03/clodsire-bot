const { SlashCommandBuilder } = require('discord.js');
const { countersEmbed, errorEmbed } = require('../pages/module');
const { pokemonNames } = require('../data/module');
const { capitalizeTheFirstLetterOfEachWord } = require('../utils/module');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('counters')
		.setDescription('Shows smogon sets for a given generation')
		.addStringOption(option =>
			option
				.setName('pokemon')
				.setDescription('The input pokemon')
				.setRequired(true)
				.setAutocomplete(true))
		.addIntegerOption(option =>
			option
				.setName('gen')
				.setDescription('The chosen generation')
				.setRequired(true)),
	async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);
		let choices;

		if (focusedOption.name === 'pokemon') {
			choices = pokemonNames;
		}

		let filtered = choices.filter(choice => choice.startsWith(focusedOption.value.toLowerCase()));
		filtered = filtered.slice(0, 24);
		await interaction.respond(
			filtered.map(choice => ({ name: capitalizeTheFirstLetterOfEachWord(choice), value: capitalizeTheFirstLetterOfEachWord(choice) })),
		);
	},
	async execute(interaction) {
		const gen = interaction.options.getInteger('gen');
		const pokemon = interaction.options.getString('pokemon');
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