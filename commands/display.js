const { SlashCommandBuilder } = require('discord.js');
const { parsePokepaste } = require('../utils/module');
const { displayEmbed } = require('../pages/module');
require('koffing').Koffing;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('display')
		.setDescription('Displays a given Pokepaste.')
		.addStringOption(option =>
			option
				.setName('input')
				.setDescription('The input Pokepaste')
				.setRequired(true)),
	async execute(interaction) {
		const parsedTeam = await parsePokepaste(interaction.options.getString('input'));
		await interaction.reply(displayEmbed(parsedTeam.toJson()));
	},
};