const { EmbedBuilder } = require('discord.js');
const { StringHelper, fetchPokemonSprite } = require('../utils/module');
const { Dex } = require('@pkmn/dex');
const { Generations } = require ('@pkmn/data');
const { Smogon } = require ('@pkmn/smogon');
const fetch = require('cross-fetch');

const statsEmbed = async (pokemon, gen) => {
	pokemon = StringHelper.cleanPokemonName(pokemon);
	const stats = await fetchStats(pokemon, gen);
	const embed = new EmbedBuilder()
		.setTitle('Usage Stats for ' + pokemon + ' in ' + stats.genFormat)
		.setThumbnail(fetchPokemonSprite(pokemon.toLowerCase(), 'gen5ani'));

	function createField(fieldName, data) {
		let field = '```';
		let count = 0;
		for (const item in data) {
			if (count < 10) {
				field += `${item}: ${Math.round(data[item] * 100)}%\n`;
				count++;
			}
		}
		field += '```';
		embed.addFields({ name: fieldName, value: field, inline: true });
	}

	createField('Items', stats.data['items']);
	createField('Teammates', stats.data['teammates']);
	createField('Moves', stats.data['moves']);

	return {
		embeds: [embed],
		ephemeral: false,
	};
};

const fetchStats = async (pokemon, gen) => {
	const gens = new Generations(Dex);
	const smogon = new Smogon(fetch, true);
	let statsData;
	let looping = true;

	while (looping) {
		try {
			const genFormat = Smogon.format(gens.get(gen), pokemon);
			statsData = await smogon.stats(gens.get(gen), pokemon, genFormat);
			console.log(statsData);
			console.log(genFormat);
			if (statsData) return { genFormat: genFormat, data: statsData };
			gen--;
		}
		catch (err) {
			if (gen > 0) { gen--; }
			else { looping = false; }
		}
	}

	return { genFormat: 'No Set Data Found', data: 'ERROR' };
};

module.exports = { statsEmbed };