const { SlashCommandBuilder } = require('discord.js');
const { parsePokepaste } = require('../utils/module');
const { weaknessEmbed } = require('../pages/module');
require('koffing').Koffing;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weaknesses')
		.setDescription('Shows type weaknesses for a given Pokepaste')
		.addStringOption(option =>
			option
				.setName('input')
				.setDescription('The input Pokepaste')
				.setRequired(true)),
	async execute(interaction) {
		const parsedTeam = await parsePokepaste(interaction.options.getString('input'));
		console.log(parsedTeam.toShowdown());
		await interaction.reply(weaknessEmbed(parsedTeam.toJson()));
	},
};