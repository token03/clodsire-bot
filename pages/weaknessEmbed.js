const { EmbedBuilder } = require('discord.js');
const {
	fetchTeamWeaknessTable,
	fetchPokemonWeaknessTable,
	printTeamWeaknessTable,
	printPokemonWeaknessTable,
} = require('../utils/module');

const weaknessEmbed = (json) => {
	const data = JSON.parse(json).teams[0];
	const embed = new EmbedBuilder()
		.setTitle('Weakness');

	data.pokemon.forEach((pokemon) => {
		embed.addFields({
			name: pokemon.name,
			value: printPokemonWeaknessTable(fetchPokemonWeaknessTable(pokemon), pokemon),
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

module.exports = { weaknessEmbed };