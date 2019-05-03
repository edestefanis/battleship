import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'

import { UserGame } from '../types'
import { GameService } from '../game.service'

@Component({
  selector: 'app-active-list',
  templateUrl: './active-list.component.html',
  styleUrls: ['./active-list.component.css']
})
export class ActiveListComponent implements OnInit {
  games: Observable<UserGame[]>;

  userId = "5cc8ae000e2786e8f3ab32a4"


  constructor(public gameService: GameService) {}

  ngOnInit() {
    console.log('holanda, preparando juegos...')
    this.games = this.gameService.getUserGames(this.userId)
    console.log('finished holanda')
    console.log(this.games)
  }
}
