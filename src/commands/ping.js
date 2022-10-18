const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, DiscordAPIError } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Renvoie le nombre de ping'), 

        /**
         * 
         * 
         * @param {CommandInteraction} interaction 
         */

    async execute(interaction){
   

    await interaction.reply("pong");

    //Calcul du temps de traitement + renvoie du message
    const message = await interaction.fetchReply();
    
    return interaction.editReply(`Le message a mis ${message.createdTimestamp - interaction.createdTimestamp} ms pour me parvenir et revenir. \n Ton ping est de ${interaction.client.ws.ping} ms`);
    

        
    }

}