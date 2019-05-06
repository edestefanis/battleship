import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'

import { UserGame } from '../types'
import { GameService } from '../game.service'
import { UserService } from '../user.service';

@Component({
  selector: 'app-active-list',
  templateUrl: './active-list.component.html',
  styleUrls: ['./active-list.component.css']
})
export class ActiveListComponent implements OnInit {
  games: Observable<UserGame[]>;

  constructor(public gameService: GameService, public userService: UserService) {}

  ngOnInit() {
    this.games = this.gameService.getUserGames(this.userService.getCurrentUserId())
    console.log(this.games)
  }
}
