import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

import { Query, Mutation} from './types'

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private apollo: Apollo) { }

  async getFullUserGame(userId: String, gameId: String) {
    console.log('Executing getFullUserGame query!')
    console.log(userId)
    console.log(gameId)
    return this.apollo.query<Query>({
      query: gql`
        query userGame($userId: String!, $gameId: String!) {
          userGame(userId: $userId, gameId: $gameId) {
            gameId
            opponentName
            status
            playerBoard
            opponentBoard
          }
        }
      `,
      variables: {
        userId: userId,
        gameId: gameId
      }
    })
      .pipe(
        map((result) => result.data.userGame)
      ).toPromise()
  }

  getUserGames(userId: String) {
    console.log('Executing getUserGames query!')
    return this.apollo.query<Query>({
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
      .pipe(
        map((result) => result.data.userGames)
      ).toPromise()
  }

  sendRocket(gameId: String, userId: String, row: Number, column: Number) {
    console.log('here we are....')
   return this.apollo.mutate<Mutation>({
      mutation: gql`
        mutation sendRocket($gameId: String!, $userId: String!, $row: Int!, $column: Int!) {
          sendRocket(gameId: $gameId, userId: $userId, row: $row, column: $column) {
            result
          }
        }
      `,
      variables: {
        gameId: gameId,
        userId: userId,
        row: row,
        column: column
      }
    })
  }
}
