const { SlashCommandBuilder } = require("@discordjs/builders");
const {CommandInteraction} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('choice')
        .setDescription('permet de faire un choix')
        .addStringOption(option => 
            option.setName('choice')
            .setDescription('Le choix à faire')
            .setRequired(true)
            .addChoice('Choix 1', '1')
            .addChoice('Choix 2', '2')
            .addChoice('Choix 3', '3')
            ),
            
        /**
         * 
         * @param {CommandInteraction} interaction 
         */


    async execute(interaction){
        const choice = interaction.options.getString('choice');

        await interaction.reply(choice);

    }

}