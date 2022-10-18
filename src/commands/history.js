const { SlashCommandBuilder, formatEmoji } = require("@discordjs/builders");
const { CommandInteraction, DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');
const { clientId, guildId, token, ritoApiKey } = require('../../config.json');

const {Table } = require('embed-table');
const {Game} = require('../class/Game');

const axios = require('axios');

const TAB_RESULT_GAME = { 'WIN' : ':white_check_mark:',
                          'LOOSE' : ':x:'
                        };


    


module.exports = {
    data: new SlashCommandBuilder()
        .setName('history')
        .setDescription('Renvoie l\'historique du joueur')
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

        //let arrayGames = new Array(10);
        
        let game1 = new Game('dd','dd','dd','dd');
        let game2 = new Game('ff','ff','ff','ff');

        let arrayGames = [];
        

        try{
            let pseudo = interaction.options.getString("pseudo");
            profile = await axios.get('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+pseudo+"?api_key="+ritoApiKey);
        }catch(error){
            console.log('utilisateur introuvable');
            await interaction.reply(interaction.options.getString("pseudo"));
            const message = await interaction.fetchReply();
            return interaction.editReply('MUNDO a pas trouvé le pseudo '+ interaction.options.getString("pseudo") +' >:-( ');
          
        }
       
        
       
        let puuidAccount = profile.data.puuid + '';

        console.log(puuidAccount);
        
        //Contiens la liste des IDs des 10 dernière game du joueur
        let matchIdHistory = await axios.get('https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/'+puuidAccount+'/ids?start=0&count=10&api_key='+ritoApiKey)
        console.log(matchIdHistory);
        

        //TODO Encore verifier si l'historique est plein car sinon ça bug

        await interaction.deferReply();

        let playerInfo;
        let matchDatas;
        let currentGame;
        let date;
        let stringDate;
        for(let i= 0; i < 5; i++){
            
            matchDatas = await axios.get(
                'https://europe.api.riotgames.com/lol/match/v5/matches/'+matchIdHistory.data[i]+'?api_key='+ritoApiKey,
                { timeout: 30000 }
                );

            date = new Date(matchDatas.data.info.gameCreation);
            stringDate = date.toLocaleDateString("fr-FR") + " - " + date.toLocaleTimeString("fr-FR")
    
            currentGame = new Game(stringDate,Math.round(matchDatas.data.info.gameDuration / 60 * 100)/100 ,"",matchDatas.data.info.gameMode);
            
            console.log(matchDatas.data.info.gameMode);

            //TODO Fonctionelle plus bas juste à décommenter 
            for(let a=0; a<10; a++){
                
                if(matchDatas.data.info.participants[a].puuid == puuidAccount){

                    playerInfo = matchDatas.data.info.participants[a];
                    currentGame.setResult(playerInfo.win);
                    console.log(playerInfo.win)
                    break;
                }
            }
            
            arrayGames.push(currentGame);
            


            
        }


        const opggUrl = 'https://euw.op.gg/summoners/euw/'+ (profile.data.name.replace(/ /g,"")).toLowerCase();


        //DONC : Les titlesIndexes et columnIndexes sont enft les début de chaine dans laquelle la colonne va etre affiché
        //Exemple : titleIndex : [0,8,16,30] 
        //          columnIndex : [0,8,16,30]  La premiere colonne va commencer à l'index de la chaine 0, 
                                                //la colonne 2 à l'index de la chaine 8, la colonne 3 à l'index 16 ... 
        //Le principe est enft simple, ce sont juste des chaine de caracteres avec des separation et du padding

        console.log(arrayGames[0])
        const table = new Table({
            titles: ['--',':calendar: Date', ':joystick: Mode',':hourglass: Durée',':trophy: Résultat'], //:joystick: pour mode
            titleIndexes: [0,6, 65, 92,116],    //DOC : Il faut le même nombre  de case à titleIndexes, columnIndexes et titles (une case par colonne)
            columnIndexes: [0,3, 31, 45,57],
            start: '`',
            end: '`',   
            padEnd:12,
            
            
          });
          //TODO REGLER ERREUR ICI (jsp si ça focntionne atm parce que co de merde ds le train)
          table.addRow(['1: ', arrayGames[0].getStartTime(), arrayGames[0].getMode(),arrayGames[0].getGameDuration(),arrayGames[0].getResult()]);
          table.addRow(['2: ',arrayGames[1].getStartTime(), arrayGames[1].getMode(),arrayGames[1].getGameDuration(),arrayGames[1].getResult()]);
          table.addRow(['3: ',arrayGames[2].getStartTime(), arrayGames[2].getMode(),arrayGames[2].getGameDuration(),arrayGames[2].getResult()]);
          table.addRow(['4: ',arrayGames[3].getStartTime(), arrayGames[3].getMode(),arrayGames[3].getGameDuration(),arrayGames[3].getResult()]);
          table.addRow(['5: ',arrayGames[4].getStartTime(), arrayGames[4].getMode(),arrayGames[4].getGameDuration(),arrayGames[4].getResult()]);
          


        
        //CONVERTIR LA GAME DURATION ET TOUTES LES DONNEES NUMERIQUE (ELLES SONT AU FORMAT UNIXTIMESTAMP).

        const embed = new Discord.MessageEmbed()
        .setURL(opggUrl)
        .setColor('#1BBC00')
        .setTitle(profile.data.name)
        .setAuthor({name: profile.data.name, iconURL:'http://ddragon.leagueoflegends.com/cdn/12.7.1/img/profileicon/'+profile.data.profileIconId+'.png'})
        .setDescription('```Vous trouverez ici l\'historique du joueur '+profile.data.name+'```')
        .addFields(table.field())
    ;

    
        await interaction.channel.send({embeds:[embed]}); // Si on met un await ici, ça bug (alors que ça devrait pas)
        // await interaction.editReply("Trouvé !");
        const message = await interaction.fetchReply();
        return await interaction.editReply(`Le message a mis ${message.createdTimestamp - interaction.createdTimestamp} ms pour me parvenir et revenir.`);
       

        
    }

}

