const Discord = require('discord.js');
const config=require('../config.json');
let prefix=config.prefix;
const fs=require("fs");
const paquetdebase=["R9","R9","R8","R8","R7","R7","R6","R6","R5","R5","R4","R4","R3","R3","R2","R2","R1","R1","R0","RV","RV","R+","R+","RC","RC","Y9","Y9","Y8","Y8","Y7","Y7","Y6","Y6","Y5","Y5","Y4","Y4","Y3","Y3","Y2","Y2","Y1","Y1","Y0","YV","YV","Y+","Y+","YC","YC","G9","G9","G8","G8","G7","G7","G6","G6","G5","G5","G4","G4","G3","G3","G2","G2","G1","G1","G0","GV","GV","G+","G+","GC","GC","B9","B9","B8","B8","B7","B7","B6","B6","B5","B5","B4","B4","B3","B3","B2","B2","B1","B1","B0","BV","BV","B+","B+","BC","BC","M*","M*","M*","M*","MJ","MJ","MJ","MJ"];
let json=require("../memory/uno.json");
const { argv0 } = require('process');

function printcard(c){
    let c1=c.charAt(0);
    let c2=c.charAt(1);
    switch(c1){
        case 'R':
            return " 🟥"+printmidle(c2,c1)+"🟥"
        case 'Y':
            return " 🟨"+printmidle(c2,c1)+"🟨"
        case 'B':
            return " 🟦"+printmidle(c2,c1)+"🟦"
        case 'G':
            return " 🟩"+printmidle(c2,c1)+"🟩"
        case 'M':
            return " 🇲🇺"+printmidle(c2,c1)+"🇲🇺";
    }
}

function printmidle(c,c2){
    if(parseInt(c)<=9 && parseInt(c)>=0){
        return ' **'+c+'** ';
    }
    switch(c){
        case 'V':
            return ' ↔️ '
        case '*':
                return " **+4** "
        case '+':
                return " **+2** "
        case 'C':
            return " 🚫 ";
        case 'J':
            return " 🃏 "
        
        
    }
}
function printdeck(p){
    let str="__Deck :__\n\n";
    let deck=json[p].deck;
    let jump=0;
    for(let i=0;deck.length>i;i++){
        jump++;
        if(jump>6){
            str=str+"\n\n";
            jump=0;
        }
        let num=i+1;
        str=str+num+" : "+printcard(deck[i])+"   /   ";
    }
    return str;
}



function printplayer(){
    let str="__Ordre de passage :__\n\n";
    let order=json["game"].order_play;
    for(let i=0;i<json["game"].nb_player;i++){
        let id_player=order[i];
        str=str+'**n° '+(i+1)+"** <@"+id_player+"> 🃏:"+json[id_player].nb_cards+"  /";
    }
    return str+"\n\n";

}

function printgame(p){
    let str=printplayer()+printdeck(p);
    str=str+"\n\n__Carte jouée__:\n\n";
    let game=json["game"];
    if(game.currentcard==null){
        str=str+"Choisi la premiére carte"
    }
    else{
        str=str+printcard(game.currentcard);
    }
    return str;
}

function create_game(player,playername){
        json["game"]={
        nb_player : 1, //nombre de joueur
        deck : [],  // deck
        state : 0, // 0 pas commencé ou finis | 1 en cours
        nb_cards : 0, //nb de carte du deck
        classement : [],
        order_play : [player],
        currentcard : null,
        malus: 0,
        draw: true,

        }
    json[player]={
        nb : 1,
        username : playername,
        deck :[],
        classement : 0,
        nb_cards :0,
    }
    return "La partie a été crée ! <@"+player+"> est le joueur 1 !";
}

function addplayer(player,playername){
    let game=json["game"];
    game.nb_player++;
    json[player]={
        nb : 1,
        username : playername,
        deck : [],
        classement : 0,
        nb_cards :0,
    }
    game.order_play.push(player);
    return "<@"+player+"> à rejoin la partie !";
}

