const Discord = require('discord.js');
const fs=require("fs");
const mem_vid='./memory/vid.json';
const config=require('../config.json');
let prefix=config.prefix;

module.exports.run = async (bot,message,args,argv) =>{
    bot.msg=require('../memory/vid.json');
    if(args[0]=="new"){
        if(!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", false))return;
        else if(argv!=3){
            return message.channel.send(prefix+"vid new <nom de la nouvelle video> <lien de la vidéo>");
        }
        else if(args[1]=="new" || args[1]=="remove"){
            return message.channel.send("Wait that's illegal !");
        }
        else if(bot.msg[args[1]])return message.channel.send(args[1]+" existe déja");
        else{
            //argd=args.slice(2);
            //argd=argd.join(' ');
            bot.msg [args[1]]={
                message: args[2]
            }
            fs.writeFile(mem_vid, JSON.stringify(bot.msg, null,4), err => {
                if(err) throw err;
                return message.channel.send("Vidéo sauvegarder en: "+args[1]+".");
            });
        }
    }
    else if(args[0]=="remove"){
        if(!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", false))return;
        else if(argv==2){
            let r_json=bot.msg
            if(!r_json[args[1]]){
            return message.channel.send("Vidéo "+args[1] + " n'existe pas." );
            }
            delete r_json[args[1]];
            fs.writeFile(mem_vid,JSON.stringify(r_json,null,4), err => {
                if(err) throw err;
                return message.channel.send("Vidéo "+args[1] + " supprimée." );
            });
        }
        else return message.channel.send(prefix+"vid remove <nom vidéo à supprimer>");
    }
    else if(argv==1){
        if(!bot.msg[args[0]]){
            return message.channel.send("Vidéo "+args[0] + " n'existe pas." );
            }
        let _message = bot.msg[args[0]].message;
        message.channel.send(_message);
    }
    else{return message.channel.send("- "+prefix+"vid <tag> pour afficher une vidéo existente \n- !vid new <nom de la nouvelle video> <lien de la vidéo> pour créer une nouvelle vidéo \n- !vid remove <nom vidéo à supprimer>");}
    }

module.exports.findn ={
    name : "vid"
}