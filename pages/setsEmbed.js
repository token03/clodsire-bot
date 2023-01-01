const { EmbedBuilder } = require('discord.js');
const { capitalizeTheFirstLetterOfEachWord, toLowerReplaceSpaceWithDash } = require('../utils/module');
const { Dex } = require('@pkmn/dex');
const { Generations } = require ('@pkmn/data');
const { Smogon } = require ('@pkmn/smogon');
const fetch = require('cross-fetch');

const setsEmbed = async (pokemon, gen) => {
	pokemon = capitalizeTheFirstLetterOfEachWord(toLowerReplaceSpaceWithDash(pokemon));
	const embed = new EmbedBuilder()
		.setTitle('Smogon Set for ' + pokemon)
		.setDescription(printSet(await fetchSet(pokemon, gen)))
		.setThumbnail(`https://play.pokemonshowdown.com/sprites/bw/${pokemon.toLowerCase()}.png`);
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
				if (item.item == 'Choice Specs') item.name = 'Special Purely Offensive';
				if (item.item == 'Choice Band') item.name = 'Physical Purely Offensive';
				delete item.species;
				return item;
			});
			console.log(setData);
			if (setData.length != 0) return { genFormat: genFormat, data: setData };
			gen--;
		}
		catch (err) {
			if (gen > 0) { gen--; }
			else { looping = false; }
		}
	}

	return {};
};

const printSet = (set) => {
	let returnString = '';
	returnString += set.genFormat + '\n';
	returnString += '```' + JSON.stringify(set.data, undefined, 2) + '```';
	return returnString;
};

module.exports = { setsEmbed };