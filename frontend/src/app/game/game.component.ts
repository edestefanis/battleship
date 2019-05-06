import { Component, OnInit } from '@angular/core'
import { GameService } from '../game.service'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'

import { UserGame } from '../types'
import { UserService } from '../user.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  private gameId: String;
  game: Observable<UserGame>;

  constructor(public gameService: GameService,
              public userService: UserService,
              public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('gameId')) {
        this.gameId = paramMap.get('gameId')
      }
    })
    console.log('fetching game')
    this.game = this.gameService.getFullUserGame(this.userService.getCurrentUserId(),
                                                 this.gameId)
    console.log(this.game)
    console.log('after logging')
  }

  fireTorpedo(event: Event) {
    return
  }

}


