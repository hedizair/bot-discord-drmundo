const { SlashCommandBuilder, formatEmoji } = require("@discordjs/builders");
const { CommandInteraction, DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');
const { clientId, guildId, token, ritoApiKey } = require('../../config.json');


const {Game} = require('../class/Game');

const axios = require('axios');

//TODO FAIRE UN TITRE AVEC CE LIEN AU LANCEMENT DU BOT https://patorjk.com/software/taag/#p=display&f=Big%20Money-ne&t=Dr-Mundoo!


module.exports = {
    data: new SlashCommandBuilder()
        .setName('shortcut-management')
        .setDescription('Permet d effectuer des opérations sur la base de données (modifier la lsite des joueurs enregistré)')
        .addStringOption(option => option
            .setName("operation")
            .setDescription("L'opération à éffectuer sur la liste")
            .addChoice('Add a player', 'ADD')
            .addChoice('Delete a player','DELETE')
            .addChoice('Show list','SHOW')
            .setRequired(true)) //Pas obligé OU OBLIG2 ^^
        .addStringOption(option => 
            option
            .setName("pseudo")
            .setDescription("Le pseudo sur lequel vous voulez effectuer l'opération")
            .setRequired(false)), //TODO Voir si il est possible de ne pas mettre le pseudo si on show juste.
        /**
         * 
         * 
         * @param {CommandInteraction} interaction 
         */

        //TODO Faire les différentes options de commandes supp add et show, comme ça cool

        
    async execute(client,interaction){

        let profile = "";

        try{
            let pseudo = interaction.options.getString("pseudo");
            profile = await axios.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+pseudo+"?api_key="+ritoApiKey);
        }catch(error){
            console.log('utilisateur introuvable');
            await interaction.reply(interaction.options.getString("pseudo"));
            const message = await interaction.fetchReply();
            return interaction.editReply('MUNDO a pas trouvé le pseudo '+ interaction.options.getString("pseudo") +' >:-( ');
          
        }
       

        await interaction.deferReply();
        const opggUrl = 'https://euw.op.gg/summoners/euw/'+ (profile.data.name.replace(/ /g,"")).toLowerCase();

        

  

        const embed = new Discord.MessageEmbed()
        .setURL(opggUrl)
        .setColor('#1BBC00')
        .setTitle(profile.data.name)
        .setAuthor({name: profile.data.name, iconURL:'http://ddragon.leagueoflegends.com/cdn/12.7.1/img/profileicon/'+profile.data.profileIconId+'.png'})
        .setDescription('```Vous trouverez ici l\'historique du joueur '+profile.data.name+'```')
        .addFields( 
            {name: ' ➧ Niveau dinvocateur :hourglass: ', value: 'test', inline: true}, //Inline = sur la même ligne que les autres champs ou pas ?
        
        );

    
        await interaction.channel.send({embeds:[embed]}); // Si on met un await ici, ça bug (alors que ça devrait pas)
        // await interaction.editReply("Trouvé !");
        const message = await interaction.fetchReply();
        return await interaction.editReply(`Le message a mis ${message.createdTimestamp - interaction.createdTimestamp} ms pour me parvenir et revenir.`);
       

        
    }

}

