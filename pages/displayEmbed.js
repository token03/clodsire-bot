const { EmbedBuilder } = require('discord.js');
const { returnPokemonType, fetchPokemonSprite, StringHelper } = require('../utils/module');
const { emojiString } = require('../data/module');

const displayEmbed = (json) => {
	const data = JSON.parse(json).teams[0];
	const embeds = [];
	data.pokemon.forEach((pokemon) => {
		const embed = new EmbedBuilder()
			.setImage(fetchPokemonSprite(StringHelper.toLowerReplaceSpaceWithDash(pokemon.name, 6)))
			.setThumbnail(`https://www.serebii.net/itemdex/sprites/${StringHelper.toLowerRemoveSpace(pokemon.item)}.png`)
			.addFields({
				name: (pokemon.nickname == undefined ? pokemon.name : `${pokemon.nickname} (${pokemon.name})`) + emojiString(returnPokemonType(pokemon.name)),
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
		console.log(pokemon.moves);
		str += '```' + StringHelper.createAlignedString(pokemon.moves) + '```';
		console.log(str);
	}

	return str;
};

module.exports = { displayEmbed };