const { EmbedBuilder } = require('discord.js');
const { capitalizeTheFirstLetterOfEachWord, toLowerReplaceSpaceWithDash, fetchPokemonSprite } = require('../utils/module');
const { Dex } = require('@pkmn/dex');
const { Generations } = require ('@pkmn/data');
const { Smogon } = require ('@pkmn/smogon');
const fetch = require('cross-fetch');

const countersEmbed = async (pokemon, gen) => {
	pokemon = capitalizeTheFirstLetterOfEachWord(toLowerReplaceSpaceWithDash(pokemon));
	const embed = new EmbedBuilder()
		.setTitle('Counters for ' + pokemon)
		.setDescription(printCounters(await fetchCounters(pokemon, gen)))
		.setThumbnail(fetchPokemonSprite(pokemon.toLowerCase(), 'gen5ani'));
	return {
		embeds: [embed],
		ephemeral: false,
	};
};

const fetchCounters = async (pokemon, gen) => {
	const gens = new Generations(Dex);
	const smogon = new Smogon(fetch, true);
	const data = await smogon.stats(gens.get(gen), pokemon, Smogon.format(gens.get(gen), pokemon));
	return data['counters'];
};

const printCounters = (counters) => {
	let returnString = '';
	if (Object.keys(counters).length === 0) return 'No avalaible counters.';

	Object.keys(counters).forEach(value => {
		console.log(value);
		returnString += value + ': ' + JSON.stringify(counters[value]) + '\n';
	});
	return returnString;
};

module.exports = { countersEmbed };