function distribute(nb_deck,beg_cards){
    let game=json["game"];
    let tmp_deck=[];
    for(let i=0;i<nb_deck;i++){
        tmp_deck=tmp_deck.concat(paquetdebase);
    }
    game.nb_cards=108*nb_deck;
    game.deck=tmp_deck;
    for(let i=0;beg_cards>i;i++){
        for(let j=0;game.order_play.length>j;j++){
            let id_player=game.order_play[j];
            let ran_nb=Math.floor(Math.random() * game.nb_cards);
            json[id_player].deck.push(game.deck[ran_nb]);
            game.deck.splice(ran_nb,1);
            game.nb_cards=game.deck.length;
            json[id_player].nb_cards++;
        }
    }    
}

function multicolor_move(game,j_play,index_coup,color,coup2){
    if(coup2=='*'){
        game.malus-=4;
        game.currentcard=color+"*"
        j_play.deck.splice(index_coup,1);
        game.deck.push("M*");
        j_play.nb_cards--;
        game.nb_cards=game.deck.length;
        let end=game.order_play.shift();
        game.order_play.push(end);
        return 0;
    }
    if(coup2=="J"){
        game.currentcard=color+"J";
        j_play.deck.splice(index_coup,1);
        game.deck.push("MJ");
        j_play.nb_cards--;
        game.nb_cards=game.deck.length;
        let end=game.order_play.shift();
        game.order_play.push(end);
        return 0;
    }
}

