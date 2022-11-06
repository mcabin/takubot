const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const Discord= require('discord.js');
const fs=require("fs");
const config=require('../config.json');
let prefix=config.prefix;


let json=require("../memory/tictacto.json");

function play_one_move(i,j,id){
    console.log("start play_one_move")
    let tictacto=json["tictacto"+i];
    let game=json["game"];
    let p=idtoplayer(id);
    if(i>8 || i<0 ||j>8 ||j<0){
        return "Tu as joué une case invalide";
    }
    if(p==0){
        return "<@"+id+"> ne fait pas parti des joueurs!"
    }
    if(p!=game.curr_player){
        return "C'est au tour du joueur "+game.curr_player;
    }
    if(game.next_tictacto!=-1 && game.next_tictacto!=i){
        let printint=parseInt(game.next_tictacto)+1;
        return "Tu dois joué dans le morpion "+printint;
    }
    if(tictacto.state!=0){
        let printi=parseInt(i)+1;
        return "Le morpion "+printi +" est déja gagnée";
    }
    if(tictacto.tabTTT[j]!=0){
        let printi=parseInt(i)+1;
        let printj=parseInt(j)+1;
        return "La case "+printj+" du morpion "+printi+"a déja été joué";
    }
    tictacto.tabTTT[j]=p;
    
    if(p==1){
        game.curr_player=2;
    }
    else{
        game.curr_player =1;
    }
    if(tictactowin(i)){
        console.log("gagne "+i)
        if(utictactowin()){
            console.log("Victoire")
            return game.state;
        }
    }
    console.log("juste avant set_next");
    set_next_ttt(j);

    return 0;

}

async function set_next_ttt(j){
    console.log("Set next ttt")
    if(json["tictacto"+j].state==0){
        json.game.next_tictacto=j;
    }
    else{
        json.game.next_tictacto=-1;
    }
    return
}

function ucompare(a,b,c){
    let ttta=json["tictacto"+a].state;
    let tttb=json["tictacto"+b].state;
    let tttc=json["tictacto"+c].state;
    if(ttta==tttb &&ttta==tttc && ttta!=0){
        json.game.state=ttta;
        console.log(a,b,c);
        return true;
    }
    return false;
}

function utictactowin(){
    if(ucompare(0,1,2) || ucompare(3,4,5) || ucompare(6,7,8) || ucompare(0,3,6) || ucompare(1,4,7) || ucompare(2,5,8) || ucompare(0,4,8) || ucompare(2,4,6)){
        return true;
    }for(let j=0;j<9;j++){
        if(json["tictacto"+j].state==0){
            return false;
        }
    }
    json.game.state=3;
    return true;
}

function compare3(a,b,c,i){
    let tictacto=json["tictacto"+i];
    let tab=tictacto.tabTTT;
    if(tab[a]==tab[b] && tab[b]==tab[c] && tab[a]!=0){
        console.log(tab[a])
        json["tictacto"+i].state=tab[a];
        return true;
    }
    return false;
}

function tictactowin(i){
    console.log("Gagne start")
    if(compare3(0,1,2,i) || compare3(3,4,5,i) || compare3(6,7,8,i) || compare3(0,3,6,i) || compare3(1,4,7,i) || compare3(2,5,8,i)  || compare3(0,4,8,i) || compare3(2,4,6,i)){
        return true;
    }
    for(let j=0;j<9;j++){
        if(json["tictacto"+i].tabTTT[j]==0){
            console.log("gagne fin")
            return false;
        }
    }
    json["tictacto"+i].state=-1;
    return true;
}
function printtable(){
    let rm="```\n"
    for(let i=0;i<3;i++){
        rm=rm+"_________________________________________________________\n";
        for(let j=0;j<3;j++){
            rm=rm+"|     |     |     ||     |     |     ||     |     |     |\n";
            rm=rm+"|  "+case_print(i*3,j*3)+"  |  "+case_print(i*3,j*3+1)+"  |  "+case_print(i*3,j*3+2)+"  ||  "+case_print(i*3+1,j*3)+"  |  "+case_print(i*3+1,j*3+1)+"  |  "+case_print(i*3+1,j*3+2)+"  ||  "+case_print(i*3+2,j*3)+"  |  "+case_print(i*3+2,j*3+1)+"  |  "+case_print(i*3+2,j*3+2)+"  |\n";
            rm=rm+"|_____|_____|_____||_____|_____|_____||_____|_____|_____|\n";
        }
    }
    rm=rm+"```\n";
    return rm;
}

function get_case(i,j){
    let tictacto=json["tictacto"+i];
    return tictacto.tabTTT[j];
}
function case_print(i,j){
    let p=get_case(i,j);
    if(1==p){
        return "O";
    }
    if(2==p){
        return "X";
    }
    else{
        return "-";
    }
}
function create_new_game(){
    json["game"]={
        player1:null,
        player2:null,
        curr_player:1,
        next_tictacto:-1,
        state:0
    }
    
    for(let j=0;j<9;j++){
        let tab=[];
        for(let i=0;i<9;i++){
            tab[i]=0;
        }
        let tictacto="tictacto"+j;
        json[tictacto]={
            tabTTT:tab,
            state:0
        }
    }
}

