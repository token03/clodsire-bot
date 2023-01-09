const { EmbedBuilder } = require('discord.js');
const { fetchPokemonSprite, fetchTypeHex } = require('../utils/module');
const { Dex } = require('@pkmn/dex');
const { Generations } = require ('@pkmn/data');

const infoEmbed = async (pokemon, gen) => {
	const info = await fetchInfo(pokemon, gen);
	const embed = new EmbedBuilder()
		.setTitle('Info for ' + pokemon)
		.setThumbnail(fetchPokemonSprite(pokemon.toLowerCase(), 'gen5ani'))
		.setColor(fetchTypeHex(pokemon))
		.setFooter({ text: 'Generation ' + info.gen })
		.setTimestamp();

	if (info.data == 'ERROR') {
		embed.addFields({
			name: 'ERROR',
			value: 'NO SETS FOUND',
			inline: false,
		});
		return {
			embeds: [embed],
			ephemeral: false,
		};
	}

	embed.addFields({ name: 'info', value: printInfo(info.data) });

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
	console.log(pokemon);
	return JSON.stringify(pokemon.baseStats) + JSON.stringify(pokemon.types);
}

module.exports = { infoEmbed };