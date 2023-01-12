const { EmbedBuilder } = require('discord.js');
const { returnPokemonType, fetchPokemonSprite, StringHelper, fetchTypeHex } = require('../utils/module');
const { emojiString } = require('../data/module');


const displayEmbed = (json) => {
	// This function takes in a json object and parses it to extract the teams data
	const data = JSON.parse(json).teams[0];
	// Initialize an empty array to store embeds
	const embeds = [];
	// Iterate over the pokemon data
	data.pokemon.forEach((pokemon) => {
		// Create a new embed builder for each pokemon
		const embed = new EmbedBuilder()
		// Use the pokemon name to fetch the sprite and set it as the image
			.setImage(fetchPokemonSprite(StringHelper.toLowerReplaceSpaceWithDash(pokemon.name), 6))
		// Fetch the item sprite and set it as the thumbnail
			.setThumbnail(`https://www.serebii.net/itemdex/sprites/${StringHelper.toLowerRemoveSpace(pokemon.item)}.png`)
		// Add a field with the pokemon name, nickname (if it exists) and formatted data
			.addFields({
				name: (pokemon.nickname == undefined ? pokemon.name : `${pokemon.nickname} (${pokemon.name})`) + emojiString(returnPokemonType(pokemon.name)),
				value: formatDisplayData(pokemon),
			});
		// Set the color of the embed based on the pokemon's type
		embed.setColor(fetchTypeHex(pokemon.name));
		// Push the embed to the embeds array
		embeds.push(embed);
	});
	// Return the embeds array and set the ephemeral property to false
	return {
		embeds: embeds,
		ephemeral: false,
	};
};

const formatDisplayData = (pokemon) => {
	// Initialize an empty string to store the data
	let str = '';
	// Check if the level property exists
	if (pokemon.level == undefined) {
		// If it doesn't, assume the level is 100
		str += '**Lvl**: 100 // ';
	}
	else {
		// If it does, add it to the string
		str += `**Lvl**: ${pokemon.level} //`;
	}
	// Check if the item property exists
	if (pokemon.item) {
		str += `**Item**: ${pokemon.item}\n`;
	}
	// Add the ability to the string
	str += `**Ability**: ${pokemon.ability} // `;
	// Check if the nature property exists
	if (pokemon.nature) {
		str += `${pokemon.nature} Nature\n`;
	}
	// Check if the evs property exists
	if (pokemon.evs) {
		const evs = pokemon.evs;
		// Filter the evs data to only include valid values
		str += '**EVs**: ' + ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe']
			.filter(function(prop) {
				return !isNaN(evs[prop.toLowerCase()]);
			})
		// Map the data to a formatted string
			.map(
				function(prop) {
					const val = evs[prop.tolowerCase()];
					return `${val} ${prop}`;
				},
			)
		// Join the mapped data with a separator
			.join(' / ') + '\n';
	}
	// Check if the moves property exists
	if (pokemon.moves) {
		// Add the moves to the string, formatted with line breaks and aligned
		str += '```' + StringHelper.createAlignedString(pokemon.moves) + '```';
	}
	// Return the final string
	return str;
};

module.exports = { displayEmbed };