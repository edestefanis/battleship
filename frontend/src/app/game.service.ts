import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

import { Query } from './types'

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private apollo: Apollo) { }

  getUserGames(userId: String) {
    console.log('Executing getUserGames query!')
    return this.apollo.watchQuery<Query>({
      query: gql`
        query userGames($userId: String!) {
          userGames(userId: $userId) {
            gameId
            opponentName
            status
          }
        }
      `,
      variables: {
        userId: userId
      }
    })
      .valueChanges
      .pipe(
        map((result) => result.data.userGames)
      )
  }
}
