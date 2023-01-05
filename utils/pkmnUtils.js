const { Dex } = require('@pkmn/dex');
const { StringHelper } = require('./stringUtils');
const { pokemonNames, typeHex } = require('../data/module');
const { Sprites } = require('@pkmn/img');
const cheerio = require('cheerio');
const axios = require('axios');
const trie = require('trie-prefix-tree');
const { Koffing } = require('koffing');

const parsePokepaste = async (link) => {
	try {
		const markup = await axios.get(link);
		const $ = cheerio.load(markup.data);
		const parsedTeam = $('pre').text();

		return Koffing.parse(parsedTeam);
	}
	catch (err) {
		throw new Error('Invalid Link Given' + err);
	}
};

const returnPokemonType = (pokemon) => {
	return Dex.species.get(pokemon).types;
};

const cleanPokemonName = (pokemon) => {
	return Dex.species.get(pokemon).name;
};

const fetchPokemonSprite = (pokemon, gen) => {
	const sprite = Sprites.getPokemon(pokemon, { gen: gen });
	return sprite.url;
};

const pokemonTrie = new trie(pokemonNames);

const autoCompletePokemon = async (interaction) => {
	const focusedOption = interaction.options.getFocused(true);
	const substring = focusedOption.value.toLowerCase();
	let choices = pokemonTrie.getPrefix(substring);

	choices = choices.slice(0, 24);
	await interaction.respond(
		choices.map(choice => ({
			name: StringHelper.capitalizeTheFirstLetterOfEachWord(choice),
			value: StringHelper.capitalizeTheFirstLetterOfEachWord(choice),
		})),
	);
};

const fetchTypeHex = (pokemon) => {
	const types = returnPokemonType(pokemon);
	return typeHex.get(types[0]);
};

module.exports = {
	returnPokemonType,
	autoCompletePokemon,
	parsePokepaste,
	fetchPokemonSprite,
	fetchTypeHex,
	cleanPokemonName,
};