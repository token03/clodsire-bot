const { EmbedBuilder } = require('discord.js');
const { StringHelper, fetchPokemonSprite, fetchTypeHex, cleanPokemonName } = require('../utils/module');
const { Dex } = require('@pkmn/dex');
const { Generations } = require ('@pkmn/data');
const { Smogon } = require ('@pkmn/smogon');
const fetch = require('cross-fetch');

const statsEmbed = async (pokemon, gen) => {
	pokemon = cleanPokemonName(pokemon);
	const stats = await fetchStats(pokemon, gen);
	const embed = new EmbedBuilder()
		.setTitle('Stats for ' + pokemon)
		.setThumbnail(fetchPokemonSprite(pokemon.toLowerCase(), 'gen5ani'))
		.setFooter({ text: stats.genFormat })
		.setTimestamp()
		.setColor(fetchTypeHex(pokemon));

	if (stats.genFormat == 'ERROR') {
		embed.addFields({ name: 'NO STATS DATA FOUND', value: 'ERROR' });
		return {
			embeds: [embed],
			ephemeral: true,
		};
	}

	embed.addFields({ name: 'hi', value: 'hi', inline: true });
	embed.addFields(createField('Moves', stats.data['moves'], true));
	embed.addFields(createField('Natures', parseSpreads(stats.data['spreads']), true));
	embed.addFields(createField('Items', stats.data['items'], true));
	embed.addFields(createField('Teammates', stats.data['teammates'], true));

	return {
		embeds: [embed],
		ephemeral: false,
	};
};

function mergeLeadUsage(lead, usage) {
	const mergedObject = {};
	for (const key in lead) {
		mergedObject[`${key} lead`] = lead[key];
	}
	for (const key in usage) {
		mergedObject[`${key} usage`] = usage[key];
	}
	return mergedObject;
}

const fetchStats = async (pokemon, gen) => {
	const gens = new Generations(Dex);
	const smogon = new Smogon(fetch, true);
	let statsData;
	let looping = true;

	while (looping) {
		try {
			if (gen <= 0) looping = false;
			const genFormat = Smogon.format(gens.get(gen), pokemon);
			statsData = await smogon.stats(gens.get(gen), pokemon, genFormat);
			if (statsData) return { genFormat: genFormat, data: statsData };
			gen--;
		}
		catch (err) {
			if (gen > 0) { gen--; }
			else { looping = false; }
		}
	}
	return { genFormat: 'ERROR', data: 'No Stats Data Found' };
};

function parseSpreads(spreads) {
	const natureUsage = {};
	for (const spread in spreads) {
		const nature = spread.split(':')[0];
		if (nature in natureUsage) {
			natureUsage[nature] += spreads[spread];
		}
		else {
			natureUsage[nature] = spreads[spread];
		}
	}
	return natureUsage;
}

function createField(fieldName, data, inline) {
	let field = '```';
	let maxLength = 0;
	const renamedData = {};

	let i = 0;
	for (const item in data) {
		if (i >= 10) break;
		const renamedItem = StringHelper.limitItemLength(item);
		renamedData[renamedItem] = data[item];
		maxLength = Math.max(maxLength, renamedItem.length);
		i++;
	}

	for (const item in renamedData) {
		const padding = ' '.repeat(maxLength - item.length + 1);
		field += `${item}:${padding}${Math.round(renamedData[item] * 100)}%\n`;
	}

	field += '```';
	return ({ name: fieldName, value: field, inline: inline });
}


module.exports = { statsEmbed };