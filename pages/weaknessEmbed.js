const { EmbedBuilder } = require('discord.js');
const {
	fetchTeamWeaknessTable,
	fetchPokemonWeaknessTable,
	printTeamWeaknessTable,
	printPokemonWeaknessTable,
	capitalizeTheFirstLetterOfEachWord,
	toLowerReplaceSpaceWithDash,
	fetchPokemonSprite,
} = require('../utils/module');

const teamWeaknessEmbed = (json) => {
	const data = JSON.parse(json).teams[0];
	const embed = new EmbedBuilder()
		.setTitle('Weakness');

	data.pokemon.forEach((pokemon) => {
		embed.addFields({
			name: pokemon.name,
			value: printPokemonWeaknessTable(fetchPokemonWeaknessTable(pokemon.name), pokemon.name),
			inline: true,
		});
	});

	embed.addFields({
		name: 'Team Weaknesses:',
		value: printTeamWeaknessTable(fetchTeamWeaknessTable(data.pokemon)),
	});

	return {
		embeds: [embed],
		ephemeral: false,
	};
};

const pokemonWeaknessEmbed = (pokemon) => {
	pokemon = capitalizeTheFirstLetterOfEachWord(toLowerReplaceSpaceWithDash(pokemon));
	const embed = new EmbedBuilder()
		.setTitle('Weaknesses for ' + pokemon)
		.setThumbnail(fetchPokemonSprite(pokemon.toLowerCase(), 'gen5ani'));

	embed.addFields({
		name: pokemon,
		value: printPokemonWeaknessTable(fetchPokemonWeaknessTable(pokemon), pokemon),
		inline: true,
	});

	return {
		embeds: [embed],
		ephemeral: false,
	};
};

module.exports = { teamWeaknessEmbed, pokemonWeaknessEmbed };