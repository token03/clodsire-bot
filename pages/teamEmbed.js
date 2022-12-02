const { EmbedBuilder } = require('discord.js');
const { toLowerReplaceSpaceWithDash, toLowerRemoveSpace, pokemonEmbedValue } = require('../utils/module');

const teamEmbed = (json) => {
	const data = JSON.parse(json).teams[0];
	const embeds = [];
	data.pokemon.forEach((pokemon) => {
		const embed = new EmbedBuilder()
			.setImage(`https://www.smogon.com/dex/media/sprites/xy/${toLowerReplaceSpaceWithDash(pokemon.name)}.gif`)
			.setThumbnail(`https://www.serebii.net/itemdex/sprites/${toLowerRemoveSpace(pokemon.item)}.png`)
			.addFields({
				name: pokemon.nickname == undefined ? pokemon.name : `${pokemon.nickname} (${pokemon.name})`,
				value: pokemonEmbedValue(pokemon),
			});
		embeds.push(embed);
	});
	return {
		embeds: embeds,
		ephemeral: false,
	};
};

module.exports = { teamEmbed };