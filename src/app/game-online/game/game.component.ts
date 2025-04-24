import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../class/Game';
import { GameService } from '../service/game.service';
import { Router, RouterLink } from '@angular/router';
import { Room } from '../class/Room';
import { Player } from '../class/Player';
import { ChatComponent } from "../chat/chat.component";

@Component({
  selector: 'app-game',
  imports: [RouterLink, ChatComponent, ChatComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit, OnDestroy{

  
  game!: Game;
  room!: Room;

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit(): void {

    this.game = this.gameService.game();
    if (!this.game.isConnected()) {
      this.router.navigate(['/']);
    }

    this.game.onInitPlayer().subscribe((player) => {
      this.game.player = player;
    });
    this.game.onGetRoomFromNothing().subscribe((room) => {
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
    this.game.onStartNewRound().subscribe((room) => {
      this.room = room;
    });
    this.game.getRoomFromNothing();
    

    this.game.initPlayer();
  }
  ngOnDestroy(): void {
    // this.game.removePlayerFromRoom(this.player, this.room.idHost);
    this.game.disconnect();
  }
}
