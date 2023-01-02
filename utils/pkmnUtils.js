const { Dex } = require('@pkmn/dex');
const { Generations } = require('@pkmn/data');
const { capitalizeTheFirstLetterOfEachWord } = require('./stringUtils');
const { pokemonNames } = require('../data/module');
const { Sprites } = require('@pkmn/img');
const cheerio = require('cheerio');
const axios = require('axios');
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
	const gens = new Generations(Dex);
	const trying = true;
	let gen = 9;
	while (trying) {
		try {
			return gens.get(gen).species.get(pokemon).types;
		}
		catch {
			gen -= 1;
		}
	}
};

const fetchPokemonSprite = (pokemon, gen) => {
	const sprite = Sprites.getPokemon(pokemon, { gen: gen });
	return sprite.url;
};

const autoCompletePokemon = async (interaction) => {
	const focusedOption = interaction.options.getFocused(true);
	let choices;

	if (focusedOption.name === 'input') {
		choices = pokemonNames;
	}

	let filtered = choices.filter(choice => choice.startsWith(focusedOption.value.toLowerCase()));
	filtered = filtered.slice(0, 24);
	await interaction.respond(
		filtered.map(choice => ({ name: capitalizeTheFirstLetterOfEachWord(choice), value: capitalizeTheFirstLetterOfEachWord(choice) })),
	);
};


module.exports = {
	returnPokemonType,
	autoCompletePokemon,
	parsePokepaste,
	fetchPokemonSprite,
};