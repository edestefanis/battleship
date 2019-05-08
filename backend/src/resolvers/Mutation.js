import Board from '../../models/board'
import User from '../../models/user'
import Game from '../../models/game'

import {
    getFullUserGame,
    getUserList,
    generateBoard,
    generateUnseenBoard
} from './utils'


const Mutation = {
    createUser: (parent, args, ctx, info) => {
        let user = new User({name: args.name})
        user.save()
        return user
    },
    deleteAllUsers: (parent, args, ctx, info) => {
        return User.deleteMany({}).exec().then((result) => result.deletedCount)
    },
    deleteAllGames: (parent, args, ctx, info) => {
        return Game.deleteMany({}).exec().then((result) => result.deletedCount)
    },
    createGame: (parent, args, ctx, info) => {
        let board1 = new Board({
            board: generateBoard(),
            unseen: generateUnseenBoard()
        })
        return board1.save().then((b1) => {
            let board2 = new Board({
                board: generateBoard(),
                unseen: generateUnseenBoard()
            })
            return board2.save().then((b2) => {
                let game = new Game({
                    turnUser1: true,
                    user1: args.userId1,
                    user2: args.userId2,
                    board1: b1._id,
                    board2: b2._id
                })

                return game.save().then((game) => {
                    return game
                })
            })
        })
    },
    sendRocket: (parent, args, { pubsub }, info) => {
        console.log('sendRocket!')
        return Game.findById(args.gameId).then((game) => {
            let boardId;
            if (game.turnUser1) {
                if (args.userId != game.user1) {
                    return { result: 'Invalid: not your turn.' }
                }
                boardId = game.board1
            } else {
                if (args.userId != game.user2) {
                    return { result: 'Invalid: not your turn.' }
                }
                boardId = game.board2
            }

            return Board.findById(boardId).then((board) => {
                // Lets make sure the tile hasn't been already discovered.
                if (board.unseen[args.row][args.column] != '#') {
                    return { result: 'Invalid: Tile has already been fired.' }
                }
                // Discover the tile, save it and return the actual element.
                board.unseen[args.row] = board.unseen[args.row].substr(0, args.column) + '.' + board.unseen[args.row].substr(args.column+1)
                if (game.turnUser1 === false) {
                    game.turnUser1 = true
                } else {
                    game.turnUser1 = false;
                }
               
                // TODO(edestefanis): fix this, it should go under a transaction
                board.markModified('unseen')
                return board.save().then((board) => {
                    return game.save().then(() => {
                        // Lets publish user games & lists changes, so the subscribers get to know about this.

                        // For user1.
                        const labelUserGame1 = 'user-game-' + game.user1 + '-' + args.gameId
                        pubsub.publish(labelUserGame1, { userGame: getFullUserGame(game.user1, args.gameId) })
                        const labelUser1 = 'user-list-' + game.user1
                        pubsub.publish(labelUser1, { userGame: getUserList(game.user1) })

                        // For user2.
                        const labelUserGame2 = 'user-game-' + game.user2 + '-' + args.gameId
                        pubsub.publish(labelUserGame2, { userGame: getFullUserGame(game.user2, args.gameId) })
                        const labelUser2 = 'user-list-' + game.user2
                        pubsub.publish(labelUser2, { userGame: getUserList(game.user2) })

                        return { result: board.board[args.row][args.column] }
                    })
                })
            })
        })
    }
}

export default Mutation;
