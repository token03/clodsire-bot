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

module.exports = { parsePokepaste };