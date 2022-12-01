const pokemonEmbedValue = (pokemon) => {
	let str = '';

	if (pokemon.level == undefined) {
		str += '**Lvl**: 100 // ';
	}
	else {
		str += `**Lvl**: ${pokemon.level} //`;
	}

	if (pokemon.item) {
		str += `**Item**: ${pokemon.item}\n`;
	}

	str += `**Ability**: ${pokemon.ability} // `;

	if (pokemon.nature) {
		str += `${pokemon.nature} Nature\n`;
	}

	if (pokemon.evs) {
		const evs = pokemon.evs;
		str += '**EVs**: ' + ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe']
			.filter(function(prop) {
				return !isNaN(evs[prop.toLowerCase()]);
			})
			.map(
				function(prop) {
					const val = evs[prop.toLowerCase()];
					return `${val} ${prop}`;
				},
			)
			.join(' / ') + '\n';
	}

	if (pokemon.moves) {
		str += pokemon.moves.map(function(move) {
			return `**-** ${move}`;
		}).join('\n') + '\n';
	}

	return str;
};
module.exports = { pokemonEmbedValue };