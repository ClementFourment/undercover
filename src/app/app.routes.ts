import { Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { SelectionJoueursComponent } from './game-one-device/selection-joueurs/selection-joueurs.component';
import { GameAloneComponent } from './game-one-device/game-alone/game-alone.component';
import { CreateRoomComponent } from './game-online/create-room/create-room.component';
import { WaitingRoomComponent } from './game-online/waiting-room/waiting-room.component';
import { RoomListComponent } from './game-online/room-list/room-list.component';
import { JoiningRoomComponent } from './game-online/joining-room/joining-room.component';
import { GameComponent } from './game-online/game/game.component';


export const routes: Routes = [
    { path: 'game', component: GameComponent },
    { path: 'room-list', component: RoomListComponent },
    { path: 'joining-room', component: JoiningRoomComponent },
    { path: 'waiting-room', component: WaitingRoomComponent },
    { path: 'create-room', component: CreateRoomComponent },
    { path: 'game-alone/start', component: GameAloneComponent },
    { path: 'game-alone', component: SelectionJoueursComponent },
    { path: '', component: MenuComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
