const { EmbedBuilder } = require('discord.js');
const { toLowerReplaceSpaceWithDash, toLowerRemoveSpace, returnPokemonType } = require('../utils/module');
const { emojiString } = require('../data/module');

const teamEmbed = (json) => {
	const data = JSON.parse(json).teams[0];
	const embeds = [];
	data.pokemon.forEach((pokemon) => {
		const embed = new EmbedBuilder()
			.setImage(`https://www.smogon.com/dex/media/sprites/xy/${toLowerReplaceSpaceWithDash(pokemon.name)}.gif`)
			.setThumbnail(`https://www.serebii.net/itemdex/sprites/${toLowerRemoveSpace(pokemon.item)}.png`)
			.addFields({
				name: (pokemon.nickname == undefined ? pokemon.name : `${pokemon.nickname} (${pokemon.name})`) + emojiString(returnPokemonType(pokemon)),
				value: pokemonEmbedValue(pokemon),
			});
		embeds.push(embed);
	});
	return {
		embeds: embeds,
		ephemeral: false,
	};
};


const pokemonEmbedValue = (pokemon) => {
	let str = '';

	if (pokemon.level == undefined) {
		str += '**Lvl**: 100 // ';
	}
	else {
		str += `**Lvl**: ${pokemon.level} //`;
	}

	if (pokemon.item) {
		str += `**Item**: ${pokemon.item}\n`;
	}

	str += `**Ability**: ${pokemon.ability} // `;

	if (pokemon.nature) {
		str += `${pokemon.nature} Nature\n`;
	}

	if (pokemon.evs) {
		const evs = pokemon.evs;
		str += '**EVs**: ' + ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe']
			.filter(function(prop) {
				return !isNaN(evs[prop.toLowerCase()]);
			})
			.map(
				function(prop) {
					const val = evs[prop.toLowerCase()];
					return `${val} ${prop}`;
				},
			)
			.join(' / ') + '\n';
	}

	if (pokemon.moves) {
		str += pokemon.moves.map(function(move) {
			return `**-** ${move}`;
		}).join('\n') + '\n';
	}

	return str;
};

module.exports = { teamEmbed };