const fs = require('fs');
const {Client, Collection,Intents, Message} = require('discord.js');
const { token } = require('../config.json');
const { Firebase } = require('./class/Firebase.js');



const dbFirebase = new Firebase();

//TODO Pour re créer une commande, toujours re éxecuter le script deploy-commands.js

const handleCommand = require('./helpers/command');
const handleSelectMenu = require('./helpers/select-menu');

const client = new Client({intents : [Intents.FLAGS.GUILDS]}); // Indiquer ce que le bot a le droit de faire ici, via les flags du site Discord js
client.commands = new Collection();
const commandFiles = fs.readdirSync('../src/commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`../src/commands/${file}`);
    client.commands.set(command.data.name, command);
}


client.once('ready', ()=>{
    console.log('Je suis prêt !');
    
});


//Gère les intercations avec le bot, donc pur certaines commande utilisé dans le serveur
//Cette fonction va se lancer

client.on('interactionCreate', async interaction => {
    if(interaction.isCommand()) handleCommand(client, interaction);
    if(interaction.isSelectMenu()) handleSelectMenu(client,interaction); //On ajoute le client, qui conties toutes les informations sur le bot, son nom, image ...
    
});

client.login(token);