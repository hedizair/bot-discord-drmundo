const { Client, CommandIntercation} = require("discord.js");

/**
 * 
 * @param {Client} client 
 * @param {CommandIntercation} interaction 
 */

const handleCommand = async (client, interaction) => {
    const command = client.commands.get(interaction.commandName);

    if(!command) return;

    try{
        await command.execute(client,interaction); //On execute la fonction .execute() se trouvant dans chaque fichier de commande
    }catch(error){
        console.error(error);
        await interaction.reply({content: "Une erreur s'est produite durant l'éxecution de cette commande !", ephemeral:true});
    }
}

module.exports = handleCommand;