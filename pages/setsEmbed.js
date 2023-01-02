const { EmbedBuilder } = require('discord.js');
const { capitalizeTheFirstLetterOfEachWord, toLowerReplaceSpaceWithDash, fetchPokemonSprite } = require('../utils/module');
const { Dex } = require('@pkmn/dex');
const { Generations } = require ('@pkmn/data');
const { Smogon } = require ('@pkmn/smogon');
const fetch = require('cross-fetch');

const setsEmbed = async (pokemon, gen) => {
	pokemon = capitalizeTheFirstLetterOfEachWord(toLowerReplaceSpaceWithDash(pokemon));
	const embed = new EmbedBuilder()
		.setTitle('Smogon Set for ' + pokemon)
		.setDescription(printSet(await fetchSet(pokemon, gen)))
		.setThumbnail(fetchPokemonSprite(pokemon.toLowerCase(), 'gen5ani'));
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
			console.log(setData);
			console.log(genFormat);
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

const printSet = (set) => {
	let returnString = '';
	returnString += set.genFormat + '\n';
	returnString += '```' + JSON.stringify(set.data, undefined, 2) + '```';
	return returnString;
};

module.exports = { setsEmbed };