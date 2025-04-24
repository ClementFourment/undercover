import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io('https://706c-2a04-cec2-b-a31d-7937-4964-c346-994e.ngrok-free.app', {
      transports: ['websocket'], // optionnel mais parfois utile
    });
  }

  sendMessage(message: string): void {
    this.socket.emit('sendMessage', message);
  }

  onMessage(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('newMessage', (data: string) => {
        observer.next(data);
      });
    });
  }
}
