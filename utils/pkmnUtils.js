const { Dex } = require('@pkmn/dex');
const { Generations } = require('@pkmn/data');

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

module.exports = {
	returnPokemonType,
};