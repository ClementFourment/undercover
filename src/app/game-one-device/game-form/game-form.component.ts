import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Joueur } from '../class/joueur';
import { Game } from '../class/game';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-game-form',
  imports: [ FormsModule, NgClass ],
  templateUrl: './game-form.component.html',
  styleUrl: './game-form.component.scss'
})
export class GameFormComponent implements OnInit{

  game!: Game;
  joueurs!: Joueur[];
  private _nbPlayer!: number;

  

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    this.game =  this.gameService.game();
    this.joueurs = this.gameService.joueurs();

    this.loadFormData();
  }
  

  checkPlayers() {
    if (this._nbPlayer !== this.game.nbJoueur) {
      this._nbPlayer = this.game.nbJoueur;
      this.loadFormData();
    }
  }

  loadFormData() {
    for(let nb = 0; nb < this.game.nbJoueur; nb++) {
      this.joueurs[nb] = ({
        id: nb,
        name: this.gameService.joueurs()[nb]?.name || '',
        role: 'alive',
        duplicate: false
      })
    }
  }
  


  onSubmit(): void {


    const hasDuplicate = this.joueurs.some((j, index) =>
      this.joueurs.findIndex((k, i) =>
        i !== index && j.name.trim().toLowerCase() === k.name.trim().toLowerCase()
      ) !== -1
    );
  
    if (hasDuplicate) {
      return;
    }

    
    this.gameService.game.set(this.game);
    this.gameService.joueurs.set(this.joueurs);
    this.router.navigate(['/game-alone/start']);
  }

  changeNombreJoueur($event:Event) {
    this.game.nbJoueur = +($event.target as HTMLInputElement).value;
    if (this.game.nbJoueur > 0) {
      this.joueurs = Array.from({ length: this.game.nbJoueur }, (_, i) => ({
        id: i + 1,
        name: '',
        role: '',
        duplicate: false
      }));
    }
  }

  checkDuplicateName(index: number): void {
    const currentName = this.joueurs[index].name.trim().toLowerCase();
    const duplicates = this.joueurs.filter((j, i) =>
      i !== index && j.name.trim().toLowerCase() === currentName
    );
    this.joueurs[index].duplicate = duplicates.length > 0;
  }

  hasDuplicateNames(): boolean {
    const names = this.joueurs.map(j => j.name.trim().toLowerCase());
    console.log(new Set(names).size !== names.length)
    return new Set(names).size !== names.length;
  }
}
