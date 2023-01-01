const { EmbedBuilder } = require('discord.js');

const errorEmbed = (err) => {
	const embed = new EmbedBuilder()
		.setColor(0xeb3434)
		.setTitle('Something went wrong :(')
		.setDescription(err.message + '\n' + error(err));
	return {
		embeds: [embed],
		ephemeral: false,
	};
};

const error = (err) => {
	console.log(err);
	return err.stack;
};

module.exports = { errorEmbed };