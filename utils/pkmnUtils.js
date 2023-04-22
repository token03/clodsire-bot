const { Dex } = require('@pkmn/dex');
const { StringHelper } = require('./stringUtils');
const { pokemonNames, typeHex, smogonFormats } = require('../data/module');
const { Sprites } = require('@pkmn/img');
const cheerio = require('cheerio');
const axios = require('axios');
const Fuse = require('fuse.js');
const { Koffing } = require('koffing');

const pokemonFuse = new Fuse(pokemonNames, { threshold: 0.4 });
const formatFuse = new Fuse(smogonFormats, { threshold: 0.6 });

const parsePokepaste = async (link) => {
	// attempts to get the markup of the provided link, parse it using cheerio, and extract the team data using Koffing
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

const cleanPokemonName = (nameString) => {
	// checks if the nameString is valid, if so, returns the name
	let pokemon = Dex.species.get(nameString);
	if (pokemon.exists) return pokemon.name;
	// else fuzzy matches the top result
	const result = pokemonFuse.search(nameString).slice(0, 2);
	//  if string doesn't include 'mega' don't index the mega.
	(result[0]['item'].includes('mega') && !nameString.includes('mega')) ? pokemon = Dex.species.get(result[1]['item']) : pokemon = Dex.species.get(result[0]['item']);
	return pokemon.name;
};

const fetchPokemonSprite = (pokemon, gen) => {
	const sprite = Sprites.getPokemon(pokemon, { gen: gen });
	return sprite.url;
};

const autoCompletePokemon = async (interaction) => {
	const focusedOption = interaction.options.getFocused(true);
	const substring = focusedOption.value.toLowerCase();
	let choices = pokemonFuse.search(substring).map(choice => {
		return choice.item;
	});
	choices = choices.slice(0, 24);
	await interaction.respond(
		choices.map(choice => ({
			name: StringHelper.capitalizeTheFirstLetterOfEachWord(choice),
			value: StringHelper.capitalizeTheFirstLetterOfEachWord(choice),
		})),
	);
};

const autoCompleteFormat = async (interaction) => {
	const focusedOption = interaction.options.getFocused(true);
	const substring = focusedOption.value.toLowerCase();
	let choices = formatFuse.search(substring).map(choice => {
		return choice.item;
	});
	choices = choices.slice(0, 24);
	console.log(choices);
	await interaction.respond(
		choices.map(choice => ({
			name: choice,
			value: choice,
		})),
	);
};

const cleanFormat = (format) => {
	return formatFuse.search(format).map(choice => {
		return choice.item;
	})[0];
};

const fetchTypeHex = (pokemon) => {
	const types = returnPokemonType(pokemon);
	return typeHex.get(types[0]);
};

const classifyPokemon = (evs, nature) => {
	const statNames = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
	const evStats = statNames.map((stat) => ({ stat, value: evs[stat.toLowerCase()] || 0 }));

	evStats.sort((a, b) => b.value - a.value);

	const topStats = evStats.slice(0, 2).map((statObj) => statObj.stat).sort();

	const classificationLookup = {
		'AtkSpe': 'Fast Physical Attacker',
		'SpASpe': 'Fast Special Attacker',
		'HPSpD': 'Special Wall',
		'HPDef': 'Physical Walll',
	};

	const classificationKey = topStats.join('');
	const classification = classificationLookup[classificationKey] || 'Mixed';

	return classification;
};


module.exports = {
	returnPokemonType,
	autoCompletePokemon,
	parsePokepaste,
	fetchPokemonSprite,
	fetchTypeHex,
	cleanPokemonName,
	autoCompleteFormat,
	cleanFormat,
	classifyPokemon,
};