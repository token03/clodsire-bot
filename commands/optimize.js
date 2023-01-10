const { SlashCommandBuilder } = require('discord.js');
const { parsePokepaste } = require('../utils/module');
const { optimizeEmbed } = require('../pages/module');
require('koffing').Koffing;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('optimize')
		.setDescription('Suggests improvements to a given Pokepaste')
		.addStringOption(option =>
			option
				.setName('input')
				.setDescription('The input Pokepaste')
				.setRequired(true)),
	async execute(interaction) {
		const parsedTeam = await parsePokepaste(interaction.options.getString('input'));
		await interaction.reply(optimizeEmbed(parsedTeam.toJson()));
	},
};