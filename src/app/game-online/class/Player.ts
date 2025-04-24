import { Card } from "./Card";



export class Player {

    public id!: string;
    public name!: string;
    public card!: Card;
    public isAlive: boolean = true;
    
    constructor(data: { id: string, name: string; isAlive: boolean; card: Card }) {
        this.id = data.id;
        this.name = data.name;
        this.isAlive = data.isAlive;
        this.card = data.card;
      }

    public setName (name: string) {
        this.name = name;
    }
    public getName () {
        return this.name;
    }
    public getCard () {
        return this.card;
    }
    public selectCard (card: Card) {
        this.card = card;
    }
    public vote(player: Player) {
        console.log(`${this.name} vote pour ${player.name}`)
    }
    public guess(word: string): boolean {
        if (this.card.role != "mrwhite") {
            return false;
        }
        return false;
    }
}
