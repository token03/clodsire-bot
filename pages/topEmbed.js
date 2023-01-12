const { EmbedBuilder } = require('discord.js');
const { fetchTypeHex } = require('../utils/module');
const { emojiString } = require('../data/module');
const axios = require('axios');

const topEmbed = async (format) => {
	const pokemonArray = await fetchMostUsed(format);

	console.log(pokemonArray);
	const embed = new EmbedBuilder()
		.setTitle('Top Usage Stats for ' + format)
		.setDescription('```' + JSON.stringify(pokemonArray) + '```');

	return {
		embeds: [embed],
		ephemeral: false,
	};
};

async function fetchMostUsed(format) {
	const $ = await axios.get(`https://pkmn.github.io/smogon/data/stats/${format}.json`);
	const data = $.data;
	const pokemonArray = [];

	for (let i = 0; i < 30; i++) {
		pokemonArray.push(Object.entries(data.pokemon)[i]);
	}
	return pokemonArray;
}

const pokemonEmbedValue = (pokemon) => {

};

module.exports = { topEmbed };
