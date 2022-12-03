const { EmbedBuilder } = require('discord.js');
const { capitalizeFirstLetter } = require('../utils/module');
const { Dex } = require('@pkmn/dex');
const { Generations } = require ('@pkmn/data');
const { Smogon } = require ('@pkmn/smogon');
const { request } = require('undici');

const setsEmbed = (pokemon, format, gen) => {
	const gens = new Generations(Dex);
	const smogon = new Smogon(request, true);
	pokemon = capitalizeFirstLetter(pokemon);
	const embed = new EmbedBuilder()
		.setTitle('Smogon Sets for ' + pokemon);
	embed.setDescription(printSet('poop'));
	return {
		embeds: [embed],
		ephemeral: false,
	};
};

function printSet(set) {
	return set.species;
}

module.exports = { setsEmbed };