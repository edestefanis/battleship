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
  game: UserGame;

  constructor(public gameService: GameService,
              public userService: UserService,
              public route: ActivatedRoute) {
    this.game = {gameId: '', status: '', opponentName: '', opponentBoard: [], playerBoard: []}
  }

  async ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('gameId')) {
        this.gameId = paramMap.get('gameId')
      }
    })
    console.log('fetching game')
    this.game = await this.gameService.getFullUserGame(this.userService.getCurrentUserId(),
                                                 this.gameId)
    console.log(this.game)
    console.log('after logging')
  }

  async onTileClick(event: Event) {
    console.log('tile click! :D')
    let id = (event.target as HTMLTableElement).id,
      row = parseInt(id.substring(1,2)), col = parseInt(id.substring(3,4)),
      value = (event.target as HTMLTableElement).textContent;
    console.log(id, row, col, value)
    // Lets make sure this tile is not yet discovered, and then send fire :)
    if (value !== ' ') {
      // TODO(edestefanis): warn something, the tile is already discovered.
    } else {
      console.log('sendRocket!')

      // Lets send a request to the backend! :D
      this.gameService.sendRocket(
        this.gameId, this.userService.getCurrentUserId(), row, col)
        .subscribe(
          ({data}) => {
            console.log(data.sendRocket.result)
            if (data.sendRocket.result.length === 1) {
              if (data.sendRocket.result === '.') {
                this.game.playerBoard[row][col] = 2
              } else {
                this.game.playerBoard[row][col] = 1
              }
            }
          }
        )
    }
  }
}


