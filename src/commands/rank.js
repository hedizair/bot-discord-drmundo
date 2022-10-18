
const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, DiscordAPIError, MessageAttachment } = require('discord.js');
const Discord = require('discord.js');
const { clientId, guildId, token, ritoApiKey } = require('../../config.json');

const axios = require('axios');


const TAB_RANK_EMBLEMS = {  'IRON' : new MessageAttachment('./assets/img/ranked_emblems/Emblem_Iron.png'),
                            'BRONZE' : new MessageAttachment('./assets/img/ranked_emblems/Emblem_Bronze.png'),
                            'SILVER' : new MessageAttachment('./assets/img/ranked_emblems/Emblem_Silver.png'),
                            'GOLD' : new MessageAttachment('./assets/img/ranked_emblems/Emblem_Gold.png'),
                            'PLATINUM' : new MessageAttachment('./assets/img/ranked_emblems/Emblem_Platinum.png'),
                            'DIAMOND' : new MessageAttachment('./assets/img/ranked_emblems/Emblem_Diamond.png'),
                            'MASTER' : new MessageAttachment('./assets/img/ranked_emblems/Emblem_Master.png'),
                            'GRANDMASTER' : new MessageAttachment('./assets/img/ranked_emblems/Emblem_Grandmaster.png'),
                            'CHALLENGER' : new MessageAttachment('./assets/img/ranked_emblems/Emblem_Challenger.png')
                        };

const TAB_LABEL_QUEUE = { 'SOLO_DUO_Q' : 'Solo/Duo',
                          'FLEX_Q' : 'Flex'
                        };

const TAB_LABEL_STREAK = {  true : 'Série de win \n STONKS :chart_with_upwards_trend:',
                            false : 'Pas de série de win \n NOT STONKS :chart_with_downwards_trend:'
                         };


