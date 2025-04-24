import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../class/Game';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Room } from '../class/Room';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-room-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss'
})
export class RoomListComponent implements OnInit, OnDestroy{

  pseudo: string = "";
  game!: Game;
  rooms: Room[] = [];

  constructor(private gameService: GameService, private router: Router){}

  ngOnInit(): void {

    
    this.game = this.gameService.game();

    if (!this.game.isConnected()) {
      this.game.reconnect();
    }
    
    this.game.getRooms();


    this.game.onGetRooms().subscribe((rooms) => {
      
      this.rooms = rooms;
      
    });
  }

  isTooMuchPlayers(room: Room): boolean {
    return room.players.length >= 9;
  }

  ngOnDestroy(): void {
    // this.game.disconnect();
  }

  goToJoiningRoom(room: Room) {
      this.router.navigate(['/joining-room'], {
      queryParams: { pseudo: this.pseudo, roomId: room.idHost }
    });
  }
  
}
