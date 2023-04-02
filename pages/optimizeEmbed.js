const { EmbedBuilder } = require('discord.js');
const { returnPokemonType, fetchPokemonSprite, StringHelper, fetchTypeHex } = require('../utils/module');
const { emojiString } = require('../data/module');

const optimizeEmbed = (json) => {
	const data = JSON.parse(json).teams[0];
	const embeds = [];
	data.pokemon.forEach((pokemon) => {
		const embed = new EmbedBuilder()
			.setImage(fetchPokemonSprite(pokemon.name, 6))
			.setThumbnail(`https://www.serebii.net/itemdex/sprites/${StringHelper.toLowerRemoveSpace(pokemon.item)}.png`)
			.addFields({
				name: (pokemon.nickname == undefined ? pokemon.name : `${pokemon.nickname} (${pokemon.name})`) + emojiString(returnPokemonType(pokemon.name)),
				value: pokemonEmbedValue(pokemon),
			});
		embed.setColor(fetchTypeHex(pokemon.name));
		embeds.push(embed);
	});
	return {
		embeds: embeds,
		ephemeral: false,
	};
};


const pokemonEmbedValue = (pokemon) => {

};

module.exports = { optimizeEmbed };