import { Component, OnInit, OnDestroy } from '@angular/core'
import { Observable } from 'rxjs'

import { UserGame, User } from '../types'
import { GameService } from '../game.service'
import { UserService } from '../user.service'
import { MatOptionSelectionChange } from '@angular/material';
import { Subscription } from 'apollo-client/util/Observable';

@Component({
  selector: 'app-active-list',
  templateUrl: './active-list.component.html',
  styleUrls: ['./active-list.component.css']
})
export class ActiveListComponent implements OnInit, OnDestroy {
  games: UserGame[];
  userListSubscription: Subscription;
  users: User[];

  constructor(public gameService: GameService, public userService: UserService) {}

  async ngOnInit() {
    this.users = this.userService.getAllUsers()
    this.loadGamesList()
    this.userListSubscription = this.gameService.subscribeToUserList(
      this.userService.getCurrentUserId())
      .subscribe(({ data }) => {
        this.loadGamesList()
      });
  }

  ngOnDestroy() {
    this.userListSubscription.unsubscribe()
  }

  async loadGamesList() {
    this.games = await this.gameService.getUserGames(this.userService.getCurrentUserId())
  }

  async selectionChanged(event: MatOptionSelectionChange) {
    if (!event.isUserInput) return
    this.userService.setCurrentUserId(event.source.value)
    this.loadGamesList()
  }
}
