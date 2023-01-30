## Takubot
Takubot est un bot Discord développé sur  node.js et utilisant [l'API discord](https://discord.com/developers/docs/intro), il peut être ajouté sur un serveur Discord permettant aux utilisateurs d'utiliser des commandes suplémentaires.

## Commande
Pour lancer une commande du takubot on utilise la syntaxe ``` $commandName ```.
### clear
La commande clear permet de supprimer plusieur message d'un seul coup . Elle prend comme paramètre le nombre de message a supprimer. Seul les utilisateurs pouvant supprimer les messages des autres utilisateurs peuvent utiliser cette commandes.
### play
La commande play permet de lancer et jouer au jeu du super tic-tac-toe .
#### Régle
La partie se déroule dans un grand morpion qui a pour case 9 sous-morpions. Gagner un sous-morpion permet de remplir la case qu'il représente dans le grand morpion.
L'objectif est de gagner le grand morpion.

![Alt text](/images/plateauTTT.png "Optional Title")

Quand un joueur remplit une case dans un sous-morpion, l'adversaire doit jouer dans le sous-morpion correspondant à cette case . (Par exemple, si il joue dans la case 1 l'adversaire doit jouer dans le sous-morpion 1). Si la case correspond à un sous-morpion terminée alors l'adversaire peut choisir le morpion ou il joue.

### uno

Une version textuel du Uno