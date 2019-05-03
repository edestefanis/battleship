export type Board = {
  userId1: string;
  userId2: string;
  board: string;
  unseen: string;
}

export type UserGame = {
  gameId: string;
  status: string;
  opponentName: string;
}

export type Query = {
  userGames: UserGame[];
}
