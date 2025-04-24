import { Component, Input, NgModule, OnInit } from '@angular/core';
import { Game } from '../../game-one-device/class/game';
import { Joueur } from '../../game-one-device/class/joueur';
import { Router, RouterLink } from '@angular/router';
import { GameService } from '../../game-one-device/service/game.service';
import { NgClass } from '@angular/common';
import { MOTS } from '../mots/mot-liste';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-game-partie',
  imports: [RouterLink, NgClass, FormsModule],
  templateUrl: './game-partie.component.html',
  styleUrl: './game-partie.component.scss'
})
export class GamePartieComponent implements OnInit{

  @Input() word!: { mot1: string; mot2: string };

  guess = '';
  game;
  joueurs;
  nbToPick!: number;
  roleOrder: number[] = [];
  roles: string[] = [];
  playerOrder: number[] = [];
  activeIndex: number | null = null;
  activeElimination: boolean = false;


  playerRoles: { joueur: Joueur; role: string }[] = [];

  constructor(private gameService: GameService) {
    this.game = this.gameService.game;
    this.joueurs = this.gameService.joueurs;
  }

  ngOnInit(): void {

    

    this.game().tour = 0;
    this.nbToPick = this.game().nbJoueur;

    // initialisation des tableaux
    for (let i = 0; i < this.game().nbJoueur; i++) {
      this.playerOrder.push(i);
      this.roleOrder.push(i);
    }

    this.playerOrder = this.shuffleArray(this.playerOrder);
    this.game().joueurEnCours = this.joueurs()[this.playerOrder[0]];

    this.roleOrder = this.shuffleArray(this.roleOrder);
    

    const nbCivil = Math.floor(this.game().nbJoueur * 0.7);
    const nbUndercover = Math.ceil((this.game().nbJoueur - nbCivil)/2);
    const nbMrWhite = (this.game().nbJoueur - nbCivil - nbUndercover);

    for (let i = 0; i < nbCivil; i++) {
      this.roles.push('civil');
    }
    for (let i = 0; i < nbUndercover; i++) {
      this.roles.push('undercover');
    }
    for (let i = 0; i < nbMrWhite; i++) {
      this.roles.push('mrwhite');
    }
  }
  closeOverlay() {
    const activeElimination = document.getElementById('activeElimination');
    this.activeElimination = false;
    if (activeElimination) {
      activeElimination.style.display = "none";
    }
    this.checkVictory();
  }
  closeOverlayEndGame() {
    const endGame = document.getElementById('endGame');
    if (endGame) {
      endGame.style.display = "none";
    }
  }
  
  closeOverlayAndContinue() {
    const card = document.getElementById('role'+this.activeIndex);
    if(card) {
      card.getElementsByClassName('secretPick')[0].textContent = this.game().joueurEnCours?.name || null;
      card.classList.add('selected');
    }
    this.activeIndex = null;
    if (this.nbToPick > 0) {
        this.nbToPick--;
        this.game().joueurEnCours = this.joueurs()[this.playerOrder[this.game().nbJoueur - this.nbToPick]];
    }
    if (this.nbToPick == 0) {
      this.game().tour = 1;
      this.playerRoles = this.shuffleArray(this.playerRoles);
      while(this.playerRoles[0].role == 'mrwhite') {
        console.log(this.playerRoles)
        this.playerRoles = this.shuffleArray(this.playerRoles);
      }
      console.log(this.playerRoles)
    }
  }

  selectCard(index:number) {
    const card = document.getElementById('role'+index);
    if (card?.classList.contains('selected') || card?.classList.contains('active')) {
      return;
    }

    this.activeIndex = index;

    this.playerRoles.push({
      joueur: this.joueurs()[this.playerOrder[this.game().nbJoueur - this.nbToPick]],
      role: this.roles[this.roleOrder[index]]
    })
    this.playerRoles.map(player => player.joueur.role = "alive");

    console.log(this.playerRoles)
    if(card) {
      const tmp = this.roles[this.roleOrder[index]] || null;
      const _role = this.playerRoles[this.playerRoles.length - 1].role;
      if (_role == "civil") {
        card.getElementsByClassName('secretPick')[0].textContent = this.word.mot1;
      }
      if (_role == "undercover") {
        card.getElementsByClassName('secretPick')[0].textContent = this.word.mot2;
      }
      if (_role == "mrwhite") {
        card.getElementsByClassName('secretPick')[0].textContent = "Vous êtes Mr. White";
      }
    }
  }

  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  goBack() {

    const overlay = document.getElementById('overlayLeave');
    if (overlay) {
      overlay.style.display = "block";
    }
    
  }
  closeOverlayLeave() {
    const overlay = document.getElementById('overlayLeave');
    if (overlay) {
      overlay.style.display = "none";
    }
  }

  afficheEliminer() {
    const eliminerBtn = document.getElementById('eliminer') as HTMLButtonElement;
    if (eliminerBtn) {
      eliminerBtn.disabled = false;
    }
    
  }
  
  eliminer() {
    const eliminerBtn = document.getElementById('eliminer') as HTMLButtonElement;
    if (eliminerBtn) {

      eliminerBtn.disabled = true;

      const radios = document.getElementsByClassName('selectPlayer');
      const cards = document.getElementsByClassName('card');
      const radioCheckedId = "";
      for (let i = 0; i < radios.length; i++) {

        if((radios[i] as HTMLInputElement).checked) {

          
          (radios[i] as HTMLInputElement).checked = false;
          (radios[i] as HTMLInputElement).disabled = true;
          cards[i].classList.add('eliminated');
          (cards[i] as HTMLInputElement).disabled = true;
          cards[i].getElementsByClassName('secretPick')[0].innerHTML += '<br><i>'+this.playerRoles[i].role+'<i>'


          console.log(this.playerRoles[i].joueur.name);
          this.playerRoles[i].joueur.role = "eliminated";

          if (this.playerRoles[i].role == "mrwhite") {
            
            this.guessMrWhite();
          }
          else {

            this.afficheRole(i);

            
          }
        }
      }
    }
  }

