import Board from '../../models/board'
import User from '../../models/user'
import Game from '../../models/game'

function generateBoard() {
    let board = new Array()
    for (let i = 0; i < 10; ++i) {
        board.push("..........")
    }
    let shipsBySize = [-1, 4, 3, 2, 1]
    let shipIndex = 1
    // Lets start by trying to put the 4 spaces long ship.
    for (let shipSize = 4; shipSize > 0; shipSize--) {
        for (let cant = 0; cant < shipsBySize[shipSize]; cant++) {
            // Choose between a horizontal and a vertical ship.
            let shipDirection = Math.floor(Math.random() * 2);
            let freeCells = []
            for (let row = 0; row < 11 - shipSize; ++row) {
                for (let col = 0; col < 11 - shipSize; ++col) {
                    let availableOption = true
                    // Check if placing a ship starting on that cell is possible.
                    for (let j = 0; j < shipSize; ++j) {
                        if (board[row + j*shipDirection ][col + j*(1-shipDirection)] !== '.') {
                            availableOption = false
                        }
                    }
                    if (availableOption) {
                        freeCells.push({row, col, shipDirection})
                    }
                }
            }

            // Choose one of the options.
            let chosenOption = Math.floor(Math.random() * freeCells.length)

            // Lets place the ship on the board :).
            let chosenOptionRow = freeCells[chosenOption].row
            let chosenOptionCol = freeCells[chosenOption].col
            let chosenOptionDirection = freeCells[chosenOption].shipDirection

            for (let j = 0; j < shipSize; ++j) {
                let shipRow = chosenOptionRow + j*chosenOptionDirection
                let shipCol = chosenOptionCol + j*(1-chosenOptionDirection)
                board[shipRow] = board[shipRow].substr(0, shipCol) + String(shipIndex) + board[shipRow].substr(shipCol+1)
            }
            shipIndex++ 
        }
    }
    return board
}

function generateUnseenBoard() {
    let unseenBoard = new Array()
    for (let i = 0; i < 10; ++i) {
        unseenBoard.push("##########")
    }
    return unseenBoard
}

const Mutation = {
    createUser: (parent, args, ctx, info) => {
        let user = new User({name: args.name})
        user.save()
        return user
    },
    deleteAllUsers: (parent, args, ctx, info) => {
        return User.deleteMany({}).deletedCount
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
    sendRocket: (parent, args, ctx, info) => {
        console.log('sendRocket!')
        return Game.findById(args.gameId).then((game) => {
            let boardId;
            if (game.turnUser1) {
                if (args.userId != game.user1) {
                    //return 'Invalid: not your turn.'
                }
                boardId = game.board1
            } else {
                if (args.userId != game.user2) {
                    //return 'Invalid: not your turn.'
                }
                boardId = game.board2
            }

            return Board.findById(boardId).then((board) => {
                // Lets make sure the tile hasn't been already discovered.
                if (board.unseen[args.row][args.column] != '#') {
                    return 'Invalid: Tile has already been fired.'
                }
                // Discover the tile, save it and return the actual element.
                board.unseen[args.row] = board.unseen[args.row].substr(0, args.column) + '.' + board.unseen[args.row].substr(args.column+1)
                if (game.turnUser1 === false) {
                    game.turnUser1 = true
                } else {
                    game.turnUser1 = false;
                }
               
                // TODO(edestefanis): fix this, it should go under a transaction
                board.save()
                game.save()
                console.log('returning ' + board.board[args.row][args.column])
                return { result: board.board[args.row][args.column] }
            })
        })
    }
}

export default Mutation;
