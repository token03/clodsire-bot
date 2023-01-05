const typeEmoji = new Map([
	['Bug', '1048168393678802955'],
	['Dark', '1048168395100663808'],
	['Dragon', '1048168396182798337'],
	['Electric', '1048168397139091468'],
	['Fairy', '1048168398317682778'],
	['Fighting', '1048168399332712488'],
	['Fire', '1048168705613373450'],
	['Flying', '1048168401597632612'],
	['Ghost', '1048168707072983040'],
	['Grass', '1048168708566155325'],
	['Ground', '1048168709556015165'],
	['Ice', '1048168404441382913'],
	['Normal', '1048168710508138537'],
	['Poison', '1048168711904825426'],
	['Psychic', '1048168713083428864'],
	['Rock', '1048168714102644807'],
	['Steel', '1048168408014921759'],
	['Water', '1048168738324746240'],
]);

const typeHex = new Map([
	['Bug', 0xA6B91A],
	['Dark', 0x705746],
	['Dragon', 0x6F35FC],
	['Electric', 0xF7D02C],
	['Fairy', 0xD685AD],
	['Fighting', 0xC22E28],
	['Fire', 0xEE8130],
	['Flying', 0xA98FF3],
	['Ghost', 0x735797],
	['Grass', 0x7AC74C],
	['Ground', 0xE2BF65],
	['Ice', 0x96D9D6],
	['Normal', 0xA8A77A],
	['Poison', 0xA33EA1],
	['Psychic', 0xF95587],
	['Rock', 0xB6A136],
	['Steel', 0xB7B7CE],
	['Water', 0x6390F0],
]);

const emojiString = (types) => {
	let returnString = '';
	types.forEach(type => {
		returnString += `<:${type}:${typeEmoji.get(type)}> `;
	});
	return '\n' + returnString;
};

module.exports = { typeEmoji, emojiString, typeHex };