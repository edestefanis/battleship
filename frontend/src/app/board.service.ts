import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, filter } from 'rxjs/operators';

import { Query, Board } from './types';

const GET_USER_BOARDS = gql`
  {
    boards {
      userId1
      userId2
      board
      unseen
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private apollo: Apollo) { }

  getUserBoards(userId: String) {
    return this.apollo.watchQuery({
      query: gql`
        query userBoards($userId: String) {
          userBoards(userId: $userId) {
            boards
            unseen
          }
        }
      `,
      variables: {
        userId: userId
      }
    });
  }
}
