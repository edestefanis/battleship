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