const TAB_COLORCIRCLE_TIER = {
                                'IRON'   : ':black_circle:',
                                'BRONZE' : ':brown_circle:',
                                'SILVER' : ':white_circle:',
                                'GOLD' : ':yellow_circle:',
                                'PLATINUM' : ':green_circle:',
                                'DIAMOND' : ':blue_circle:',
                                'MASTER' : ':purple_circle:',
                                'GRANDMASTER' : ':red_circle:',
                                'CHALLENGER' : ':orange_circle:'
                             }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranked')
        .setDescription('Mundo te donne le rang du joueur !')
        .addStringOption(option => 
            option
            .setName("pseudo")
            .setDescription("Le pseudo LoL que vous voulez voir")
            .setRequired(true))
        .addStringOption(option => 
            option
            .setName("queue")
            .setDescription("Le pseudo LoL que vous voulez voir")
            .addChoice('FLEX Queue', 'FLEX_Q')
            .addChoice('SOLO/DUO Queue','SOLO_DUO_Q')
            .setRequired(true))
        ,

        /**
         * 
         * 
         * @param {CommandInteraction} interaction 
         */

    async execute(client,interaction){
        //Si le pseudo à un espace, il faut enlever l'espac eet faire la demande

        
        let profile = "";

        
        try{
            let pseudo = interaction.options.getString("pseudo");
            profile = await axios.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+pseudo+"?api_key="+ritoApiKey);
        }catch(error){
            console.log('utilisateur introuvable');
            await interaction.reply(interaction.options.getString("pseudo"));
            return interaction.editReply('MUNDO a pas trouvé le pseudo '+ interaction.options.getString("pseudo") +' >:-( ');
        }
       
        const queueSelected = interaction.options.getString("queue");
        const idAccount = profile.data.id + '';
        const opggUrl = 'https://euw.op.gg/summoners/euw/'+ (profile.data.name.replace(/ /g,"")).toLowerCase();
        const rankInfo = await axios.get('https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/'+ idAccount + "?api_key=" + ritoApiKey);


        if(rankInfo.data.length === 0 && rankInfo.data[1]){
            
            await interaction.reply(interaction.options.getString("pseudo"));
            return interaction.editReply('MUNDO pense que le compte de '+ interaction.options.getString("pseudo") +' est très peu évolué ! >:-( ');
        }
       
        const tabQueuesInfo = sortSoloAndFlexInfo(rankInfo.data);

        if(tabQueuesInfo[queueSelected] === undefined){
            await interaction.reply(interaction.options.getString("pseudo"));
            return interaction.editReply('MUNDO pense que le compte de '+ interaction.options.getString("pseudo") +' ne fait pas de '+ TAB_LABEL_QUEUE[queueSelected] +' ! >:-( ');
        }
        else if(tabQueuesInfo === null){
            await interaction.reply(interaction.options.getString("pseudo"));
            return interaction.editReply('MUNDO pense que le compte de '+ interaction.options.getString("pseudo") +' est un bug de RITO wallah ! >:-( ');
        }
        
        const currentTier = tabQueuesInfo[queueSelected].tier;
        const ratioWinLose = (tabQueuesInfo[queueSelected].wins * 100) / (tabQueuesInfo[queueSelected].losses +tabQueuesInfo[queueSelected].wins);

        console.log(tabQueuesInfo[queueSelected]);
     
        const embed = new Discord.MessageEmbed()
        .setURL(opggUrl)
        .setColor('#1BBC00')
        .setTitle(profile.data.name)
        .setThumbnail('attachment://Emblem_' + currentTier.charAt(0) + (currentTier.slice(1)).toLowerCase() + '.png')
        .setAuthor({name: profile.data.name, iconURL:'http://ddragon.leagueoflegends.com/cdn/12.7.1/img/profileicon/'+profile.data.profileIconId+'.png'})
        .setDescription('```Vous trouverez ici toutes les informations ranked '+ TAB_LABEL_QUEUE[queueSelected] +' Queue concernant le joueur '+profile.data.name+'```')
        
        .setFields(
            {
            name: ' ➧ Informations de ranked :bar_chart: ', 
            value: 
                TAB_COLORCIRCLE_TIER[currentTier] + ' **Tier : ** ' + tabQueuesInfo[queueSelected].tier + ' - ' + tabQueuesInfo[queueSelected].rank + '\n'
                + ':boom: **LP : **' + tabQueuesInfo[queueSelected].leaguePoints + '\n'
                + ':regional_indicator_w: **Wins : ** ' + tabQueuesInfo[queueSelected].wins + '\n'
                + ':regional_indicator_l: **Losses : ** ' + tabQueuesInfo[queueSelected].losses + '\n'
                + ':heavy_division_sign: **Ratio W/L : **' + ratioWinLose.toFixed(2) + ' %',
            inline:true 
            },
            {
                name: ' ➧ Informations sur la streak :fire: ', 
                value: TAB_LABEL_STREAK[tabQueuesInfo[queueSelected].hotStreak.toString()],
                inline:true 
            }
        )
        .setTimestamp()
        ;


        //TODO Ajouter le "await interaction.deferReply();" et supprimer ligne 141 (car équivalent et peut pas faire 2 fois).
        await interaction.channel.send({embeds:[embed], files: [TAB_RANK_EMBLEMS[currentTier]]}); 
        await interaction.reply("Trouvé !");
        const message = await interaction.fetchReply();
        return await interaction.editReply(`Le message a mis ${message.createdTimestamp - interaction.createdTimestamp} ms pour me parvenir et revenir.`);
        

        
    }

}

function sortSoloAndFlexInfo(rankedInfoData){

    let tabSoloAndFlexQueue = null;
    if(rankedInfoData[0].queueType === 'RANKED_SOLO_5x5'){
        tabSoloAndFlexQueue = { 'SOLO_DUO_Q' : rankedInfoData[0],
                                'FLEX_Q' : rankedInfoData[1]};
    }
    else if(rankedInfoData[0].queueType === 'RANKED_FLEX_SR'){
        tabSoloAndFlexQueue = { 'SOLO_DUO_Q' : rankedInfoData[1],
                                'FLEX_Q' : rankedInfoData[0]};
    }
    else{
        return null;
    }

    return tabSoloAndFlexQueue;
}


