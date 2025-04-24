import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../class/Game';
import { Player } from '../class/Player';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GameService } from '../service/game.service';
import { Room } from '../class/Room';

@Component({
  selector: 'app-waiting-room',
  imports: [RouterLink],
  templateUrl: './waiting-room.component.html',
  styleUrl: './waiting-room.component.scss'
})
export class WaitingRoomComponent implements OnInit, OnDestroy {

  game!: Game;
  host!: Player;
  id!: string;
  room!: Room;

  constructor(private gameService: GameService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {

    this.host = new Player({id: "", name: '', card: {role: '', word: ''}, isAlive: true});
    this.route.queryParams.subscribe(params => {
      this.host.setName(params['pseudo']);
      if (!this.host.name) {
        this.router.navigate(['/']);
      }
    });

    this.game = this.gameService.game();

    if (!this.game.isConnected()) {
      this.game.reconnect();
    }

    this.game.createRoom(this.host);


    this.game.onGetIdPlayer().subscribe((id) => {
      
      this.id = id;
      
    });
    this.game.onGetRoom().subscribe((room) => {
      
      this.room = room;
      
    });

    this.game.onStartGame().subscribe(() => {
      this.router.navigate(['/game'])
    });

  }
  
  isEnoughPlayers(): boolean {
    return this.room.players.length >= 3;
  }
  
  
  ngOnDestroy(): void {
    // this.game.disconnect();
  }
}
