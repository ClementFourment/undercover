import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../../game-one-device/service/game.service';
import { MOTS } from '../mots/mot-liste';
import { RouterLink } from '@angular/router';
import { GamePartieComponent } from '../game-partie/game-partie.component';

@Component({
  selector: 'app-game-alone',
  imports: [GamePartieComponent, RouterLink],
  templateUrl: './game-alone.component.html',
  styleUrl: './game-alone.component.scss'
})
export class GameAloneComponent implements OnInit{

  game;
  words: {mot1: string, mot2: string}[] = MOTS;

  constructor (private gameService: GameService) {

    this.game = this.gameService.game;
  }

  
  ngOnInit(): void {

    this.words = this.shuffleArray(this.words);
    this.words = this.shuffleWords(this.words);

    this.game().partie = 1;
  }


  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  shuffleWords(array: {mot1: string, mot2: string}[]): {mot1: string, mot2: string}[] {
    
    const shuffled = [];
    
    for (let i = 0; i < array.length; i++) {
      const j = Math.floor(Math.random() * 2);
      if (j) {
        shuffled.push(array[i]);
      }
      else {
        shuffled.push({mot1: array[i].mot2, mot2: array[i].mot1});
      }
    }
    return shuffled;
  }




  showGamePartie = true;

  newPartie() {
    this.game().partie++;
    if (this.game().partie <= this.words.length) {
      this.showGamePartie = false;
      setTimeout(() => this.showGamePartie = true, 0);
    }
    else {
      this.showGamePartie = false;
      const goBackButton = document.getElementById('goBackToMenu');
      if (goBackButton) {
        goBackButton.style.display = "block";
      }
    }
  }

}