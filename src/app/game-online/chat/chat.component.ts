import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService } from '../service/game.service';
import { NgClass } from '@angular/common';
import { Game } from '../class/Game';
import { Player } from '../class/Player';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})


export class ChatComponent implements OnInit, AfterViewChecked {
  message = '';
  messages: {message: string, from: Player}[] = [];
  isChatActive: boolean = false;
  shouldScroll: boolean = false;
  game!: Game;

  constructor(private gameService: GameService) {}

  ngOnInit() {

    this.game = this.gameService.game();

    this.game.onNewMessage().subscribe(([message, from]) => {
      this.messages.push({message, from})
      this.shouldScroll = true;
    });
  }
  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollDownChat();
      this.shouldScroll = false;
    }
  }

  send() {
    if (this.message.trim()) {
      this.game.sendMessage(this.message);
      this.message = '';
    }
  }




  deployChat() {
    this.isChatActive = !this.isChatActive;
  }
  scrollDownChat() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
}
