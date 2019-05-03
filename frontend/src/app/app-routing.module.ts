import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveListComponent } from './active-list/active-list.component';
import { GameComponent } from './game/game.component';


const routes: Routes = [
  { path: '', component: ActiveListComponent },
  { path: 'game/:gameId', component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
