const Discord = require('discord.js');



module.exports.run = async (bot,message,args) =>{
    if(!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", false))return;
    if(!args[0]){
        return message.channel.send('Argument manquant aprés clear: nombre de message à supprimer');
    }
    else if(args[0]<100){
        let nb_clear=parseInt(args[0]);
        message.channel.bulkDelete((nb_clear+1),err=>{if(err)throw err});
    }
    else{
        message.channel.send("Variable de clear doit être inférieur à 100")
    }
}
module.exports.findn ={
    name : "clear"
}