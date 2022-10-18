const { SlashCommandBuilder } = require("@discordjs/builders");
const {CommandInteraction, MessageActionRow, MessageButton} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Donne le lien de ma chaine youtube'),
        /**
         * 
         * @param {CommandInteraction} interaction 
         */
    async execute(interaction){
        const row = new MessageActionRow()
        .addComponents(new MessageButton()
            .setLabel("Youtube")
            .setStyle('LINK') //On indique un que c'est bien un URL
            .setURL('https://www.youtube.com/channel/UCsxqpLz_8j1LrINGttO30sg')
        );

        await interaction.reply({content: 'Clique sur le bouton ci-dessous pour voir ma chaine Youtube', components: [row]});
    }

}