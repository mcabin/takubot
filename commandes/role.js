const Discord = require('discord.js');
const config=require('../config.json');
const fs=require("fs");

module.exports.run = async (bot,message,args,argv) =>{
    let path_r=require("../memory/jail.json");
    if(!message.channel.permissionsFor(message.member).has("ADMINISTRATOR", false))return;
    if(args[0]=="arrest"){
        let member=message.mentions.members.first();
        if(member==undefined){
            return message.channel.send("$role arrest @usename");
        }
        let role_list=member.roles.cache.map(r=>r.name);
        path_r [member.id]={
            message:role_list
        }

        fs.writeFile('./memory/jail.json', JSON.stringify(path_r, null,4), err => {
            if(err) throw err;
        });
        
        for(let i=0;role_list.length>i;i++){
            if(role_list[i]!=='@everyone'){
                let rrole=message.guild.roles.cache.find(r => r.name === role_list[i])
                member.roles.remove(rrole).catch(console.error);
            }
        }
        message.channel.send("Vous êtes en état d'arrestation <@"+member.id+'>');
        message.channel.send("https://tenor.com/view/cops-police-swat-swatting-gif-8712094");
        let role = message.guild.roles.cache.find(r => r.name === "Prison");
        member.roles.add(role).catch(console.error);
        
    }


    if(args[0]=="all"){
       let amb= message.guild.members.cache.map(member=>member.id);
       let amb_size=amb.length;
       let argd=args.slice(1);
       argd=argd.join(' ');
       let role = message.guild.roles.cache.find(r => r.name === argd);
       if(role==undefined)return message.channel.send("Ce role n'existe pas");
       for(let i=0;amb_size>i;i++){
           let member=message.guild.members.cache.find(r => r.id === amb[i]);
           if(!member.bot){
               member.roles.add(role).catch(console.error);
            }
       }
    }

    if(args[0]=="free"){
        let member=message.mentions.members.first();
        if(member==undefined){
            return message.channel.send("$role free @usename");
        }
        if(path_r[member.id]==undefined){
            return message.channel.send(member.username+" n'est pas en prison.");
        }
        let free_list=path_r[member.id].message;
        delete path_r[member.id];
        fs.writeFile('./memory/jail.json', JSON.stringify(path_r, null,4), err => {
            if(err) throw err;
        });

        for(let i=0;free_list.length>i;i++){
            if(free_list[i]!=='@everyone'){
                let rrole=message.guild.roles.cache.find(r => r.name === free_list[i])
                member.roles.add(rrole).catch(console.error);
            }
        }
        let frole=message.guild.roles.cache.find(r => r.name === "Prison")
        member.roles.remove(frole);
        message.channel.send("<@"+member.id+'> est libre !');
        
    }

}

module.exports.findn ={
    name : "role"
}