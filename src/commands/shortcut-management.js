const { SlashCommandBuilder, formatEmoji } = require("@discordjs/builders");
const { CommandInteraction, DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');
const { clientId, guildId, token, ritoApiKey } = require('../../config.json');

const {Firebase} = require('../class/Firebase')
const {Game} = require('../class/Game');
//const { dbFirebase } = require('../index');

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

        //const dbFirebase = new Firebase();
        const operation = interaction.options.getString("operation");
        const guildId = interaction.guild.id;

        //dbFirebase.initDocument(guildId)

        console.log(guildId);
        switch(operation){
            case "ADD":
                const isAdded =  await addPlayerToDb(interaction);
                if(!isAdded) {
                    console.log('utilisateur introuvable');
                    await interaction.reply(interaction.options.getString("pseudo"));
                    const message = await interaction.fetchReply();
                    return interaction.editReply('MUNDO a pas trouvé le pseudo '+ interaction.options.getString("pseudo") +' >:-( ');
                }
                    
                break;
            case "DELETE":
                
                deletePlayerFromDb();
                break;
            case "SHOW":
                showPlayersList();
                
                break; 
            
            
        }


        await interaction.deferReply();
        

        const embed = new Discord.MessageEmbed()
        .setColor('#1BBC00')
        .setTitle('Not developed...')
        .setAuthor({name: 'Dr-Mundo'})
        .setDescription('```Nothing```')
        .addFields( 
            {name: ' ➧ Nothing to show ', value: 'nothing', inline: true}, //Inline = sur la même ligne que les autres champs ou pas ?
        
        );

    
        await interaction.channel.send({embeds:[embed]}); // Si on met un await ici, ça bug (alors que ça devrait pas)
        // await interaction.editReply("Trouvé !");
        const message = await interaction.fetchReply();
        return await interaction.editReply(`Le message a mis ${message.createdTimestamp - interaction.createdTimestamp} ms pour me parvenir et revenir.`);
       

        
    }

  

}

async function addPlayerToDb(interaction){
    console.log("addPlayer");
    try{
        let pseudo = interaction.options.getString("pseudo");
        profile = await axios.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+pseudo+"?api_key="+ritoApiKey);
    }catch(error){
        
        return false;
    }
    return true;

    
}

function deletePlayerFromDb(playerName){
    console.log("deletePlayer")

    return true;
}

function showPlayersList(){
    console.log("showPlayers")

    return true;
}

