import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  private gameId: String;

  constructor(public gameService: GameService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('gameId')) {
        this.gameId = paramMap.get('gameId')
      }
      console.log('gameId: ')
      console.log(this.gameId)
    })
  }

}


