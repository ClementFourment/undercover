import { Injectable, signal, WritableSignal  } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Game } from '../class/Game';


@Injectable({
  providedIn: 'root'
})

export class GameService {

  socket: Socket = io('http://localhost:3000', {
    transports: ['websocket'], 
  });

  
  
  game = signal(new Game(this.socket));
    


  


}