const { EmbedBuilder } = require('discord.js');
const { returnPokemonType, fetchPokemonSprite, StringHelper, fetchTypeHex } = require('../utils/module');
const { emojiString } = require('../data/module');


const displayEmbed = (json) => {
	const data = JSON.parse(json).teams[0];
	// Initialize an empty array to store embeds
	const embeds = [];
	data.pokemon.forEach((pokemon) => {
		// Create a new embed builder for each pokemon
		const embed = new EmbedBuilder()
			.setThumbnail(fetchPokemonSprite(pokemon.name, 6))
			.setImage(`https://www.serebii.net/itemdex/sprites/${StringHelper.toLowerRemoveSpace(pokemon.item)}.png`)
		// Add a field with the pokemon name, nickname (if it exists) and formatted data
			.addFields({
				name: (pokemon.nickname == undefined ? pokemon.name : `${pokemon.nickname} (${pokemon.name})`) + emojiString(returnPokemonType(pokemon.name)),
				value: formatDisplayData(pokemon),
			});
		embed.setColor(fetchTypeHex(pokemon.name));
		embeds.push(embed);
	});
	return {
		embeds: embeds,
		ephemeral: false,
	};
};

const formatDisplayData = (pokemon) => {
	let str = '';
	if (pokemon.level == undefined) {
		str += '`Lvl: 100`\n';
	}
	else {
		str += `\` Lvl: ${pokemon.level}\`\n`;
	}
	str += `\`Ability: ${pokemon.ability}\`\n`;
	if (pokemon.nature) {
		str += `\` Nature: ${pokemon.nature}\`\n`;
	}
	if (pokemon.evs) {
		const evs = pokemon.evs;
		// Filter the evs data to only include valid values
		str += '`' + ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe']
			.filter(function(prop) {
				return !isNaN(evs[prop.toLowerCase()]);
			})
			.map(
				function(prop) {
					const val = evs[prop.toLowerCase()];
					return `${val} ${prop}`;
				},
			)
			.join(' / ') + '`\n';
	}
	if (pokemon.moves) {
		str += '`' + StringHelper.createAlignedString(pokemon.moves) + '`\n';
	}
	if (pokemon.item) {
		str += `\`Item: ${pokemon.item}\`\n`;
	}
	return str;
};

module.exports = { displayEmbed };