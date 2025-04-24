import { Joueur } from "./joueur";

export class Game {

    id!: number;
    partie: number = 0;
    tour: number = 0;
    nbJoueur!: number;
    nbCivil!: number;
    nbUndercover!: number;
    nbMrWhite!: number;
    joueurEnCours?: Joueur;
}
