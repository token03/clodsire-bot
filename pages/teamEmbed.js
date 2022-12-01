const { EmbedBuilder } = require('discord.js');
const { toLowerReplaceSpace, pokemonEmbedValue } = require('../utils/module');

const teamEmbed = (json) => {
    const data = JSON.parse(json).teams[0];
    const embeds = [];
    data.pokemon.forEach((pokemon) => {
        const embed = new EmbedBuilder()
            .setImage(`https://www.smogon.com/dex/media/sprites/xy/${toLowerReplaceSpace(pokemon.name)}.gif`)
            .addFields({
                name: pokemon.nickname == undefined ? pokemon.name : `${pokemon.nickname} (${pokemon.name})`,
                value: pokemonEmbedValue(pokemon),
            });
        embeds.push(embed);
    });
    return {
        embeds: embeds,
        ephemeral: false,
    };
};

module.exports = { teamEmbed };