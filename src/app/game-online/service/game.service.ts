import { Injectable, signal, WritableSignal  } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Game } from '../class/Game';


@Injectable({
  providedIn: 'root'
})

export class GameService {

  socket: Socket = io('https://706c-2a04-cec2-b-a31d-7937-4964-c346-994e.ngrok-free.app', {
    transports: ['websocket'], 
  });
  
  game = signal(new Game(this.socket));
    


  


}