import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Game } from '../game-online/class/Game';
import { GameService } from '../game-online/service/game.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{

  game!: Game;

  constructor (private gameService: GameService) {}


  ngOnInit(): void {
    
    this.game = this.gameService.game();
    this.game.disconnect();
  }
}
