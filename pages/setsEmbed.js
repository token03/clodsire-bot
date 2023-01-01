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
		.setDescription(await printSet(pokemon, gen))
		.setThumbnail(`https://play.pokemonshowdown.com/sprites/bw/${pokemon.toLowerCase()}.png`);
	return {
		embeds: [embed],
		ephemeral: false,
	};
};

const printSet = async (pokemon, gen) => {
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
				delete item.species;
				return item;
			});
			console.log(setData);
			if (setData.length != 0) return '```' + genFormat + JSON.stringify(setData, null, 3) + '```';
			gen--;
		}
		catch (err) {
			if (gen > 0) { gen--; }
			else { looping = false; }
		}
	}

	return 'No Set Data Found';
};

module.exports = { setsEmbed };