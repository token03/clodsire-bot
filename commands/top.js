const { SlashCommandBuilder } = require('discord.js');
const { topEmbed, errorEmbed } = require('../pages/module');
const { autoCompleteFormat, cleanFormat } = require('../utils/module');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('top')
		.setDescription('Shows most used pokemon in a given format')
		.addStringOption(option =>
			option
				.setName('format')
				.setDescription('The desired format')
				.setRequired(true)
				.setAutocomplete(true)),
	async autocomplete(interaction) {
		await autoCompleteFormat(interaction);
	},
	async execute(interaction) {
		const format = interaction.options.getString('format');
		try {
			const embed = await topEmbed(cleanFormat(format));
			await interaction.reply(embed);
		}
		catch (err) {
			await interaction.reply(errorEmbed(err));
		}
	},
};