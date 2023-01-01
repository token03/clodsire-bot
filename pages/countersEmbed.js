const { EmbedBuilder } = require('discord.js');
const { capitalizeTheFirstLetterOfEachWord, toLowerReplaceSpaceWithDash } = require('../utils/module');
const { Dex } = require('@pkmn/dex');
const { Generations } = require ('@pkmn/data');
const { Smogon } = require ('@pkmn/smogon');
const fetch = require('cross-fetch');

const countersEmbed = async (pokemon, gen) => {
	pokemon = capitalizeTheFirstLetterOfEachWord(toLowerReplaceSpaceWithDash(pokemon));
	const gens = new Generations(Dex);
	const smogon = new Smogon(fetch, true);
	const set = await smogon.stats(gens.get(gen), pokemon, Smogon.format(gens.get(gen), pokemon));
	const embed = new EmbedBuilder()
		.setTitle('Counters for ' + pokemon)
		.setDescription(printSet(set))
		.setThumbnail(`https://play.pokemonshowdown.com/sprites/bw/${pokemon.toLowerCase()}.png`);
	return {
		embeds: [embed],
		ephemeral: false,
	};
};

function printSet(set) {
	let returnString = '';
	const countersList = set['counters'];
	if (Object.keys(countersList).length === 0) return 'No avalaible counters.';

	Object.keys(countersList).forEach(value => {
		console.log(value);
		returnString += value + ': ' + JSON.stringify(countersList[value]) + '\n';
	});
	return returnString;
}

module.exports = { countersEmbed };