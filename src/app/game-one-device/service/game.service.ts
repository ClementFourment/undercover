import { Injectable, signal, WritableSignal  } from '@angular/core';
import { Game } from '../class/game';
import { Joueur } from '../class/joueur';


@Injectable({
  providedIn: 'root'
})

export class GameService {

  game = signal<Game>({id: 0, 
    partie: 0,
    tour: 0,
    nbJoueur: 3,
    nbCivil: 0,
    nbUndercover: 0,
    nbMrWhite: 0});
    
  joueurs = signal<Joueur[]>([]);


  


}