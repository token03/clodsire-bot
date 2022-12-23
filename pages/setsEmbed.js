const { EmbedBuilder } = require('discord.js');
const { capitalizeFirstLetter, toLowerReplaceSpaceWithDash } = require('../utils/module');
const { Dex } = require('@pkmn/dex');
const { Generations } = require ('@pkmn/data');
const { Smogon } = require ('@pkmn/smogon');
const fetch = require('cross-fetch');

const setsEmbed = async (pokemon, format, gen) => {
	pokemon = capitalizeFirstLetter(pokemon);
	const gens = new Generations(Dex);
	const smogon = new Smogon(fetch, true);
	const set = await smogon.stats(gens.get(gen), pokemon, `gen${gen}${format}`);
	const embed = new EmbedBuilder()
		.setTitle('Smogon Sets for ' + pokemon)
		.setDescription(printSet(set))
		.setThumbnail(`https://play.pokemonshowdown.com/sprites/bw/${toLowerReplaceSpaceWithDash(pokemon)}.png`);
	return {
		embeds: [embed],
		ephemeral: false,
	};
};

function printSet(set) {
	let returnString = '';
	const counters = set['counters'];
	if (Object.keys(counters).length === 0) return 'No avalaible counters.';

	Object.keys(counters).forEach(value => {
		console.log(value);
		returnString += value + ': ' + JSON.stringify(counters[value]) + '\n';
	});
	return returnString;
}

module.exports = { setsEmbed };