function delete_game(){
    json.game.player1=null;
    json.game.player2=null;
    json.game.state=-1;
    for(let j=0;j<9;j++){
        let tictacto="tictacto"+j;
        delete json[tictacto];
    }
    
}

function idtoplayer(id){
    if(json.game.player1==id){
        return 1
    }
    if(json.game.player2==id){
        return 2;
    }
    else return 0;
}
function playertoid(p){
    if(p==2){
        return json.game.player2;
    }
    else{
        return json.game.player1;
    }
}
function next_turn(){
    let rep= "C'est au tour de <@"+playertoid(json.game.curr_player)+"> de jouer!\n";
    if(json.game.next_tictacto==-1){
        rep=rep+"Tu peux jouer sur n'importe quelle morpion"
    }
    else{
        let nextint=parseInt(json.game.next_tictacto)+1
        rep=rep+"Tu dois jouer sur le morpion "+nextint;
    }
    return rep;
}
module.exports.run = async (bot,message,args,argv) =>{
    if(args[0]=="create"){
        if(json.game==undefined || json.game.state==-1){
            create_new_game();
            json.game.player1=message.author.id
            fs.writeFile("./memory/tictacto.json", JSON.stringify(json, null,4), err => {
                if(err) throw err;
             });
             return message.channel.send("<@"+json.game.player1+"> a crée une parti et est le joueur 1\n Pour rejoindre la parti utilisé la commande: "+prefix+"play join");
        }
        return message.channel.send("Un jeu est déja crée");
    }
    if(args[0]=="join"){
        if(json.game==undefined || json.game.state==-1){
            return message.channel.send("Il faut d'abord créer une partie.\nCommande :"+prefix+"play create");
        }
        if(json.game.player1==message.author.id){
            message.channel.send("<@"+json.game.player1+"> tu dois trouver un ami pour jouer!");
            return message.channel.send("https://tenor.com/view/milkandmocha-cry-sad-tears-upset-gif-11667710");
            
        }
        if(json.game.player2!=null){
            return message.channel.send("Il y a déja deux joueur dans la partie !");
        }
        else{
            json.game.player2=message.author.id;
            message.channel.send("<@"+json.game.player2+"> est le joueur 2");
            message.channel.send(printtable());
            message.channel.send(next_turn());

            fs.writeFile("./memory/tictacto.json", JSON.stringify(json, null,4), err => {
                if(err) throw err;
             });
             return
        }
    }
    if(args[0]=="help"){
        let helps=prefix+"play create : créé une partie si aucune partie n'est en cours, l'executeur de la commande devient le joueur 1\n";
        helps=helps+prefix+"play join : si une partie existe et qu'il n'y a pas pas de deuxiéme l'executeur de la commande devient le jouer 2 et la partie commence\n";
        helps=helps+prefix+"play stop : arrête la partie en cours\n\n"
        helps=helps+"La partie se déroule dans un morpion géant qui a pour case 9 sous-morpions. Gagner un sous-morpion permet de remplir la case qu'il représente dans le grand morpion.\n"
        helps=helps+"Pour jouer un coup utiliser la commande "+ prefix+"play <coordonnée du sous-morpion> <coordonnée de la case du sous-morpion>\n "
        helps=helps+"```\n|     |     |     |\n|  1  |  2  |  3  |\n|_____|_____|_____|\n|     |     |     |\n|  4  |  5  |  6  |\n|_____|_____|_____|\n|     |     |     |\n|  7  |  8  |  9  |\n|     |     |     |\n```"
        return message.channel.send(helps);
    }
    if(args[0]=="stop"){
        if(json.game==undefined || json.game.state==-1){
            return message.channel.send("Pas de partie en cour.");
        }
        delete_game();
        fs.writeFile("./memory/tictacto.json", JSON.stringify(json, null,4), err => {
            if(err) throw err;
         });
         return message.channel.send("La partie est annulé");
    }
    if(argv==2){
        if(json.game==undefined || json.game.state==-1){
            return message.channel.send("Pas de partie en cour.");
        }
        console.log("Avant play one move")
        
        let handle=play_one_move(parseInt(args[0])-1,parseInt(args[1])-1,message.author.id);
        console.log("Apres play one move")
        if(handle!=0){
            if(handle==1 || handle==2){
                message.channel.send("<@"+playertoid(handle)+"> a gagner !");
                message.channel.send(printtable());
                delete_game();
                fs.writeFile("./memory/tictacto.json", JSON.stringify(json, null,4), err => {
                    if(err) throw err;
                 });
                 return
            }
            if(handle==3){
                message.channel.send("Match nul !");
                message.channel.send(printtable());
                delete_game();
                fs.writeFile("./memory/tictacto.json", JSON.stringify(json, null,4), err => {
                    if(err) throw err;
                 });
                 return
            }
            else{
                    return message.channel.send(handle);
                }
        }
        else{
            message.channel.send(printtable());
            message.channel.send(next_turn());
            fs.writeFile("./memory/tictacto.json", JSON.stringify(json, null,4), err => {
                if(err) throw err;
             });
            return
        }
    }
    fs.writeFile("./memory/tictacto.json", JSON.stringify(json, null,4), err => {
        if(err) throw err;
     });
    
    }

    module.exports.findn ={
        name : "play"
    }