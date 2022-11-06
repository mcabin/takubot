const Discord = require('discord.js');
const config=require('../config.json');
let prefix=config.prefix;

module.exports.run = async (bot,message,args,argv) =>{
    function spamer(i,m) {
        if(i<=0 ){return;}
        message.channel.send(m);
        setTimeout(function(){spamer((i-1),m)},1000);
    }
    if(!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", false))return;
    if(argv<1) return message.channel.send(prefix+"spam <nb de print> <chaine de caractére>");
    let argd=args.slice(1);
    argd.join(' ');
    console.log("spam " +argd)
    if(argv>=2)spamer(args[0],argd);
    else {return message.channel.send(prefix+"spam 'nombre inférieur à 100' 'chaine de caractére'");}
    }

module.exports.findn ={
    name : "spam"
}