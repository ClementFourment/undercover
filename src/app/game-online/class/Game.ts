import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Player } from './Player';
import { Room } from './Room';


export class Game {

  player!: Player;

  constructor(private socket: Socket) {}

  createRoom(host: Player) {
    this.socket.emit('createRoom', host);
  }

  sendMessage(message: string): void {
    this.socket.emit('sendMessage', message);
  }

  getRoom(roomId: string){
    this.socket.emit('getRoom', roomId);
  }
  getRoomFromNothing(){
    this.socket.emit('getRoomFromNothing');
  }
  getRooms() {
    this.socket.emit('getRooms');
  }

  onGetRoom(): Observable<Room> {
    return new Observable((observer) => {
      this.socket.on('getRoom', (room: Room) => {
          observer.next(room)
      });
    });
  }
  onGetRoomFromNothing(): Observable<Room> {
    return new Observable((observer) => {
      this.socket.on('getRoomFromNothing', (room: Room) => {
          observer.next(room)
      });
    });
  }

  onGetRooms(): Observable<Room[]> {
    return new Observable((observer) => {
      this.socket.on('getRooms', (rooms: Room[]) => {
          observer.next(rooms)
      });
    });
  }
  disconnect() {
    this.socket.disconnect();
  }
  reconnect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }
  isConnected(): boolean {
    return this.socket.connected;
  }


  addPlayerToRoom(player: Player, roomId: string) {
    this.socket.emit('addPlayerToRoom', player, roomId);
  }
  removePlayerFromRoom(player: Player, roomId: string) {
    this.socket.emit('removePlayerFromRoom', player, roomId);
  }

  getIdPlayer() {
    this.socket.emit('getIdPlayer');
  }
  onGetIdPlayer(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('getIdPlayer', (idPlayer: string) => {
        observer.next(idPlayer);
      });
    });
  }
  onDisconnectPlayers(): Observable<Room> {
    return new Observable((observer) => {
      this.socket.on('disconnectPlayers', (room: Room) => {
          observer.next(room)
      });
    });
  }
  onGoBackToMenu(): Observable<null> {
    return new Observable((observer) => {
      this.socket.on('goBackToMenu', () => {
          observer.next(null)
      });
    });
  }

  onStartNewRound(): Observable<Room> {
    return new Observable((observer) => {
      this.socket.on('startNewRound', (room) => {
          observer.next(room)
      });
    });
  }

  startGame() {
    this.socket.emit('startGame');
  }
  onStartGame(): Observable<null> {
    return new Observable((observer) => {
      this.socket.on('startGame', () => {
          observer.next(null)
      });
    });
  }

  initPlayer() {
    this.socket.emit('initPlayer');
  }
  onInitPlayer(): Observable<Player> {
    return new Observable((observer) => {
      this.socket.on('initPlayer', (player: Player) => {
          observer.next(player)
      });
    });
  }






  onNewMessage(): Observable<[string, Player]> {
    return new Observable((observer) => {
      this.socket.on('newMessage', (message: string, from: Player) => {
        observer.next([message, from]);
      });
    });
  }
}
