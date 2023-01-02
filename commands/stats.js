const { SlashCommandBuilder } = require('discord.js');
const { statsEmbed, errorEmbed } = require('../pages/module');
const { autoCompletePokemon } = require('../utils/module');
require('koffing').Koffing;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Shows usage stats for a given Pokemon')
		.addStringOption(option =>
			option
				.setName('input')
				.setDescription('The input Pokemon')
				.setRequired(true)
				.setAutocomplete(true))
		.addIntegerOption(option =>
			option
				.setName('gen')
				.setDescription('The chosen generation')
				.setRequired(false)
				.setMinValue(1)
				.setMaxValue(9)),
	async autocomplete(interaction) {
		await autoCompletePokemon(interaction);
	},
	async execute(interaction) {
		let gen = interaction.options.getInteger('gen');
		if (!gen) gen = 9;
		const pokemon = interaction.options.getString('pokemon');
		try {
			const embed = await statsEmbed(pokemon, gen);
			await interaction.reply(embed);
		}
		catch (err) {
			await interaction.reply(errorEmbed(err));
		}

	},
};
