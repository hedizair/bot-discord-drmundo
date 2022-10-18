const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON()) //ON récupère toutes les commandes du dossier ./commands
}

const rest = new REST({version: '9'}).setToken(token);

//Méthode qui va enregistrer les commandes sur le bot:

(async ()=> {
    try{
        await rest.put(Routes.applicationCommands(clientId), {body: commands});
        console.log('Les commandes ont été enregistrées !');
    }catch(error){
        
        console.error(error);
    }
})();


//