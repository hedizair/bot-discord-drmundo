const { SlashCommandBuilder } = require("@discordjs/builders");
const {CommandInteraction, MessageActionRow, MessageSelectMenu} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('langage')
        .setDescription('Choisir ton langage de prédilection'),
        /**
         * 
         * @param {CommandInteraction} interaction 
         */
    async execute(interaction){
        const row = new MessageActionRow()
        .addComponents(new MessageSelectMenu()
            .setCustomId('select-language')
            .setPlaceholder('Selectionne ton langage favoris')
            .addOptions([
                {
                    label:'C#',
                    description: 'Développeur .NET',
                    value: 'CSHARP'

                },
                {
                    label: 'JavaScript',
                    description: 'Développeur WEB',
                    value: 'JavaScript'
                },

                {
                    label: 'C++',
                    description: 'Développeur de Jeux vidéo',
                    value: 'Cplusplus'
                }
            ])
        );

        return interaction.reply({content:'Quel est ton langage de programmation favoris ?',components: [row]});

    }

}