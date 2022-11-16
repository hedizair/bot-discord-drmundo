const { SlashCommandBuilder, formatEmoji } = require("@discordjs/builders");
const { CommandInteraction, DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');
const { clientId, guildId, token, ritoApiKey } = require('../../config.json');

const {Firebase} = require('../class/Firebase')
const {Game} = require('../class/Game');
//const { dbFirebase } = require('../index');

const axios = require('axios');
const displayedEmbed = new Discord.MessageEmbed()
                        .setColor('#1BBC00')
                        .setAuthor({name: 'Dr-Mundo'})
                        .setTitle('Not developed...');





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
            .setRequired(false)) //Pas obligé OU OBLIG2 ^^
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

        //TODO Refaire l'affichage un peu, que ce soit plus jolie.
        //TODO Voir pour le parametre "pseudo" de la commande, et le mettre en optionelle.
        //TODO Verifier quand meme si il est vide pour les commandes add et supp, annulé la commande et envoyer un message d'explication.g
        
        
    async execute(client,interaction){

        const operation = interaction.options.getString("operation");
        const guildId = interaction.guild.id;
        const dbFirebase = new Firebase();
        const errorMessageAdd = 'MUNDO a pas trouvé le pseudo '+ interaction.options.getString("pseudo") +' >:-( ';
        const errorMessageDelete = 'MUNDO a pas trouvé le pseudo '+ interaction.options.getString("pseudo") +' dans la liste >:-( ';
        const errorMessageShow = 'MUNDO a pas trouvé la liste associé au serveur, ajouter un pseudo une fois pour la créer >:-( ';
        const errorMessageNullString = 'MUNDO ne peut pas trouver une personne sans pseudo >:-( ';
        
   
        //dbFirebase.initDocument(guildId); //ne s'initialise seulement si le document n'existe pas
        await interaction.deferReply();
        
        switch(operation){
            case "ADD":
                if(interaction.options.getString("pseudo")===null)
                    return await interaction.editReply(errorMessageNullString);
                const isAdded =  await addPlayerToDb(interaction,dbFirebase);
                if(!isAdded)
                    return await interaction.editReply(errorMessageAdd);
                break;

            case "DELETE":
                if(interaction.options.getString("pseudo")===null)
                    return await interaction.editReply(errorMessageNullString);
                const isDeleted = await deletePlayerFromDb(interaction, dbFirebase);
                if(!isDeleted)
                    return await interaction.editReply(errorMessageDelete);
                break;

            case "SHOW":
                console.log(interaction.options.getString("pseudo"));
                const isShown = await showPlayersList(interaction,dbFirebase);       
                if(!isShown)
                    return await interaction.editReply(errorMessageShow);
                break; 
            
            
        }


        await interaction.channel.send({embeds:[displayedEmbed]});
        const message = await interaction.fetchReply();
        return await interaction.editReply(`Le message a mis ${message.createdTimestamp - interaction.createdTimestamp} ms pour me parvenir et revenir.`);
       
    }

}

async function addPlayerToDb(interaction,db){
    console.log("addPlayer");
    let pseudo = ''
    try{
        pseudo = interaction.options.getString("pseudo");
        profile = await axios.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+pseudo+"?api_key="+ritoApiKey);
    }catch(error){
        
        return false;
    }
    await db.addPlayerToList(interaction.guild.id,pseudo);

    displayedEmbed.setTitle("Ajout d'un joueur à la liste")
                    .setFields({name:"➧", value:"Le joueur "+ pseudo + " à bien été ajouté à la liste."});
    return true;
    
}

async function deletePlayerFromDb(interaction, db){
    console.log("deletePlayer")
    if(!await db.deletePlayerFromList(interaction.guild.id,interaction.options.getString("pseudo"))){
        return false;
    };
    displayedEmbed.setTitle("Suppression d'un joueur de la liste")
                        .setFields({name:"➧", value:"Le joueur "+ interaction.options.getString("pseudo") + " à bien été supprimé de la liste."});
    return true;
}

async function showPlayersList(interaction, db){
    console.log("showPlayers")
    const playerList = await db.getPlayersList(interaction.guild.id);
    
    if(!playerList){
        return false;
    }
    displayedEmbed.setTitle("Affichage de la liste de joueurs")
                    .setFields({name : 'Affichage de la liste', value: '{nom_du_serveur}'});
    
    playerList.forEach((player) =>{
        displayedEmbed.addFields({name: player, value:'...\n'})

    })
   

    return true;
}



