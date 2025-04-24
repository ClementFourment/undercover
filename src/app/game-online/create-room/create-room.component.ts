import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-room',
  imports: [FormsModule, RouterLink],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.scss'
})
export class CreateRoomComponent {

  pseudo: string = '';

  constructor(private router: Router) {}

  


  goToWaitingRoom() {
    this.router.navigate(['/waiting-room'], {
      queryParams: { pseudo: this.pseudo }
    });
  }
}
