const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const Table = require('easy-table');

const topEmbed = async (format) => {
	const pokemonArray = await fetchMostUsed(format);

	console.log(pokemonArray);
	const embed = new EmbedBuilder()
		.setTitle('Top Usage Stats for ' + format)
		.setDescription('```' + formatMostUsed(pokemonArray) + '```');

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
		pokemonArray.push({ name: Object.keys(data.pokemon)[i], usage: Object.values(data.pokemon)[i]['usage'] });
	}
	console.log(pokemonArray);
	return pokemonArray;
}

const formatMostUsed = (data) => {
	const t = new Table;
	for (let i = 0; i < data.length; i++) {
		t.cell('Rank', i + 1);
		t.cell('Pokemon', data[i].name);
		t.cell('Raw', (data[i].usage.raw * 100).toFixed(2) + '%');
		t.cell('Real', (data[i].usage.real * 100).toFixed(2) + '%');
		t.cell('Weighted', (data[i].usage.weighted * 100).toFixed(2) + '%');
		t.newRow();
	}

	return t.toString();
};

module.exports = { topEmbed };
