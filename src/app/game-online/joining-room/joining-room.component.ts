import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Game } from '../class/Game';
import { GameService } from '../service/game.service';
import { Room } from '../class/Room';
import { Player } from '../class/Player';

@Component({
  selector: 'app-joining-room',
  imports: [RouterLink],
  templateUrl: './joining-room.component.html',
  styleUrl: './joining-room.component.scss'
})
export class JoiningRoomComponent implements OnInit, OnDestroy{

  pseudo!: string;
  roomId!: string;
  game!: Game;
  room!: Room;
  player!: Player;
  constructor(private gameService: GameService, private route: ActivatedRoute, private router: Router) {}


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.pseudo = params['pseudo'];
      this.roomId = params['roomId'];

      if (!this.pseudo || !this.roomId) {
        this.router.navigate(['/']);
      }
    });

    this.game = this.gameService.game();

    if (!this.game.isConnected()) {
      this.game.reconnect();
    }



    this.player = new Player({id: '', name: this.pseudo, isAlive: true, card: {word: '', role: ''}});

    this.game.addPlayerToRoom(this.player, this.roomId);


    this.game.getRoom(this.roomId);
    
    this.game.onGetRoom().subscribe((room) => {
      this.room = room;
      if (room.isInGame) {
        this.router.navigate(['/']);
      }
    });

    this.game.onStartGame().subscribe(() => {
      this.router.navigate(['/game'])
    });

    this.game.onDisconnectPlayers().subscribe((room) => {
      this.room = room;
      this.router.navigate(['/room-list']);
    });
    
    
    

  }
  ngOnDestroy(): void {
    // faut virer le perso de la liste avant qu'il se déco
    // this.game.removePlayerFromRoom(this.player, this.roomId);
  }
  


}
