import Board from '../../models/board'
import User from '../../models/user'


const Game = {
    user1(parent, args, ctx, info) {
        console.log('lalo')
        return User.findById(parent.user1)
    },
    user2(parent, args, ctx, info) {
        console.log('lali')
        return User.findById(parent.user2)
    },
    board1(parent, args, ctx, info) {
        console.log('lalu')
        return Board.findById(parent.board1)
    },
    board2(parent, args, ctx, info) {
        console.log('lalz')
        return Board.findById(parent.board1)
    }
}

export { Game as default }