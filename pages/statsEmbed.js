const { EmbedBuilder } = require('discord.js');
const { StringHelper, fetchPokemonSprite, fetchTypeHex } = require('../utils/module');
const { Dex } = require('@pkmn/dex');
const { Generations } = require ('@pkmn/data');
const { Smogon } = require ('@pkmn/smogon');
const fetch = require('cross-fetch');

const statsEmbed = async (pokemon, gen) => {
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

	embed.addFields({ name: 'Usage',
		value: '```' + `Raw: ${(stats.data.usage.raw * 100).toFixed(2)}% | Real: ${(stats.data.usage.real * 100).toFixed(2)}% | Weighted: ${(stats.data.usage.weighted * 100).toFixed(2)}%` + '```' });

	embed.addFields({ name:'Natures: ',
		value: '```' + top3Natures(stats.data.spreads) + '```' });

	embed.addFields(createField('Moves:', stats.data.moves, true, 8));
	embed.addFields(createField('Teammates:', stats.data.teammates, true, 8));
	embed.addFields({ name: '\u200b', value: '\u200b', inline: true });
	embed.addFields(createField('Spreads:', parseSpreads(stats.data.spreads), true, 5));
	embed.addFields(createField('Items:', stats.data.items, true, 5));
	if (Object.keys(stats.data.counters).length != 0) {
		embed.addFields({ name: 'Counters:', value: '```' +
		Object.keys(stats.data.counters).toString().split(',').join(', ') + '```' });
	}

	return {
		embeds: [embed],
		ephemeral: false,
	};
};

function top3Natures(spreads) {
	let natureUsage = {};
	for (const spread in spreads) {
		const [nature] = spread.split(':');
		if (!natureUsage[nature]) natureUsage[nature] = 0;
		natureUsage[nature] += spreads[spread];
	}

	natureUsage = Object.entries(natureUsage)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3)
		.map(nature => `${nature[0]}: ${(nature[1] * 100).toFixed(2)}%`)
		.join(' | ');

	return natureUsage;
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
	let spreadUsage = {};
	for (const spread in spreads) {
		const [nature, ...nums] = spread.split(':');
		const numsKey = nums.join(':');
		if (!spreadUsage[numsKey]) spreadUsage[numsKey] = 0;
		spreadUsage[numsKey] += spreads[spread];
	}

	spreadUsage = Object.entries(spreadUsage)
		.sort((a, b) => b[1] - a[1])
		.reduce((acc, [key, value]) => {
			acc[key] = value;
			return acc;
		}, {});
	return spreadUsage;
}

function createField(fieldName, data, inline, cutoff) {
	let field = '```';
	let maxLength = 0;
	const renamedData = {};

	let i = 0;
	for (const item in data) {
		if (i >= cutoff) break;
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