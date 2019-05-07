import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'

import { UserGame } from '../types'
import { GameService } from '../game.service'
import { UserService } from '../user.service'
import { MatOptionSelectionChange } from '@angular/material';

export interface User {
  name: string;
  userId: string;
}

@Component({
  selector: 'app-active-list',
  templateUrl: './active-list.component.html',
  styleUrls: ['./active-list.component.css']
})
export class ActiveListComponent implements OnInit {
  games: UserGame[];
  users: User[] = [
    {name: 'Eric', userId: '5cd1c80e80dd8973784de539'},
    {name: 'Jose', userId: '5cd1c82380dd8973784de53a'}
  ];

  constructor(public gameService: GameService, public userService: UserService) {}

  async ngOnInit() {
    this.userService.setCurrentUserId(this.users[0].userId)
    this.loadGamesList()
  }

  async loadGamesList() {
    this.games = await this.gameService.getUserGames(this.userService.getCurrentUserId())
    console.log(this.games)
  }

  async selectionChanged(event: MatOptionSelectionChange) {
    if (!event.isUserInput) return
    this.userService.setCurrentUserId(event.source.value)
    this.loadGamesList()
  }
}
