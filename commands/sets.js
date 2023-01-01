const { SlashCommandBuilder } = require('discord.js');
const { setsEmbed, errorEmbed } = require('../pages/module');
require('koffing').Koffing;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sets')
		.setDescription('Shows suggested sets for a given Pokemon')
		.addStringOption(option =>
			option
				.setName('pokemon')
				.setDescription('The input Pokemon')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('gen')
				.setDescription('The chosen generation')
				.setRequired(true)),
	async execute(interaction) {
		const gen = interaction.options.getInteger('gen');
		const pokemon = interaction.options.getString('pokemon');
		if (gen > 9 || gen < 1) {
			await interaction.reply(errorEmbed('Invalid Generation'));
		}
		else {
			try {
				const embed = await setsEmbed(pokemon, gen);
				await interaction.reply(embed);
			}
			catch (err) {
				await interaction.reply(errorEmbed(err));
			}
		}
	},
};