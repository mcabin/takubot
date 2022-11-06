const Discord= require('discord.js');
const bot = new Discord.Client();
const fs=require("fs")
const config=require('./config.json');
let prefix=config.prefix;
bot.commands = new Discord.Collection()

fs.readdir("./commandes/" , (err, files)=>{
    if(err) console.log(err);
    console.log(`${files.length} commandes`);
    let jsfile = files.filter (f => f.split(".").pop()==="js")
    if(jsfile.lenght <= 0){
        console.log('command non trouvée');return;
    }

    jsfile.forEach((f,i)=> {
        let props =require(`./commandes/${f}`);
        bot.commands.set(props.findn.name , props);
    })
        
});


bot.on('ready', () =>{
    console.log('This bot is online');
});
bot.on('message',async message=>{
    if(!message.content.startsWith(prefix)||message.author.bot) return;
    bot.emit('checkmessage',message);
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let Args =messageArray.slice(1);
    let argv =messageArray.length-1;
    var args=message.content.substring(1,prefix.lenght).split();
    let commandefile=bot.commands.get(cmd.slice(1,prefix.lenght));
    if(commandefile) commandefile.run(bot, message, Args,argv, args)
});

bot.on("guildMemberAdd", async member => {
    let json=require("./memory/racaille.json");
    if(json[member.id]==undefined){
    let role = member.guild.roles.cache.find(r => r.name === "Membre");
        if(role!=undefined){
            member.roles.add(role);
        }
    }
    else{
        let role = member.guild.roles.cache.find(r => r.name === "Prison");
        if(role!=undefined){
            member.roles.add(role);
        }
    }
  });

bot.login(config.token);