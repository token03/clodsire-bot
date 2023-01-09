const { EmbedBuilder } = require('discord.js');
const {
	printTeamWeaknessTable,
	printPokemonWeaknessTable,
	cleanPokemonName,
	fetchPokemonSprite,
	fetchTypeHex,
} = require('../utils/module');

const teamWeaknessEmbed = (json) => {
	const data = JSON.parse(json).teams[0];
	const embed = new EmbedBuilder()
		.setTitle('Weakness');

	data.pokemon.forEach((pokemon) => {
		const pokemonName = cleanPokemonName(pokemon.name);
		embed.addFields({
			name: pokemonName,
			value: printPokemonWeaknessTable(pokemonName),
			inline: true,
		});
	});

	embed.addFields({
		name: 'Team Weaknesses:',
		value: printTeamWeaknessTable(data.pokemon),
	});

	return {
		embeds: [embed],
		ephemeral: false,
	};
};

const pokemonWeaknessEmbed = (pokemon) => {
	const embed = new EmbedBuilder()
		.setTitle('Weaknesses')
		.setThumbnail(fetchPokemonSprite(pokemon.toLowerCase(), 'gen5ani'));

	embed.addFields({
		name: pokemon,
		value: printPokemonWeaknessTable(pokemon),
		inline: true,
	});

	embed.setColor(fetchTypeHex(pokemon));

	return {
		embeds: [embed],
		ephemeral: false,
	};
};

module.exports = { teamWeaknessEmbed, pokemonWeaknessEmbed };