  afficheRole(playerNb: number) {
    this.activeElimination = true;
    const activeElimination = document.getElementById('activeElimination');
    const afficheElimination = document.getElementById('afficheElimination');
    
    if (activeElimination && afficheElimination) {
      activeElimination.style.display = "block";
      afficheElimination.innerHTML = this.playerRoles[playerNb].joueur.name + " a été élimné.<br>C'était un <b>" + this.playerRoles[playerNb].role + " !</b>";
    }
  }
  guessMrWhite() {
    
    const activeMrWhiteGuess = document.getElementById('activeMrWhiteGuess');
    if (activeMrWhiteGuess) {
      activeMrWhiteGuess.style.display = "block";
    }
  }
  
  guessMrWhiteAlt() {
    
    const activeMrWhiteGuess = document.getElementById('activeMrWhiteGuessAlt');
    if (activeMrWhiteGuess) {
      activeMrWhiteGuess.style.display = "block";
    }
  }

  compareStrings(str1: string, str2: string): boolean {
    const normalize = (str: string) =>
      str
        .toLowerCase()
        .normalize("NFD") // décompose les accents
        .replace(/[\u0300-\u036f]/g, "") // supprime les accents
        .replace(/\s/g, ""); // supprime les espaces
  
    return normalize(str1) === normalize(str2);
  }

  guessMrWhiteValider() {
    const activeMrWhiteGuess = document.getElementById('activeMrWhiteGuess');
    
    console.log(this.guess);
    if (this.compareStrings(this.guess, this.word.mot1)) {
      this.endGame('Mr. White');
    }

    if (activeMrWhiteGuess) {
      activeMrWhiteGuess.style.display = "none";
    }
    this.guess = '';
  }
  guessMrWhiteValiderAlt() {
    const activeMrWhiteGuess = document.getElementById('activeMrWhiteGuessAlt');
    if (this.compareStrings(this.guess, this.word.mot1)) {
      this.endGame('Mr. White');
    }
    else {
      console.log('non')
      this.playerRoles[this.playerRoles.findIndex((element) => element.role == "mrwhite")].joueur.role = "eliminated";
      this.checkVictory();
    }

    if (activeMrWhiteGuess) {
      activeMrWhiteGuess.style.display = "none";
    }
    this.guess = '';
  }
  checkVictory() {
    console.log(this.playerRoles)
    const nbEliminated = this.playerRoles.filter(obj => obj.joueur.role == "eliminated").length;
    const nbAlive = this.playerRoles.filter(obj => obj.joueur.role == "alive").length;

    const nbCivil = this.playerRoles.filter(obj => obj.role == "civil")
                                    .filter(obj => obj.joueur.role == "alive")
                                    .length;
    const nbMrWhite = this.playerRoles.filter(obj => obj.role == "mrwhite")
                                      .filter(obj => obj.joueur.role == "alive")
                                      .length;
    const nbUndercover = this.playerRoles.filter(obj => obj.role == "undercover")
                                         .filter(obj => obj.joueur.role == "alive")
                                         .length;
    if (nbUndercover + nbMrWhite == 0) {
      this.endGame('civil');
      console.log("victoire des civils")
    }
    if (nbCivil == 0) {
      this.endGame('undercover');
      console.log("victoire des méchants")
    }
    if (nbCivil == 1 && nbAlive == 1) {
      this.endGame('civil');
      console.log("victoire des civils")
    }
    if (nbAlive == 2) {
      if (nbCivil == 2) {
        this.endGame('civil');
        console.log("victoire des civils")
      }
      else if (nbCivil == 1 && nbMrWhite == 1) {
        this.guessMrWhiteAlt();
      }
      else {
        this.endGame('undercover');
        console.log("victoire des méchants")
      }
    }

  }

  endGame(winner: string) {
    const nextGameButton = document.getElementById('partieSuivante');
    const afficheEndGame = document.getElementById('afficheEndGame');
    const endGame = document.getElementById('endGame');
    const eliminer = document.getElementById('vote');
    const inputs = document.getElementsByClassName('selectPlayer') as HTMLCollectionOf<HTMLInputElement>;

    if (winner == "Mr. White") {
      if (endGame && afficheEndGame) {
        endGame.style.display = 'block';
        afficheEndGame.innerHTML = "Fin de la partie.<br>Victoire de <b>Mr.White</b> !<br><small><i>mots : "+this.word.mot1+" / "+this.word.mot2+"</i></small>";
      
        
        inputs[this.playerRoles.findIndex((element) => element.role == "mrwhite")].checked = true;
        inputs[this.playerRoles.findIndex((element) => element.role == "mrwhite")].style.borderColor = "#20ff20";
        const childofnext = inputs[this.playerRoles.findIndex((element) => element.role == "mrwhite")]?.nextSibling?.firstChild as HTMLDivElement;
        if (childofnext) {
          childofnext.className = "card blue";
        }
      }
    }
    else {
      if (endGame && afficheEndGame) {
        endGame.style.display = 'block';
        afficheEndGame.innerHTML = "Fin de la partie.<br>Victoire des <b>" + winner.toUpperCase() +"S</b><br><small><i>mots : "+this.word.mot1+" / "+this.word.mot2+"</i></small>";
      }
    }
    

    if (nextGameButton) {
      nextGameButton.style.display = 'inline-block';
    }
    if (eliminer) {
      eliminer.style.display = 'none';
    }
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }
  } 
}

