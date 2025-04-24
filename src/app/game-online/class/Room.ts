import { Player } from "./Player";


export class Room {
    idHost!: string;
    players!: Player[];
    isInGame!: boolean;
}