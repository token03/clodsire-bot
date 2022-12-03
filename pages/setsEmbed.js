const { EmbedBuilder } = require('discord.js');
const { capitalizeFirstLetter } = require('../utils/module');
const { Dex } = require('@pkmn/dex');
const { Generations } = require ('@pkmn/data');
const { Smogon } = require ('@pkmn/smogon');
const fetch = require('cross-fetch');

const setsEmbed = async (pokemon, format, gen) => {
	pokemon = capitalizeFirstLetter(pokemon);
	const gens = new Generations(Dex);
	const smogon = new Smogon(fetch, true);
	const set = await smogon.stats(gens.get(gen), pokemon, `gen${gen}${format}`);
	console.log(JSON.stringify(set));
	const embed = new EmbedBuilder()
		.setTitle('Smogon Sets for ' + pokemon)
		.setDescription(printSet(set));
	return {
		embeds: [embed],
		ephemeral: false,
	};
};

const printSet = set => {
	return 'delibhrd';
};

module.exports = { setsEmbed };