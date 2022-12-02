const Table = require('easy-table');
const { Dex } = require('@pkmn/dex');
const { Generations } = require('@pkmn/data');
const { returnPokemonType } = require('./pkmnUtils');


const teamWeaknessTable = (team) => {
	const gens = new Generations(Dex);
	console.log(Dex.forGen(9).types.get('Normal'));
	console.log(gens.get(9).types.totalEffectiveness('Normal', ['Rock', 'Steel']));
	return team.name;
};

const pokemonWeaknessTable = (pokemon) => {
	const gens = new Generations(Dex);
	const types = returnPokemonType(pokemon);
	const tableData = [
		{ type: 'Bug', effectivess: 0 },
		{ type: 'Dark', effectivess: 0 },
		{ type: 'Dragon', effectivess: 0 },
		{ type: 'Electric', effectivess: 0 },
		{ type: 'Fairy', effectivess: 0 },
		{ type: 'Fighting', effectivess: 0 },
		{ type: 'Fire', effectivess: 0 },
		{ type: 'Flying', effectivess: 0 },
		{ type: 'Ghost', effectivess: 0 },
		{ type: 'Grass', effectivess: 0 },
		{ type: 'Ground', effectivess: 0 },
		{ type: 'Ice', effectivess: 0 },
		{ type: 'Normal', effectivess: 0 },
		{ type: 'Poison', effectivess: 0 },
		{ type: 'Psychic', effectivess: 0 },
		{ type: 'Rock', effectivess: 0 },
		{ type: 'Steel', effectivess: 0 },
		{ type: 'Water', effectivess: 0 },
	];

	tableData.forEach(value => {
		const num = gens.get(9).types.totalEffectiveness(value.type, types);
		switch (value) {
		case 3:
			value.effectivess = 'immune';
			break;
		case 0:
			value.effectivess = 'neutral';
			break;
		default:
			value.effectivess = `${num}x`;
			break;
		}
	});

	const t = new Table;

	tableData.forEach((type) => {
		t.cell('Type', type.type);
		t.cell('Modify', type.effectivess);
		t.newRow();
	});

	return '```' + t.toString() + '```';
};

module.exports = {
	teamWeaknessTable,
	pokemonWeaknessTable,
};