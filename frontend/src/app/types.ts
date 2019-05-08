export type UserGame = {
  gameId: string;
  status: string;
  opponentName: string;
  playerBoard: Number[][];
  opponentBoard: Number[][];
}

export type Query = {
  userGame: UserGame;
  userGames: UserGame[];
}

export type StringResult = {
  result: string;
}
export type Mutation ={
  sendRocket: StringResult;
}

// TODO(edestefanis): this should probably go in a different file.
export interface User {
  name: string;
  userId: string;
}
