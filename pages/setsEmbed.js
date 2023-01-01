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
	const setData = await smogon.sets(gens.get(gen), pokemon, Smogon.format(gens.get(gen), pokemon));
	setData.map(function(item) {
		delete item.gigantamax;
		return item;
	});
	let returnString = JSON.stringify(setData, null, 3);
	if (returnString.length == 2) {
		returnString = 'Set Data Not Found';
	}
	console.log(returnString);
	return '```' + returnString + '```';
};

module.exports = { setsEmbed };