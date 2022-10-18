const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');
const { clientId, guildId, token, ritoApiKey } = require('../../config.json');


const axios = require('axios');



//TODO Regler le problme quand y'a un espace + ajouter un ratio au rank

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profil')
        .setDescription('Renvoie un profil League of Legends')
        .addStringOption(option => option
            .setName("pseudo")
            .setDescription("Le pseudo LoL que vous voulez voir")
            .setRequired(true)), //Pas obligé OU OBLIG2 ^^
        /**
         * 
         * 
         * @param {CommandInteraction} interaction 
         */

    async execute(client,interaction){
        //Si le pseudo à un espace, il faut enlever l'espac eet faire la demande


        let summonerLevel ="";
        let idAccount = "";
        let otpName = "";
        let otp = "";
        let otpPoints = "";
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
       
        
        summonerLevel =  profile.data.summonerLevel + '';
        idAccount = profile.data.id + '';
        
        await interaction.deferReply();
        
        const opggUrl = 'https://euw.op.gg/summoners/euw/'+ (profile.data.name.replace(/ /g,"")).toLowerCase();
        const championInfo = await axios.get('https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/'+idAccount+'?api_key='+ritoApiKey);

        
        if(championInfo.data.length === 0){
            
            await interaction.reply(interaction.options.getString("pseudo"));
            return interaction.editReply('MUNDO pense que le compte de '+ interaction.options.getString("pseudo") +' est très peu évolué >:-( ');
        }

        const allChampions = await axios.get('http://ddragon.leagueoflegends.com/cdn/12.7.1/data/fr_FR/champion.json');


        const otpId = championInfo.data[0].championId;
        const secMainId = championInfo.data[1].championId;
        const thiMainId = championInfo.data[2].championId;

        
        const arrayChamps = allChampions.data.data;
        const arrayNameChamp = Object.keys(arrayChamps); //On récupère les clés du tableau de champion

        otpPoints = championInfo.data[0].championPoints + '';
        
        for(let i = 0; i < arrayNameChamp.length; i++){ 
           
            if(arrayChamps[arrayNameChamp[i]].key==otpId){ //Si l'id du champion récup est égal à son id
                
                otp = arrayChamps[arrayNameChamp[i]];
                otpName = otp.name + '';
                otpImage = "http://ddragon.leagueoflegends.com/cdn/12.7.1/img/champion/"+ otp.image.full;
            }

            if(arrayChamps[arrayNameChamp[i]].key==secMainId){
                
                secMain = arrayChamps[arrayNameChamp[i]];
                secMainName = secMain.name + '';
                secMainImage = "http://ddragon.leagueoflegends.com/cdn/12.7.1/img/champion/"+ secMain.image.full;
            }

            if(arrayChamps[arrayNameChamp[i]].key==thiMainId){
                
                thiMain = arrayChamps[arrayNameChamp[i]];
                thiMainName = thiMain.name + '';
                thiMainImage = "http://ddragon.leagueoflegends.com/cdn/12.7.1/img/champion/"+ thiMain.image.full;
            }


            
        }
         
        

        const embed = new Discord.MessageEmbed()
        .setURL(opggUrl)
        .setColor('#1BBC00')
        .setTitle(profile.data.name)
        .setAuthor({name: profile.data.name, iconURL:'http://ddragon.leagueoflegends.com/cdn/12.7.1/img/profileicon/'+profile.data.profileIconId+'.png'})
        .setDescription('```Vous trouverez ici toutes les informations concernant le profil du joueur '+profile.data.name+'```')
        .setFields(
            {name: ' ➧ Niveau dinvocateur :hourglass: ', value: summonerLevel, inline: true}, //Inline = sur la même ligne que les autres champs ou pas ?
            {name: ' ➧ Champion le plus joué  :white_check_mark: ', value:  otpName + ' avec ' + otpPoints + ' points', inline:true},
            {name: ' ➧ Id de compte : ', value: idAccount, inline: false}
            
        )
        .setImage(otpImage)
        ;

        const embed2 = new Discord.MessageEmbed()
        .setURL(opggUrl)
        .setColor('#1BBC00')
        .setImage(secMainImage)
        ;

        const embed3 = new Discord.MessageEmbed()
        .setURL(opggUrl)
        .setColor('#1BBC00')
        .setImage(thiMainImage)
        ;
        
   
        
        await interaction.channel.send({embeds:[embed,embed2,embed3]}); // Si on met un await ici, ça bug (alors que ça devrait pas)

        //await interaction.reply("Trouvé !"); 
        //on le commentaire car on met le message plus haut : "mundo reflechie..."
        const message = await interaction.fetchReply();
        return await interaction.followUp(`Le message a mis ${message.createdTimestamp - interaction.createdTimestamp} ms pour me parvenir et revenir.`);
        

        
    }

}