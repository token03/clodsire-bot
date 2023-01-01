const { SlashCommandBuilder } = require('discord.js');
const cheerio = require('cheerio');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const markup = await axios.get('https://play.pokemonshowdown.com/sprites/dex/');
		const $ = cheerio.load(markup.data);
		const parsedTeam = $('a').text().split('.png');
		parsedTeam.forEach(element => {
			console.log('`' + element + '`,');
		});
		console.log(parsedTeam.length);
		await interaction.reply('Pong!');
	},
};