const { SlashCommandBuilder, formatEmoji } = require("@discordjs/builders");
const { CommandInteraction, DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');
const { clientId, guildId, token, ritoApiKey } = require('../../config.json');

const {Firebase} = require('../class/Firebase')
const {Game} = require('../class/Game');

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
        
        
    async execute(client,interaction){

        const operation = interaction.options.getString("operation");
        const dbFirebase = new Firebase();
        const errorMessageAdd = 'MUNDO a pas trouvé le pseudo '+ interaction.options.getString("pseudo") +' >:-( ';
        const errorMessageDelete = 'MUNDO a pas trouvé le pseudo '+ interaction.options.getString("pseudo") +' dans la liste >:-( ';
        const errorMessageShow = 'MUNDO a pas trouvé la liste associé au serveur, ajouter un pseudo une fois pour la créer >:-( ';
        const errorMessageNullString = 'MUNDO ne peut pas trouver une personne sans pseudo >:-( ';
        
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
    let guildId = interaction.guild.id;
    let serverName = interaction.guild.name;
    let pseudo = ''
    try{
        pseudo = interaction.options.getString("pseudo");
        profile = await axios.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+pseudo+"?api_key="+ritoApiKey);
    }catch(error){
        
        return false;
    }
    await db.addPlayerToList(guildId,pseudo,serverName);

    displayedEmbed.setTitle("---  Ajout d'un joueur à la liste  ---")
                    .setFields(
                        {name : ':computer: Server : ', value: '```➧ ' + serverName + '```'},
                        {name : ':white_check_mark: Joueur ajouté : ', value : '```' + pseudo + '```'}
                    );
                    
    return true;
    
}

async function deletePlayerFromDb(interaction, db){
    console.log("deletePlayer")
    let guildId = interaction.guild.id;
    let serverName = interaction.guild.name;
    let pseudo = interaction.options.getString("pseudo");
    if(!await db.deletePlayerFromList(guildId,pseudo)){
        return false;
    };

    displayedEmbed.setTitle("---  Suppression d'un joueur de la liste  ---")
                    .setFields(
                        {name : ':computer: Server : ', value: '```➧ ' + serverName + '```'},
                        {name : ':x: Joueur supprimé : ', value : '```' + pseudo + '```'}
                    );

    return true;
}

async function showPlayersList(interaction, db){
    const guildId = interaction.guild.id;
    console.log("showPlayers")
    const playerList = await db.getPlayersList(guildId);
    
    if(!playerList){
        return false;
    }

    let serverName = await db.getServerName(guildId)
    
    
    let renderListStr = "```";
    playerList.forEach((player) =>{
        //displayedEmbed.addFields({name: player, value:'...\n'})
        renderListStr += "➧ " + player + "\n";

    })
    renderListStr += "```";

    displayedEmbed.setTitle("---  Affichage de la liste de joueurs  ---")
                    .setFields(
                        {name : ':computer: Server : ', value: '```➧ ' + serverName + '```'},
                        {name : ':scroll: Liste : ', value : renderListStr}
                    );
   

    return true;
}