function normal_move(game,j_play,index_coup,coup,coup2){
        game.currentcard=coup;
        let end;
        j_play.deck.splice(index_coup,1);
        j_play.nb_cards--;
        game.nb_cards=game.deck.length;
        game.deck.push(game.currentcard);
        if(coup2=='V'){
            game.order_play.reverse();
        }
        else if(coup2=='C'){
            end=game.order_play.shift();
            game.order_play.push(end);
            end=game.order_play.shift();
            game.order_play.push(end);
        }
        else if(coup2=='+'){
            end=game.order_play.shift();
            game.order_play.push(end);
            game.malus=2;
        }
        else{
            end=game.order_play.shift();
            game.order_play.push(end);
        }
        return 0;
}
function play_one_move(player,index_coup,color){
    let j_play=json[player];
    let game=json["game"];
    if(game.order_play[0]!=player){
        return "Ce n'est pas à toi de jouer !"
    }
    if(j_play.deck[index_coup]==undefined){
        return "Vous n'avez pas de carte n° "+(index_coup+1);
    }
    let coup=j_play.deck[index_coup];
    let card=game.currentcard;
    let coup1=coup.charAt(0);
    let coup2=coup.charAt(1);
    if(game.malus!=0){
        if(game.malus>=2){  //+2
            if(coup2=='+'){
                game.currentcard=coup;
                game.malus+=2;
                j_play.deck.splice(index_coup,1);
                game.deck.push(game.currentcard);
                let end=game.order_play.shift();
                game.order_play.push(end);
                j_play.nb_cards--;
                game.nb_cards=game.deck.length;
                return 0;
            }
            else{
                
                return "Si tu n'as pas de carte +2 utilises la commande $uno take pour piocher les "+game.malus+" cartes !"
            }
        }
        if(game.malus<=(-4)){  //+4
            if(coup2=='*' && game.state%2==0){
                if(color=='Y' ||color=='YELLOW' || color=='JAUNE' || color =='J' ){ //jaune
                    return multicolor_move(game,j_play,index_coup,"Y",coup2);
                }
                else if(color=='G' || color=='GREEN' || color=='VERT' || color =='V'){
                    return multicolor_move(game,j_play,index_coup,"G",coup2);
                }
                else if(color=='B' ||color=='BLUE' || color=="BLEU"){
                    return multicolor_move(game,j_play,index_coup,"B",coup2);
                }
                else if(color=='R' || color=='RED' || color=='ROUGE'){
                    return multicolor_move(game,j_play,index_coup,"R",coup2);
                }
                else{
                    return "Invalid color !"
                }
            }
            return "Pour ce prendre le +4 utilise la commande $uno take"
        }
    }
    if(coup1=='M'){
        if(color==null){
            return "Mettre la couleur que vaut la carte multicouleur !"
        }
        else{
            color=color.toUpperCase();
            if(color=='Y' ||color=='YELLOW' || color=='JAUNE' || color =='J' ){ //jaune
                return multicolor_move(game,j_play,index_coup,"Y",coup2);
            }
            else if(color=='G' || color=='GREEN' || color=='VERT' || color =='V'){
                return multicolor_move(game,j_play,index_coup,"G",coup2);
            }
            else if(color=='B' ||color=='BLUE' || color=="BLEU"){
                return multicolor_move(game,j_play,index_coup,"B",coup2);
            }
            else if(color=='R' || color=='RED' || color=='ROUGE'){
                return multicolor_move(game,j_play,index_coup,"R",coup2);
            }
            else{
                return "Invalid color !"
            }
        }
    }
    
    if(card==null){

        return normal_move(game,j_play,index_coup,coup,coup2);
    }
    let card1=card.charAt(0);
    let card2=card.charAt(1);
    if(card1==coup1 || card2==coup2){
        return normal_move(game,j_play,index_coup,coup,coup2);
    }
    else{
        return 'La carte jouée est invalide'
    }
}
function player_win(p){
    let  game=json.game;
    if(json[p].nb_cards>0){
        return 0;
    }
    if(game.currentcard.charAt(1)=='C'){
        console.log("CANCEL WINNER")
        let win=game.order_play.splice(game.order_play.length-2,1);
        game.classement.push(win);
        game.nb_player--;
        json[p].classement=game.classement.length;
        if(game.order_play.length<=1 || game.state%3==0){
            return 2;
        }
        return 1;
    }
    let win=game.order_play.pop();
    game.classement.push(win);
    game.nb_player--;
    json[p].classement=game.classement.length;
    if(game.order_play.length<=1 || game.state%3==0){
        return 2;
    }
    return 1;
}
module.exports.run = async (bot,message,argv,argc) =>{
    
    if(argv[0]=="create"){
        console.log(argv[0])
        if(json["game"]!=undefined){
            if(json["game"].state>=0){
                return message.channel.send("Une partie est deja commencée");
            }
        }
        let category = message.guild.channels.cache.find(c => c.name == "UNO" && c.type == "category");
        if(message.guild.channels.cache.find(channel => channel.name === "lobby").id==message.channel.id){
            let username=message.author.username.replace(/ /g,"-").toLowerCase();
            console.log(username);
            message.guild.channels.create(username, {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: message.author.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                ],
            }).then(chan0=>{
                let chan = message.guild.channels.cache.find(c => c.name == username);
                chan.setParent(category.id,{ lockPermissions: false });
                chan.updateOverwrite(message.author, { VIEW_CHANNEL: true });
                chan.updateOverwrite(message.channel.guild.roles.everyone, { VIEW_CHANNEL: false });

                    let player=message.author.id;
                    message.channel.send(create_game(player,username));
                    fs.writeFile('./memory/uno.json', JSON.stringify(json, null,4), err => {
                        if(err) throw err;
                    });
            });
        }
        return;
    }
    if(argv[0]=="stop"){
        if(json["game"]==undefined){
                return message.channel.send("Pas de partie en cour");
        }
        let list_key=Object.keys(json);
        for(let i=0 ;i<list_key.length;i++){
            if(list_key[i]!="game"){
                
               let name_chan= json[list_key[i]].username.toLowerCase();
               let chan=message.channel.guild.channels.cache.find(c=> c.name==name_chan);
               if(chan!=undefined){

                   chan.delete();}
               
            }
        }
        json={};
        fs.writeFile('./memory/uno.json', JSON.stringify(json, null,4), err => {
            if(err) throw err;
        });
        return message.channel.send("Partie arrétée !");
    }
    if(argv[0]=="join"){
        if(json["game"]==undefined){
            return message.channel.send("Pas de partie en cour !\nUtilisez "+prefix+"uno create pour créer un partie .");
        }
        if(json[message.author.id]!=undefined){
            return message.channel.send("Tu es déja un joueur !");
        }
        if(json["game"].state>=1){
            return("Une partie est en cour !");
        }
        let category = message.guild.channels.cache.find(c => c.name == "UNO" && c.type == "category");
        if(message.guild.channels.cache.find(channel => channel.name === "lobby").id==message.channel.id){
            let username=message.author.username.replace(/ /g,"-").toLowerCase();
            console.log(username);
            message.guild.channels.create(username, {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: message.author.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                ],
            }).then(chan0=>{
                let chan = message.guild.channels.cache.find(c => c.name == username);
                chan.setParent(category.id,{ lockPermissions: false });
                    let player=message.author.id;
                    message.channel.send(addplayer(player,username));
                    fs.writeFile('./memory/uno.json', JSON.stringify(json, null,4), err => {
                        if(err) throw err;
                    });
            });
            return;
        }
    }
    if(argv[0]=="start"){
        let game =json.game;
        let stat=1;
        if(json["game"]==undefined){
            return message.channel.send("Pas de partie en cour !\nUtilisez "+prefix+"uno create pour créer un partie .");
        }
        if(json["game"].state>=1){
            return message.channel.send("Partie déja commencé !");
        }
        if(argc==1){
            distribute(1,7);
        }
        if(argc>=2){
            if(argv[1]=="normal"){
                stat=1;
            }
            else if(argv[1]=="hell"){
                stat=2;
            }
            else if(argv[1]=="normal1"){
                stat=3;
            }
            else if(argv[1]=="hell1"){
                stat=6;
            }
            else{
                return message.channel.send("Ce mode de jeu n'existe pas !");
            }
        }
        if(argc==2){
            distribute(1,7);
        }
        if(argc==3){
            if(parseInt(argv[2])>10){
                return message.channel.send("Nous n'avons que 10 paquets disponibles !");
            }
            distribute(argv[2],7);
        }
        if(argc==4){
            if(parseInt(argv[2])>10){
                return message.channel.send("Nous n'avons que 10 paquets disponibles !");
            }
            if(parseInt(argv[3]*json["game"].nb_player>argv[0]*108) || parseInt(argv[2])>30){
                return message.channel.send("Pas assez de carte !");
            }
            distribute(argv[2],argv[3]);
        }
        for(let i=0;json["game"].order_play.length>i;i++){
            let id_player=game.order_play[i];
            let chan = message.guild.channels.cache.find(c => c.name == json[id_player].username);

            chan.send(printgame(id_player));
        }
        json["game"].state=stat;
        fs.writeFile('./memory/uno.json', JSON.stringify(json, null,4), err => {
            if(err) throw err;
        });
        return;

    }
    if(argv[0]=="take"){
        if(json["game"]==undefined){
            return message.channel.send("Pas de partie en cour !\nUtilisez "+prefix+"uno create pour créer un partie .");
        }
        if(json["game"].state<1){
            return message.channel.send("Partie pas encore commencé !");
        }
        let game=json.game
        let malus=game.malus;
        let player=json[message.author.id];
        if(game.order_play[0]!=message.author.id){
            return message.channel.send("Ce n'est pas a toi de jouer !")
        }
        if(malus==0){
            message.channel.send("Il n y a pas de malus a se prendre !")
        }
        if(malus>=2){
            for(let i=0;i<malus;i++){
                let ran_nb=Math.floor(Math.random() * game.nb_cards);
                player.deck.push(game.deck[ran_nb]);
                game.deck.splice(ran_nb,1);
                game.nb_cards--;
                player.nb_cards++;
            }
            game.malus=0;
        }
        if(malus<=-4){
            malus=malus*(-1);

            for(let i=0;i<malus;i++){
                let ran_nb=Math.floor(Math.random() * game.nb_cards);
                player.deck.push(game.deck[ran_nb]);
                game.deck.splice(ran_nb,1);
                game.nb_cards=game.deck.length;
                player.nb_cards++;
            }
            game.malus=0;
        }
        message.channel.send(printgame(message.author.id));
        fs.writeFile('./memory/uno.json', JSON.stringify(json, null,4), err => {
            if(err) throw err;
        });
        return;
    }
    if(argv[0]=="draw"){
        let game=json.game;
        if(game==undefined){
            return message.channel.send("Pas de partie en cour !\nUtilisez "+prefix+"uno create pour créer un partie .");
        }
        if(game.malus!=0){
            return message.channel.send("Arretes les carabistouilles et fait "+prefix+"uno take !" );
        }
        if(game.state<1){
            return message.channel.send("Pas de partie commencée !");
        }
        if(game.order_play[0]!=message.author.id){
            return message.channel.send("Pas a toi de jouer !");
        }
        if(!game.draw){
            return message.channel.send("Tu as déja pioché !");
        }
        let player=json[message.author.id];
        if(game.state%2==0){
            let last_draw=null;
            while(last_draw==null || (last_draw.charAt(0)!='M' && last_draw.charAt(0)!=game.currentcard.charAt(0) && last_draw.charAt(1)!=game.currentcard.charAt(1))){
                let ran_nb=Math.floor(Math.random() * game.nb_cards);
                let drawcard =game.deck[ran_nb];
                last_draw=drawcard;
                player.deck.push(drawcard);
                game.deck.splice(ran_nb,1);
                game.nb_cards--;
                player.nb_cards++;
            }
            message.channel.send(printgame(message.author.id));
            game.draw=false;
        }
        else{
            let ran_nb=Math.floor(Math.random() * game.nb_cards);
            player.deck.push(game.deck[ran_nb]);
            game.deck.splice(ran_nb,1);
            game.nb_cards--;
            player.nb_cards++;
            message.channel.send(printgame(message.author.id));
            game.draw=false;  
        }
        

        
        fs.writeFile('./memory/uno.json', JSON.stringify(json, null,4), err => {
            if(err) throw err;
        });
        return;
    }
    if(argv[0]=="no"){
        let game=json.game
        let player=json[message.author.id];
        if(game==undefined){
            return message.channel.send("Pas de partie en cour !\nUtilisez "+prefix+"uno create pour créer un partie .");
        }
        if(game.order_play[0]!=message.author.id){
            return message.channel.send("Pas a toi de jouer !");
        }
        if(game.state<1){
            return message.channel.send("Pas de partie commencée !");
        }
        if(json[message.author.id].nb_cards>1){
            return message.channel.send("Trop de carte pour être en Uno !");
        }
        else{
            for(let i=0;i<2;i++){
                let ran_nb=Math.floor(Math.random() * game.nb_cards);
                player.deck.push(game.deck[ran_nb]);
                game.deck.splice(ran_nb,1);
                game.nb_cards=game.deck.length;
                player.nb_cards++;
            }
        }
        let chan = message.guild.channels.cache.find(c => c.name == json[message.author.id].username);
            chan.send(printgame(message.author.id));
            fs.writeFile('./memory/uno.json', JSON.stringify(json, null,4), err => {
                if(err) throw err;
            });
        return ;
    }
    if(argv[0]=="pass"){
        let game=json.game;
        if(game==undefined){
            return message.channel.send("Pas de partie en cour !\nUtilisez "+prefix+"uno create pour créer un partie .");
        }
        if(game.state<1){
            return message.channel.send("Pas de partie commencée !");
        }
        if(game.order_play[0]!=message.author.id){
            return message.channel.send("Pas a toi de jouer !");
        }
        if(game.draw){
            return message.channel.send("Tu dois pioché avant de passer!");
        }
        if(game.state%2==0){
            return message.channel.send("Tu ne peux pas passer dans ce mode de jeu!");
        }
        let end=game.order_play.shift();
        game.order_play.push(end);
        for(let i=0;json["game"].order_play.length>i;i++){
            let id_player=game.order_play[i];
            let chan = message.guild.channels.cache.find(c => c.name == json[id_player].username);
            chan.send(printgame(id_player));
        }
        game.draw=true;
        fs.writeFile('./memory/uno.json', JSON.stringify(json, null,4), err => {
            if(err) throw err;
        });
        return;
    }
    if(argc>=1){
        
        if(json["game"]==undefined){
            return message.channel.send("Pas de partie en cour !\nUtilisez "+prefix+"uno create pour créer un partie .");
        }
        let game=json.game;
        if(json["game"].state<1){
            return message.channel.send("Partie pas encore commencée !");
        } 
        let rep;
        if(argv[1]==undefined){
            rep=play_one_move(message.author.id,argv[0]-1,null);
        }
        else{
            rep=play_one_move(message.author.id,argv[0]-1,argv[1]);
        }
        if(rep!=0){
            return message.channel.send(rep);
        }
        else{
            let win=player_win(message.author.id);
            if(win>0){
                if(json[message.author.id].classement==1){
                    message.channel.send("Tu termine premier !");
                }
                else{
                    message.channel.send("Tu termine à la "+json[message.author.id].classement+"eme place !");
                }
                let str_classement="";
                if(win==2){
                    if(game.state%3==0){
                        str_classement=str_classement+"**"+(1)+") <@"+json.game.classement[0]+">**\n";
                        var sortable = [];
                        for (let i=0 ;i<game.order_play.length;i++) {
                            sortable.push([game.order_play[i], json[game.order_play[i]].nb_cards]);
                        }
                        sortable.sort(function(a, b) {
                            return a[1] - b[1];
                        });
                        let prev_pos=1;
                        let next_pos=2;
                        let prev_nb=0;
                        for(let j=0;j<sortable.length;j++){
                            console.log(sortable[j])
                            if(prev_nb==sortable[j][1]){
                                next_pos=prev_pos;
                                console.log("meme nombre")
                            }
                            str_classement=str_classement+"**"+(next_pos)+") <@"+sortable[j][0]+">**\n";
                            prev_pos=next_pos;
                            prev_nb=sortable[j][1];
                            next_pos++;
                        }
                    }
                    else{
                        str_classement="__Classement :__\n\n"
                        for(let i=0;i<json.game.classement.length;i++){
                            str_classement=str_classement+"**"+(i+1)+") <@"+json.game.classement[i]+">**\n"
                        }
                        str_classement=str_classement+"** Dernier : <@"+json.game.order_play[0]+">**\n";
                    }
                    
                    let chan_lobby=message.channel.guild.channels.cache.find(c=> c.name=="lobby");
                    chan_lobby.send(str_classement);
                    let list_keys=Object.keys(json);
                    for(let i=0 ;i<list_keys.length;i++){
                        if(list_keys[i]!="game"){
                            let name_chan= json[list_keys[i]].username;
                            let chan=message.channel.guild.channels.cache.find(c=> c.name==name_chan);
                            if(chan!=undefined){
                                chan.delete();
                            }
                        }
                    }
                    json={};
                    fs.writeFile('./memory/uno.json', JSON.stringify(json, null,4), err => {
                        if(err) throw err;
                    });
                    return chan_lobby.send("Partie terminé !");
                }
            }
            json.game.draw=true;
        for(let i=0;json["game"].order_play.length>i;i++){
            let id_player=game.order_play[i];
            let chan = message.guild.channels.cache.find(c => c.name == json[id_player].username);
            chan.send(printgame(id_player));
        }
        fs.writeFile('./memory/uno.json', JSON.stringify(json, null,4), err => {
            if(err) throw err;
        });
        return;
        }
        

    }
}

module.exports.findn ={
    name : "uno"
}