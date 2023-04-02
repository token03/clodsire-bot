const { EmbedBuilder } = require('discord.js');
const { StringHelper, fetchPokemonSprite, fetchTypeHex } = require('../utils/module');
const { Dex } = require('@pkmn/dex');
const { Generations } = require ('@pkmn/data');
const { Smogon } = require ('@pkmn/smogon');
const fetch = require('cross-fetch');

const setsEmbed = async (pokemon, gen) => {
	const sets = await fetchSet(pokemon, gen);
	const embed = new EmbedBuilder()
		.setTitle('Set for ' + pokemon)
		.setThumbnail(fetchPokemonSprite(pokemon.toLowerCase(), 'gen5ani'))
		.setColor(fetchTypeHex(pokemon))
		.setFooter({ text: sets.genFormat })
		.setTimestamp();

	if (sets.data == 'ERROR') {
		embed.addFields({
			name: 'ERROR',
			value: 'NO SETS FOUND',
			inline: false,
		});
		return {
			embeds: [embed],
			ephemeral: false,
		};
	}
	sets.data.forEach((set) => {
		const name = set.name;
		delete set.name;
		embed.addFields(
			{
				name: name,
				value: '```' + printSet(set) + '```',
				inline: true,
			});
	});

	return {
		embeds: [embed],
		ephemeral: false,
	};
};

const fetchSet = async (pokemon, gen) => {
	const gens = new Generations(Dex);
	const smogon = new Smogon(fetch, true);
	let setData;
	let looping = true;

	while (looping) {
		try {
			const genFormat = Smogon.format(gens.get(gen), pokemon);
			setData = await smogon.sets(gens.get(gen), pokemon, genFormat);
			setData.map(function(item) {
				delete item.gigantamax;
				switch (item.item) {
				case 'Choice Specs': item.name = 'Specs'; break;
				case 'Choice Scarf': item.name = 'Scarfed'; break;
				case 'Choice Band': item.name = 'Banded'; break;
				}
				delete item.species;
				return item;
			});
			if (setData.length != 0 && setData) return { genFormat: genFormat, data: setData };
			gen--;
		}
		catch (err) {
			if (gen > 0) { gen--; }
			else { looping = false; }
		}
	}
	return { genFormat: 'No Set Data Found', data: 'ERROR' };
};

function printSet(pokemon) {
	let output = '';
	output += `Item: ${pokemon.item}\n`;
	if (pokemon.ability) output += `Ability: ${pokemon.ability}\n`;
	output += 'Moves:\n';
	output += StringHelper.createAlignedString(pokemon.moves);
	output += `\nNature: ${pokemon.nature}\n`;
	output += 'Evs:\n';
	for (const [stat, value] of Object.entries(pokemon.evs)) {
		output += `  ${stat}: ${value}\n`;
	}
	return output;
}

module.exports = { setsEmbed };