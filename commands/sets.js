const { SlashCommandBuilder } = require('discord.js');
const { setsEmbed, errorEmbed } = require('../pages/module');
const { autoCompletePokemon, cleanPokemonName } = require('../utils/module');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sets')
		.setDescription('Shows suggested sets for a given Pokemon')
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
		const pokemon = cleanPokemonName(interaction.options.getString('input'));
		try {
			const embed = await setsEmbed(pokemon, gen);
			await interaction.reply(embed);
		}
		catch (err) {
			await interaction.reply(errorEmbed(err));
		}

	},
};
