const { Dex } = require('@pkmn/dex');
const { StringHelper } = require('./stringUtils');
const { pokemonNames, typeHex, smogonFormats } = require('../data/module');
const { Sprites } = require('@pkmn/img');
const cheerio = require('cheerio');
const axios = require('axios');
const trie = require('trie-prefix-tree');
const { Koffing } = require('koffing');

const parsePokepaste = async (link) => {
	// attempts to get the markup of the provided link, parse it using cheerio, and extract the team data using Koffing
	try {
		const markup = await axios.get(link);
		const $ = cheerio.load(markup.data);
		const parsedTeam = $('pre').text();

		return Koffing.parse(parsedTeam);
	}
	catch (err) {
		// if an error occurs, throws an error with a message
		throw new Error('Invalid Link Given' + err);
	}
};

const returnPokemonType = (pokemon) => {
	// returns the types of the given pokemon from the pokemon's dex entry
	return Dex.species.get(pokemon).types;
};

const cleanPokemonName = (pokemon) => {
	// returns the cleaned name of the given pokemon from the pokemon's dex entry
	return Dex.species.get(pokemon).name;
};

const fetchPokemonSprite = (pokemon, gen) => {
	// returns the sprite url of the given pokemon and generation
	const sprite = Sprites.getPokemon(pokemon, { gen: gen });
	return sprite.url;
};

const pokemonTrie = new trie(pokemonNames);
const formatTrie = new trie(smogonFormats);

const autoCompletePokemon = async (interaction) => {
	// gets the focused option and substring, finds all the choices that match the substring and respond with them
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

const autoCompleteFormat = async (interaction) => {
	// gets the focused option and substring, finds all the choices that match the substring and respond with them
	const focusedOption = interaction.options.getFocused(true);
	const substring = focusedOption.value.toLowerCase();
	let choices = formatTrie.getPrefix(substring);

	choices = choices.slice(0, 24);
	await interaction.respond(
		choices.map(choice => ({
			name: choice,
			value: choice,
		})),
	);
};

const fetchTypeHex = (pokemon) => {
	// returns the hex code of the first type of the given pokemon
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
	autoCompleteFormat,
};