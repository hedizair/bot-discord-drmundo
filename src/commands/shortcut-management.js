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

        const operation = interaction.options.getString("operation");
        const guildId = interaction.guild.id;
        const dbFirebase = new Firebase();
        
        //TODO Verifier que ça fonctionne  (ça fonctionne pas la)
        //dbFirebase.initDocument(guildId); //ne s'initialise seulement si le document n'existe pas
        await interaction.deferReply();
        
        switch(operation){
            case "ADD":
                const isAdded =  await addPlayerToDb(interaction,dbFirebase);
                if(!isAdded) {
                    console.log('utilisateur introuvable');
                    await interaction.reply(interaction.options.getString("pseudo"));
                    const message = await interaction.fetchReply();
                    return await interaction.editReply('MUNDO a pas trouvé le pseudo '+ interaction.options.getString("pseudo") +' >:-( ');
                }
                    
                break;
            case "DELETE":
                
                const isDeleted = await deletePlayerFromDb(interaction, dbFirebase);
                //TODO Comprendre pourquoi l'appelle de cette fonction crash
                if(!isDeleted){
                    console.log('utilisateur introuvable');
                    await interaction.reply(interaction.options.getString("pseudo"));
                    const message = await interaction.fetchReply();
                    return await interaction.editReply('MUNDO a pas trouvé le pseudo '+ interaction.options.getString("pseudo") +' dans la liste >:-( ');
                }
                break;
            case "SHOW":
                const isShown = await showPlayersList(interaction,dbFirebase);
                console.log(isShown)
                if(!isShown){
                    console.log('utilisateur introuvable');
                    const message = await interaction.fetchReply();
                    return await interaction.editReply('MUNDO a pas trouvé la liste associé au serveur, ajouter un pseudo une fois pour la créer >:-( ');
                }
                break; 
            
            
        }


       
        
        
    

        const embed = new Discord.MessageEmbed()
        .setColor('#1BBC00')
        .setAuthor({name: 'Dr-Mundo'})
        .setTitle('Not developed...')
        .setDescription('```Nothing```')
        .addFields( 
            {name: ' ➧ Nothing to show ', value: 'nothing', inline: true}, //Inline = sur la même ligne que les autres champs ou pas ?
        
        );

    
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
                    .setFields({});
    
    playerList.forEach((player) =>{
        displayedEmbed.addFields({name: player, value:'-'})

    })
   

    return true;
}



