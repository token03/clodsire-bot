const { SlashCommandBuilder } = require('discord.js');
const cheerio = require('cheerio');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('topusage')
		.setDescription('Shows most used pokemon in a given format')
		.addStringOption(option =>
			option
				.setName('format')
				.setDescription('The input format')
				.setRequired(true)
				.setAutocomplete(false)),
	async execute(interaction) {
		const format = interaction.get
		const markup = await axios.get(`https://raw.githubusercontent.com/pkmn/smogon/main/data/stats/${}.json`);
		const $ = cheerio.load(markup.data);
		const parsedTeam = $('a').text().split('.png');
		parsedTeam.forEach(element => {
			if ((element.includes('urshifu') || element.includes('galar') && !element.includes('shiny'))) console.log('`' + element + '`,');
		});
		console.log(parsedTeam.length);
		await interaction.reply('Pong!');
	},
};