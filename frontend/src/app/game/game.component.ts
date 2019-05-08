import { Component, OnInit, OnDestroy } from '@angular/core'
import { GameService } from '../game.service'
import { ActivatedRoute } from '@angular/router'
import { Observable, Subscription } from 'rxjs'


import { UserGame } from '../types'
import { UserService } from '../user.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  private gameId: String;
  game: UserGame;
  gameSubscription: Subscription;

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
    try {
    this.loadFullUserGame()
    } catch (error) {
      console.log(error)
    }
    try {
      this.gameSubscription = this.gameService.subscribeToGame(this.userService.getCurrentUserId(), this.gameId)
        .subscribe(({ data }) => {
          this.loadFullUserGame()
        });
    }
    catch(error) {
      console.error(error);
    }
  }

  async ngOnDestroy() {
    this.gameSubscription.unsubscribe()
  }

  async loadFullUserGame() {
    try {
      this.game = await this.gameService.getFullUserGame(
        this.userService.getCurrentUserId(),
        this.gameId)
    } catch (error) {
      console.log('Error while fetching the game: ' + this.gameId + ' for user: ' + this.userService.getCurrentUserId())
      console.log(error)
    }
  }

  async onTileClick(event: Event) {
    let id = (event.target as HTMLTableElement).id,
      row = parseInt(id.substring(1,2)), col = parseInt(id.substring(3,4)),
      value = (event.target as HTMLTableElement).textContent;
    // Lets make sure this tile is not yet discovered, and then send fire :)
    if (value !== ' ') {
      // TODO(edestefanis): warn something, the tile is already discovered.
    } else {
      // Lets send a request to the backend! :D
      this.gameService.sendRocket(
        this.gameId, this.userService.getCurrentUserId(), row, col)
        .subscribe(
          ({data}) => {
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


