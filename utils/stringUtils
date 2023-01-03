class StringHelper {
	static toLowerReplaceSpaceWithDash(str) {
		return str.replace(/\s+/g, '-').toLowerCase();
	}

	static toLowerRemoveSpace(str) {
		return str.replace(/\s+/g, '').toLowerCase();
	}

	static capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	static capitalizeTheFirstLetterOfEachWord(words) {
		const separateWord = words.toLowerCase().split('-');
		for (let i = 0; i < separateWord.length; i++) {
			separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
		separateWord[i].substring(1);
		}
		return separateWord.join('-');
	}

	static createAlignedString(moves) {
		let string = '';
		const maxLength = Math.max(...moves.map(move => move.length));
		for (let i = 0; i < moves.length; i++) {
			const move = moves[i];
			string += '-' + move + ' '.repeat(maxLength - move.length + 1);
			if (i === 1) {
				string += '\n';
			}
		}
		return string;
	}

	static limitItemLength(item) {
		switch (item) {
		case 'Heavy-Duty Boots': return 'Heavy-DBoots';
		}
		if (item.length > 15 && item.includes('-')) {
			const words = item.split('-');
			const abbreviatedWords = words.slice(1).map(word => word[0]);
			return `${words[0]}-${abbreviatedWords.join('')}`;
		}
		return item;
	}
}

module.exports = { StringHelper };