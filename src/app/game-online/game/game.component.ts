import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../class/Game';
import { GameService } from '../service/game.service';
import { Router, RouterLink } from '@angular/router';
import { Room } from '../class/Room';
import { Player } from '../class/Player';
import { ChatComponent } from "../chat/chat.component";
import { Word } from '../class/Word';
import { WordPairs, words } from '../interface/wordList';
import { Card } from '../class/Card';
import { NgClass, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [RouterLink, ChatComponent, ChatComponent, TitleCasePipe, NgClass],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit, OnDestroy{

  
  game!: Game;
  word!: Word;
  room!: Room;
  isCardHidden: boolean = true;
  wordsRound!: {wordCivil: string, wordUndercover: string};
  availableWords!: WordPairs[];

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit(): void {

    this.word = new Word();
    this.game = this.gameService.game();
    if (!this.game.isConnected()) {
      this.router.navigate(['/']);
    }

    this.game.onInitPlayer().subscribe((player) => {
      console.log('initPlayer')
      this.game.player = player;
      this.startFirstRound();
    });
    this.game.onGetRoomFromNothing().subscribe((room) => {
      console.log("onGetRoomFromNothing")
      this.room = room;
    });
    this.game.onDisconnectPlayers().subscribe((room) => {
      if (room.players.length < 3) {
        this.router.navigate(['/'])
      }
    });
    this.game.onGoBackToMenu().subscribe(() => {
      this.router.navigate(['/'])
    });
    this.game.onNewRound().subscribe((room) => {
      this.room = room;
    });

    this.game.onGetRoles().subscribe((players) => {

      const _player = players.find(player => player.id == this.game.player.id);
      if (_player) {
        this.game.player = _player;
      }
    });

    this.game.getRoomFromNothing();
    this.game.initPlayer();
    
  }

  startFirstRound() {


    this.game.newRound();
    this.availableWords = words;
    /** Premier Round */
    // Si c'est le host, alors on va faire choisir le mot d'ici
    if (this.game.player.id == this.room.idHost) {
      [this.wordsRound, this.availableWords] = this.word.chooseWords(this.availableWords);
      this.game.getRoles(this.wordsRound);
    }
  }
  toggleCardVisibility() {
    this.isCardHidden = !this.isCardHidden;
  }
  ngOnDestroy(): void {
    // this.game.removePlayerFromRoom(this.player, this.room.idHost);
    this.game.disconnect();
  }
}
