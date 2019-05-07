import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import Board from '../../models/board'
import User from '../../models/user'
import Game from '../../models/game'



function getUserBoards(board1, board2) {
    // We assume 10x10 boards.
    let playerBoard = new Array(10).fill(null).map(() => new Array(10).fill(0))
    let opponentBoard = new Array(10).fill(null).map(() => new Array(10).fill(0))

    console.log(board1)
    console.log(board2)
    // For the user, it can only see the 'discovered' places.
    for (let i = 0; i < 10; ++i) {
        for (let j = 0; j < 10; ++j) {
            if (board1.unseen[i][j] !== '#') {
                if (board1.board[i][j] === '.') {
                    playerBoard[i][j] = 2
                } else {
                    playerBoard[i][j] = 1
                }
            }
        }
    }

    // For the opponent, we can just pass a codified board showing all the information.
    // For that, we just add 1000 to each number and we return that. 
    for (let i = 0; i < 10; ++i) {
        for (let j = 0; j < 10; ++j) {
            if (board2.board[i][j] === '.') {
                opponentBoard[i][j] = 0
            } else {
                opponentBoard[i][j] = parseInt(board2.board[i][j])
            }
            // Now we will add a big number if we haven't discovered this place.
            // We use 1000 so we can get the actual value in the board by just 
            // using mod1000.
            if (board2.unseen[i][j] !== '#') {
                opponentBoard += 1000
            }
        }
    }
    return [playerBoard,opponentBoard]
}

const Query = {
    users: () => {
        return User.find()
    },
    boards: () => {
        return Board.find()
    },
    games: () => {
        return Game.find()
    },
    userGames: (parent, args, ctx, info) => {
        return Game.find({
            $or: [
                { 'user1': args.userId },
                { 'user2': args.userId }
            ]}).then((games) => {
            
            let userGames = new Array()

            // An array for all the promises.
            let results = new Array()
            for (let i = 0; i < games.length; ++i) {
                let opponentUserId = games[i].user1
                let currentStatus = 'play'
                if (args.userId === games[i].user1) {
                    opponentUserId = games[i].user2
                    if (!games[i].turnUser1) {
                        currentStatus = 'pending'
                    }
                } else {
                    if (games[i].turnUser1) {
                        currentStatus = 'pending'
                    }
                }
                // Get the user to get the name.
                const gameId = games[i]._id
                results.push(User.findById(opponentUserId).then((user) => {
                    userGames.push({ 'gameId': gameId, 'opponentName': user.name, 'status': currentStatus }) 
                }))
            }
            return Promise.all(results).then(() => {return userGames})
        })
    }, userGame: (parent, args, ctx, info) => {
        console.log('Getting game for: ')
        console.log(args)
        return Game.findById(args.gameId).then((game) => {
            // Get the opponent name.
            let opponentId = game.user1
            if (game.user1 === args.userId) {
                opponentId = game.user2
            }
            return User.findById(opponentId).then((opponent) => {
                let status = 'play'
                if ((game.user1 === args.userId && !game.turnUser1) ||
                    (game.user2 === args.userId && game.turnUser1)) {
                    status = 'pending'
                }
                // Lets prepare the player's and opponent board.
                let boardId1 = game.board1
                let boardId2 = game.board2
                if(game.user1 !== args.userId) {
                    boardId1 = game.board2
                    boardId2 = game.board1
                }
                // Get the boards.
                return Board.findById(boardId1).then((board1) => {
                    return Board.findById(boardId2).then((board2) => {
                        let [playerBoard,opponentBoard] = getUserBoards(board1, board2)
                        console.log('Final to get user board full:')
                        console.log(status)
                        console.log(playerBoard)
                        return {
                            gameId: args.gameId,
                            opponentName: opponent.name,
                            status: status,
                            playerBoard: playerBoard,
                            opponentBoard: opponentBoard
                        }
                    })
                })
            })
        })
    }
};

export default Query;