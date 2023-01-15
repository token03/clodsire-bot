const { EmbedBuilder } = require('discord.js');
const { fetchPokemonSprite, fetchTypeHex, returnPokemonType } = require('../utils/module');
const { emojiString } = require('../data/module');
const { Dex } = require('@pkmn/dex');
const { Generations } = require ('@pkmn/data');

const infoEmbed = async (pokemon, gen) => {
	const info = await fetchInfo(pokemon, gen);
	const pokemonData = info.data;
	console.log(pokemonData);
	const embed = new EmbedBuilder()
		.setThumbnail(fetchPokemonSprite(pokemon.toLowerCase(), 'gen5ani'))
		.setColor(fetchTypeHex(pokemon))
		.setFooter({ text: 'Generation ' + gen })
		.setTimestamp()
		.setTitle(`${pokemonData.name} #${pokemonData.num}`)
		.setDescription(emojiString(returnPokemonType(pokemon)) + '\n```' +
		'Generation: ' + pokemonData.gen + '\n' +
		'Base Stats: ' + JSON.stringify(pokemonData.baseStats) + '\n' +
		'BST: ' + pokemonData.bst + '\n' +
		'Abilities: ' + JSON.stringify(Object.values(pokemonData.abilities)) + '\n' +
		'Weight: ' + pokemonData.weightkg + 'kg\n' + '```');
	console.log(pokemonData);

	// if (info.data == 'ERROR') {
	// 	embed.addFields({
	// 		name: 'ERROR',
	// 		value: 'NO INFO FOUND',
	// 		inline: false,
	// 	});
	// 	return {
	// 		embeds: [embed],
	// 		ephemeral: false,
	// 	};
	// }

	return {
		embeds: [embed],
		ephemeral: false,
	};
};

const fetchInfo = async (pokemon, gen) => {
	const gens = new Generations(Dex);
	let infoData;
	let looping = true;

	while (looping) {
		try {
			infoData = await gens.get(gen).species.get(pokemon);
			if (infoData) return { gen: gen, data: infoData };
			gen--;
		}
		catch (err) {
			if (gen > 0) { gen--; }
			else { looping = false; }
		}
	}

	return { gen: 'this is really bad', data: 'why did this happen' };
};

function printInfo(pokemon) {
	console.log(pokemon['data']);
}

module.exports = { infoEmbed };