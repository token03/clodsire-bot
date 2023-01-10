const { EmbedBuilder } = require('discord.js');

const errorEmbed = (err) => {
	console.log(err);
	const embed = new EmbedBuilder()
		.setColor(0xeb3434)
		.setTitle(err.message)
		.setDescription('```' + err.stack + '```')
		.setTimestamp();
	return {
		embeds: [embed],
		ephemeral: false,
	};
};

module.exports = { errorEmbed };