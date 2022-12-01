const { EmbedBuilder } = require('discord.js');

const errorEmbed = (err) => {
	const embed = new EmbedBuilder().setColor(0xeb3434).setTitle('Something went wrong :(').setDescription(`${err.stack}\n${err.name}\n${err.message}`);
	return {
		embeds: [embed],
		ephemeral: false,
	};
};

module.exports = { errorEmbed };