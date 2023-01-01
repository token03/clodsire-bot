const { Dex } = require('@pkmn/dex');
const { Generations } = require('@pkmn/data');
const { capitalizeTheFirstLetterOfEachWord } = require('./stringUtils');
const { pokemonNames } = require('../data/module');

const returnPokemonType = (pokemon) => {
	const gens = new Generations(Dex);
	const trying = true;
	let gen = 9;
	while (trying) {
		try {
			return gens.get(gen).species.get(pokemon.name).types;
		}
		catch {
			gen -= 1;
		}
	}
};

async function autoCompletePokemon(interaction) {
	const focusedOption = interaction.options.getFocused(true);
	let choices;

	if (focusedOption.name === 'pokemon') {
		choices = pokemonNames;
	}

	let filtered = choices.filter(choice => choice.startsWith(focusedOption.value.toLowerCase()));
	filtered = filtered.slice(0, 24);
	await interaction.respond(
		filtered.map(choice => ({ name: capitalizeTheFirstLetterOfEachWord(choice), value: capitalizeTheFirstLetterOfEachWord(choice) })),
	);
}


module.exports = {
	returnPokemonType, autoCompletePokemon,
};